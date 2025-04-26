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

        user1 = User(username="John Doe", email="john.doe@example.com", password="password123")
        user2 = User(username="Jane Smith", email="jane.smith@example.com", password="password456")

        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()
        
        species1 = Species(name="Tiger", type="Mammal", scientific_name="Panthera tigris")
        species2 = Species(name="Eagle", type="Bird", scientific_name="Aquila chrysaetos")

        db.session.add(species1)
        db.session.add(species2)
        db.session.commit()
        
        sighting1 = Sighting(
            location="Jungle", 
            timestamp=datetime.strptime("2023-01-15", "%Y-%m-%d"), 
            description="Seen in the jungle", 
            image="tiger.jpg", 
            user_id=user1.id, 
            species_id=species1.id
        )
        sighting2 = Sighting(
            location="Sky", 
            timestamp=datetime.strptime("2023-01-16", "%Y-%m-%d"), 
            description="Seen in the sky", 
            image="eagle.jpg", 
            user_id=user2.id, 
            species_id=species2.id
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


