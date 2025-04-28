#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, make_response, abort, session, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource
from werkzeug.exceptions import NotFound, Unauthorized
from flask_cors import CORS

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
            email=form_json.get("email")
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
api.add_resource(Users, "/users")


if __name__ == '__main__':
    app.run(port=5555, debug=True)

