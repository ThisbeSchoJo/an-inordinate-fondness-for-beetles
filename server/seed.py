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

        # Create users with password hashing
        user1 = User(username="John Doe")
        user1.password_hash = "password123"  # This will trigger the hashing

        user2 = User(username="Jane Smith")
        user2.password_hash = "password456"  # This will trigger the hashing

        user3 = User(username="thisbe")
        user3.password_hash = "thisbe"  # This will trigger the hashing
        user3.profile_picture = "/static/uploads/thisbe.jpg"

        db.session.add(user1)
        db.session.add(user2)
        db.session.add(user3)
        db.session.commit()
        
        # Add bioluminescent species
        species_list = [
            # Fireflies (Lampyridae)
            Species(name="Common Eastern Firefly", type="Insect", scientific_name="Photinus pyralis"),
            Species(name="Pennsylvania Firefly", type="Insect", scientific_name="Photuris pensylvanica"),
            Species(name="Blue Ghost Firefly", type="Insect", scientific_name="Phausis reticulata"),
            Species(name="Synchronous Firefly", type="Insect", scientific_name="Photinus carolinus"),
            Species(name="Winter Firefly", type="Insect", scientific_name="Ellychnia corrusca"),
            Species(name="Florida Intertidal Firefly", type="Insect", scientific_name="Micronaspis floridana"),
            
            # Glowworms
            Species(name="European Glowworm", type="Insect", scientific_name="Lampyris noctiluca"),
            Species(name="New Zealand Glowworm", type="Insect", scientific_name="Arachnocampa luminosa"),
            
            # Other Bioluminescent Insects
            Species(name="Railroad Worm", type="Insect", scientific_name="Phrixothrix hirtus"),
            Species(name="Click Beetle", type="Insect", scientific_name="Pyrophorus noctilucus"),
            
            # Marine Bioluminescent Species
            Species(name="Dinoflagellate", type="Microorganism", scientific_name="Noctiluca scintillans"),
            Species(name="Bioluminescent Jellyfish", type="Marine", scientific_name="Aequorea victoria"),
            Species(name="Bioluminescent Squid", type="Marine", scientific_name="Watasenia scintillans"),
            
            # Fungi
            Species(name="Ghost Fungus", type="Fungus", scientific_name="Omphalotus nidiformis"),
            Species(name="Jack-O'-Lantern Mushroom", type="Fungus", scientific_name="Omphalotus olearius"),
            
            # Other Terrestrial Bioluminescent Species
            Species(name="Bioluminescent Millipede", type="Arthropod", scientific_name="Motyxia sequoiae"),
            Species(name="Bioluminescent Earthworm", type="Annelid", scientific_name="Diplocardia longa")
        ]

        for species in species_list:
            db.session.add(species)
        db.session.commit()
        
        # Add firefly sightings with coordinates
        firefly = Species.query.filter_by(scientific_name="Photinus pyralis").first()
        
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

        # Add Tampa/Clearwater area firefly sightings
        sighting3 = Sighting(
            location="Lettuce Lake Park, Tampa", 
            timestamp=datetime.strptime("2023-06-20 20:45", "%Y-%m-%d %H:%M"), 
            description="Fireflies along the boardwalk near the Hillsborough River", 
            image="https://example.com/firefly3.jpg", 
            user_id=user1.id, 
            species_id=firefly.id,
            latitude=28.0806,
            longitude=-82.3654
        )
        
        sighting4 = Sighting(
            location="Philippe Park, Safety Harbor", 
            timestamp=datetime.strptime("2023-06-21 21:15", "%Y-%m-%d %H:%M"), 
            description="Fireflies in the oak hammock near the water", 
            image="https://example.com/firefly4.jpg", 
            user_id=user2.id, 
            species_id=firefly.id,
            latitude=28.0008,
            longitude=-82.6965
        )
        
        sighting5 = Sighting(
            location="Moccasin Lake Nature Park, Clearwater", 
            timestamp=datetime.strptime("2023-06-22 20:30", "%Y-%m-%d %H:%M"), 
            description="Fireflies near the lake at dusk", 
            image="https://example.com/firefly5.jpg", 
            user_id=user1.id, 
            species_id=firefly.id,
            latitude=27.9914,
            longitude=-82.7689
        )

        db.session.add(sighting3)
        db.session.add(sighting4)
        db.session.add(sighting5)
        db.session.commit()

        # Create bidirectional friendship between users
        friendship1 = Friendship(user_id=user1.id, friend_id=user2.id)
        friendship2 = Friendship(user_id=user2.id, friend_id=user1.id)

        friendship3 = Friendship(user_id=user1.id, friend_id=user3.id)
        friendship4 = Friendship(user_id=user3.id, friend_id=user1.id)

        db.session.add(friendship1)
        db.session.add(friendship2)
        db.session.add(friendship3)
        db.session.add(friendship4)
        db.session.commit()
        
        print("Database seeded successfully!")


