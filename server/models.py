from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from flask_bcrypt import Bcrypt

from config import db, bcrypt

# Models go here!
class User(db.Model, SerializerMixin): 
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True)
    profile_picture = db.Column(db.String)
    # password_digest = db.Column(db.String, nullable=False)

    # Update serialization rules to prevent circular references
    serialize_rules = (
        "-sightings.user",
        "-friendships.user",
        "-friend_of.friend",
        "-_password_hash",
        "-friendships.friend",
        "-friend_of.user"
    )

    sightings = db.relationship("Sighting", back_populates="user")
    # User's friendships where they are the user
    friendships = db.relationship("Friendship", 
                                foreign_keys="Friendship.user_id",
                                back_populates="user")
    # User's friendships where they are the friend
    friend_of = db.relationship("Friendship",
                              foreign_keys="Friendship.friend_id",
                              back_populates="friend")

    # Property to get the password hash
    @property
    def password_hash(self):
        return self._password_hash

    # Property to set the password hash
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Method to authenticate the user
    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def set_password(self, password):
        if not password:
            raise ValueError("Password cannot be empty")
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f"<User {self.username}, {self.email}>"
    
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

    serialize_rules = (
        "-user",  # skip full user object
        "-friend._password_hash",
        "-friend.sightings",
        "-friend.friendships",
        "-friend.friend_of",
    )
    
    def __repr__(self):
        return f"<Friendship {self.id} - User: {self.user.username}, Friend: {self.friend.username}>"   
