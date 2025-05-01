#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Sighting, Species, Friendship

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # Clear existing data
        print("Clearing existing data...")
        Sighting.query.delete()
        Species.query.delete()
        User.query.delete()
        Friendship.query.delete()
        db.session.commit()
        print("Existing data cleared.")
        
        # Seed code goes here!
        print("Adding new data...")

        user1 = User(username="John Doe", password="password123")
        user2 = User(username="Jane Smith", password="password456")

        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()
        
        # Add firefly species
        firefly = Species(
            name="Common Eastern Firefly", 
            type="Insect", 
            scientific_name="Photinus pyralis"
        )
        db.session.add(firefly)
        db.session.commit()
        
        # Add firefly sightings with coordinates
        sighting1 = Sighting(
            location="Central Park, New York", 
            timestamp=datetime.strptime("2023-06-15 20:30", "%Y-%m-%d %H:%M"), 
            description="Large group of fireflies near the pond", 
            image="https://example.com/firefly1.jpg", 
            user_id=user1.id, 
            species_id=firefly.id,
            latitude=40.7829,
            longitude=-73.9654
        )
        
        sighting2 = Sighting(
            location="Prospect Park, Brooklyn", 
            timestamp=datetime.strptime("2023-06-16 21:00", "%Y-%m-%d %H:%M"), 
            description="Fireflies in the meadow", 
            image="https://example.com/firefly2.jpg", 
            user_id=user2.id, 
            species_id=firefly.id,
            latitude=40.6602,
            longitude=-73.9690
        )

        db.session.add(sighting1)
        db.session.add(sighting2)
        db.session.commit()

        # Create bidirectional friendship between users
        friendship1 = Friendship(user_id=user1.id, friend_id=user2.id)
        friendship2 = Friendship(user_id=user2.id, friend_id=user1.id)

        db.session.add(friendship1)
        db.session.add(friendship2)
        db.session.commit()
        
        print("Database seeded successfully!")


