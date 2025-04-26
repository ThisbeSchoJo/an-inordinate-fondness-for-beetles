from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db

# Models go here!
class User(db.Model, SerializerMixin): 
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)

    sightings = db.relationship("Sighting", back_populates="user")
    friendships = db.relationship("Friendship", back_populates="user")

    def __repr__(self):
        return f"<User {self.username}, {self.email}, {self.password}>"
    
class Sighting(db.Model, SerializerMixin):
    __tablename__ = "sightings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    species_id = db.Column(db.Integer, db.ForeignKey("species.id"))
    location = db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String, nullable=False)
    image = db.Column(db.String, nullable=False)

    user = db.relationship("User", back_populates="sightings")
    species = db.relationship("Species", back_populates="sightings")

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
    
class Friend(db.Model, SerializerMixin):
    __tablename__ = "friends"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    friendships = db.relationship("Friendship", back_populates="friend")

    def __repr__(self):
        return f"<Friend: {self.name}>"
    
class Friendship(db.Model, SerializerMixin):
    __tablename__ = "friendships"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    friend_id = db.Column(db.Integer, db.ForeignKey("friends.id"))

    user = db.relationship("User", back_populates="friendships")
    friend = db.relationship("Friend", back_populates="friendships")

    def __repr__(self):
        return f"<Friendship {self.id} - User: {self.user.username}, Friend: {self.friend.name}>"   