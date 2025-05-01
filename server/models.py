from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
# import bcrypt

from config import db

# Models go here!
class User(db.Model, SerializerMixin): 
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String, nullable=False)
    # password_digest = db.Column(db.String, nullable=False)

    serialize_rules = ("-password", "-password_digest") # Hide password and password_digest from JSON responses

    sightings = db.relationship("Sighting", back_populates="user")
    # User's friendships where they are the user
    friendships = db.relationship("Friendship", 
                                foreign_keys="Friendship.user_id",
                                back_populates="user")
    # User's friendships where they are the friend
    friend_of = db.relationship("Friendship",
                              foreign_keys="Friendship.friend_id",
                              back_populates="friend")

    def __repr__(self):
        return f"<User {self.username}, {self.email}, {self.password}>"
    
class Sighting(db.Model, SerializerMixin):
    __tablename__ = "sightings"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String)
    timestamp = db.Column(db.DateTime)
    description = db.Column(db.String)
    image = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    species_id = db.Column(db.Integer, db.ForeignKey("species.id"))

    user = db.relationship("User", back_populates="sightings")
    species = db.relationship("Species", back_populates="sightings")

    serialize_rules = ('-user.sightings', '-species.sightings')

    def __repr__(self):
        return f"<Sighting {self.id} - Location: {self.location}, Timestamp: {self.timestamp}>"
    
class Species(db.Model, SerializerMixin):
    __tablename__ = "species"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    type = db.Column(db.String, nullable=False)
    scientific_name = db.Column(db.String, nullable=False, unique=True)

    sightings = db.relationship("Sighting", back_populates="species")

    def __repr__(self):
        return f"<Species: {self.name}, Type: {self.type}, Scientific Name: {self.scientific_name}>"

class Friendship(db.Model, SerializerMixin):
    __tablename__ = "friendships"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    friend_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    
    user = db.relationship("User", 
                          foreign_keys=[user_id],
                          back_populates="friendships")
    friend = db.relationship("User",
                           foreign_keys=[friend_id],
                           back_populates="friend_of")

    def __repr__(self):
        return f"<Friendship {self.id} - User: {self.user.username}, Friend: {self.friend.username}>"   
