#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, make_response, abort, session, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource
from werkzeug.exceptions import NotFound, Unauthorized

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Sighting, Species, Friendship


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Users(Resource):
    def post(self):
        form_json = request.get_json()
        new_user = User(
            username=form_json.get("username"),
            password=form_json.get("password"),
            # email=form_json.get("email")
        )
        db.session.add(new_user)
        db.session.commit()
        #Set the session so user stays logged in
        session["user_id"] = new_user.id
        response = make_response(
            new_user.to_dict(rules=("-password","-password_digest")), 
            201
        )
        return response
api.add_resource(Users, "/signup")

class Login(Resource):
    # POST request to handle login requests
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get("username")).first()
        if user and user.password == data.get("password"):
            session["user_id"] = user.id
            response = make_response(
                user.to_dict(),
                200
            )
            return response
        else:
            abort(401, "Invalid username")
api.add_resource(Login,"/login")

class AuthorizedSession(Resource):
    def get(self):
        # Get the user from the session
        user = User.query.filter_by(id=session.get("user_id")).first()
        # If the user is found, return the user's data
        if user:
            response = make_response(
                user.to_dict(),
                200
            )
            return response
        else:
            abort(401, "Unauthorized")
api.add_resource(AuthorizedSession, "/authorized")

class Logout(Resource):
    def delete(self):
        # Clear the session
        session["user_id"] = None
        response = make_response("", 204)
        return response
api.add_resource(Logout, "/logout")

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
