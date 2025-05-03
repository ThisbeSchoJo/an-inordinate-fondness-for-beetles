#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, make_response, abort, session, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from werkzeug.exceptions import NotFound, Unauthorized
from datetime import datetime
import os
from flask_bcrypt import Bcrypt

# Local imports
from config import app, db, api, bcrypt
# Add your model imports
from models import User, Sighting, Species, Friendship

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Users(Resource):
    def post(self):
        try:
            form_json = request.get_json()
            print("Received signup data:", form_json)  # Debug log
            
            if not form_json.get("username") or not form_json.get("password"):
                abort(400, "Username and password are required")
            
            # Check if username already exists
            existing_user = User.query.filter_by(username=form_json.get("username")).first()
            if existing_user:
                return make_response({"error": "Username already exists"}, 409)
            
            new_user = User(
                username=form_json.get("username")
            )
            
            # Set the password using the property
            new_user.password_hash = form_json.get("password")
            
            print("Created new user:", new_user)  # Debug log
            
            db.session.add(new_user)
            db.session.commit()
            
            #Set the session so user stays logged in
            session["user_id"] = new_user.id
            response = make_response(
                new_user.to_dict(rules=("-_password_hash",)), 
                201
            )
            return response
        except Exception as e:
            import traceback
            print("Error in signup:", str(e))  # Debug log
            print("Full traceback:", traceback.format_exc())  # Debug log
            db.session.rollback()
            return make_response({"error": str(e)}, 500)
api.add_resource(Users, "/signup")

class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            print("Received login data:", data)  # Debug log
            
            user = User.query.filter_by(username=data.get("username")).first()
            if user and user.authenticate(data.get("password")):
                session["user_id"] = user.id
                response = make_response(
                    user.to_dict(rules=("-_password_hash",)),
                    200
                )
                return response
            else:
                return make_response({"error": "Invalid username or password"}, 401)
        except Exception as e:
            import traceback
            print("Error in login:", str(e))  # Debug log
            print("Full traceback:", traceback.format_exc())  # Debug log
            return make_response({"error": str(e)}, 500)

class Logout(Resource):
    def delete(self):
        try:
            session.pop("user_id", None)
            return make_response({}, 204)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

class CheckSession(Resource):
    def get(self):
        try:
            user_id = session.get("user_id")
            if user_id:
                user = User.query.filter_by(id=user_id).first()
                if user:
                    return make_response(
                        user.to_dict(rules=("-_password_hash",)),
                        200
                    )
            return make_response({"error": "Unauthorized"}, 401)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, "/check_session")

class Sightings(Resource):
    def get(self):
        sightings = [sighting.to_dict() for sighting in Sighting.query.all()]
        return make_response(sightings, 200)

    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            abort(401, "Unauthorized")
        
        data = request.get_json()

        new_sighting = Sighting(
            species_id=data.get("species_id"),
            location=data.get("location"),
            timestamp=data.get("timestamp"),
            description=data.get("description"),
            image=data.get("image"),
            user_id=user_id
        )
        db.session.add(new_sighting)
        db.session.commit()
        response = make_response(
            new_sighting.to_dict(),
            201
        )
        return response 
api.add_resource(Sightings, "/sightings")

class SightingsById(Resource):
    def get(self, id):
        sighting = Sighting.query.filter_by(id=id).first()
        if not sighting:
            abort(404, "Sighting not found")
        response = make_response(
            sighting.to_dict(),
            200
        )
        return response
    
    def patch(self, id):
        user_id = session.get("user_id")
        if not user_id:
            abort(401, "Unauthorized")
        sighting = Sighting.query.filter_by(id=id).first()
        if not sighting:
            abort(404, "Sighting not found")
        if sighting.user_id != user_id:
            abort(403, "Unauthorized")
        data = request.get_json()
        for attr in data:
            setattr(sighting, attr, data[attr])
        db.session.commit()
        response = make_response(
            sighting.to_dict(),
            200
        )
        return response
    
    def delete(self, id):
        user_id = session.get("user_id")
        if not user_id:
            abort(401, "Unauthorized")
        sighting = Sighting.query.filter_by(id=id).first()
        if not sighting:
            abort(404, "Sighting not found")
        if sighting.user_id != user_id:
            abort(403, "Forbidden: You do not have permission to delete this sighting")
        db.session.delete(sighting)
        db.session.commit()

        response = make_response("", 204)
        return response

api.add_resource(SightingsById, "/sightings/<int:id>")
    

if __name__ == '__main__':
    app.run(port=5555, debug=True)
