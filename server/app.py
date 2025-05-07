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

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Users(Resource):
    def post(self):
        try:
            data = request.form
            print("Received signup data:", data)  # Debug log
            
            if not data or 'username' not in data or 'password' not in data:
                return make_response({"error": "Username and password are required"}, 400)
            
            username = data['username']
            password = data['password']

            # Validate password
            if not password or len(password.strip()) == 0:
                return make_response({"error": "Password cannot be empty"}, 400)

            # Check if username already exists
            existing_user = User.query.filter_by(username=username).first()
            if existing_user:
                return make_response({"error": "Username already exists"}, 409)
            
            # Handle file
            file = request.files.get('profile_picture')
            profile_pic_path = None
            if file:
                if file.filename == '':
                    return make_response({"error": "No selected file"}, 400)
                
                # Create a unique filename
                file_ext = os.path.splitext(file.filename)[1]
                filename = f"{username}{file_ext}"
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                profile_pic_path = f"/static/uploads/{filename}"
            
            new_user = User(
                username=username,
                profile_picture=profile_pic_path
            )
            
            # Set the password using the property
            new_user.password_hash = password
                        
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
            
            if not data or 'username' not in data or 'password' not in data:
                return make_response({"error": "Username and password are required"}, 400)
            
            user = User.query.filter_by(username=data.get("username")).first()
            if not user:
                return make_response({"error": "User not found"}, 404)
                
            if not user.authenticate(data.get("password")):
                return make_response({"error": "Invalid password"}, 401)
                
            session["user_id"] = user.id
            response = make_response(
                user.to_dict(rules=("-_password_hash",)),
                200
            )
            return response
            
        except Exception as e:
            import traceback
            print("Error in login:", str(e))  # Debug log
            print("Full traceback:", traceback.format_exc())  # Debug log
            return make_response({"error": str(e)}, 500)

api.add_resource(Login, "/login")

class Logout(Resource):
    def delete(self):
        try:
            session.pop("user_id", None)
            return make_response({}, 204)
        except Exception as e:
            return make_response({"error": str(e)}, 500)

api.add_resource(Logout, "/logout")

class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return make_response({"error": "Unauthorized"}, 401)
            
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
            
        return make_response(user.to_dict(rules=("-_password_hash",)), 200)

api.add_resource(CheckSession, "/check_session")

class Sightings(Resource):
    def get(self):
        # Check if location parameters are provided
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        radius = request.args.get('radius', 10)  # Default radius of 10km
        
        if lat and lng:
            try:
                lat = float(lat)
                lng = float(lng)
                radius = float(radius)
                
                # Query sightings within the specified radius
                sightings = Sighting.query.filter(
                    Sighting.latitude.between(lat - radius/111, lat + radius/111),
                    Sighting.longitude.between(lng - radius/111, lng + radius/111)
                ).all()
            except (ValueError, TypeError):
                abort(400, "Invalid latitude, longitude, or radius parameters")
        else:
            # If no location parameters, return all sightings
            sightings = Sighting.query.all()
            
        return make_response([sighting.to_dict() for sighting in sightings], 200)

    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            abort(401, "Unauthorized")
        
        data = request.get_json()

        timestamp = datetime.strptime(data.get("timestamp"), "%Y-%m-%dT%H:%M")

        new_sighting = Sighting(
            species_id=data.get("species_id"),
            location=data.get("location"),
            timestamp=timestamp,
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
        sighting = db.session.get(Sighting, id)
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
        sighting = db.session.get(Sighting, id)
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
        sighting = db.session.get(Sighting, id)
        if not sighting:
            abort(404, "Sighting not found")
        if sighting.user_id != user_id:
            abort(403, "Forbidden: You do not have permission to delete this sighting")
        db.session.delete(sighting)
        db.session.commit()

        response = make_response("", 204)
        return response

api.add_resource(SightingsById, "/sightings/<int:id>")
 
class FriendSearch(Resource):
    def get(self):
        # Check if user is logged in
        user_id = session.get("user_id")
        if not user_id:
            abort(401, "Please log in to search for friends")
            
        # Get search term
        search_term = request.args.get('username')
        if not search_term:
            abort(400, "Please enter a username to search")

        # Query database, excluding current user
        users = User.query.filter(
            User.username.ilike(f"%{search_term}%"),
            User.id != user_id  # Exclude current user
        ).all()
        
        # Return only necessary fields
        return make_response([
            {
                "id": user.id,
                "username": user.username,
                "profile_picture": user.profile_picture
            } for user in users
        ], 200)
api.add_resource(FriendSearch, "/friend-search")

class AddFriend(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            abort(401, "Unauthorized")
            
        data = request.get_json()   
        friend_id = data.get("friend_id")
        
        # Check if friend exists
        friend = db.session.get(User, friend_id)
        if not friend:
            abort(404, "Friend not found")
            
        # Check if already friends
        existing_friendship = Friendship.query.filter(
            ((Friendship.user_id == user_id) & (Friendship.friend_id == friend_id)) |
            ((Friendship.user_id == friend_id) & (Friendship.friend_id == user_id))
        ).first()
        
        if existing_friendship:
            abort(400, "Already friends")
            
        # Create both sides of the friendship
        friendship1 = Friendship(user_id=user_id, friend_id=friend_id)
        friendship2 = Friendship(user_id=friend_id, friend_id=user_id)
        
        db.session.add(friendship1)
        db.session.add(friendship2)
        db.session.commit()
        
        return make_response({"message": "Friend added successfully"}, 201)
api.add_resource(AddFriend, "/add-friend")

class Friends(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            abort(401, "Unauthorized")
            
        # Get all friendships where user is either the initiator or the friend
        friendships = Friendship.query.filter(
            (Friendship.user_id == user_id) | (Friendship.friend_id == user_id)
        ).all()
        
        # Get the friend users
        friend_ids = [f.friend_id if f.user_id == user_id else f.user_id for f in friendships]
        friends = User.query.filter(User.id.in_(friend_ids)).all()
        
        return make_response([friend.to_dict() for friend in friends], 200)
api.add_resource(Friends, "/friends")

class RemoveFriend(Resource):
    def delete(self, friend_id):
        user_id = session.get("user_id")
        if not user_id:
            abort(401, "Unauthorized")
        
        # Check if friendship exists
        friendship = Friendship.query.filter(
            ((Friendship.user_id == user_id) & (Friendship.friend_id == friend_id)) |
            ((Friendship.user_id == friend_id) & (Friendship.friend_id == user_id))
        ).first()
        
        if not friendship:
            abort(404, "Friendship not found")
        # Delete both sides of the friendship
        db.session.delete(friendship)
        db.session.commit()
        
        return make_response({"message": "Friend removed successfully"}, 204)
api.add_resource(RemoveFriend, "/friends/<int:friend_id>")

class SpeciesList(Resource):
    def get(self):
        species_list = Species.query.all()
        return make_response([species.to_dict() for species in species_list], 200)
api.add_resource(SpeciesList, "/species")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
