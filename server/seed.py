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
        user1.profile_picture = "/static/uploads/john.jpg"

        user2 = User(username="Jane Smith")
        user2.password_hash = "password456"  # This will trigger the hashing
        user2.profile_picture = "/static/uploads/jane.png"

        user3 = User(username="Thisbe")
        user3.password_hash = "thisbe"  # This will trigger the hashing
        user3.profile_picture = "/static/uploads/thisbe.png"

        user4 = User(username="InsectHunter2000")
        user4.password_hash = "password789"
    

        db.session.add(user1)
        db.session.add(user2)
        db.session.add(user3)
        db.session.add(user4)
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
            place_guess="Central Park, New York", 
            observed_on=datetime.strptime("2023-06-15 20:30", "%Y-%m-%d %H:%M"), 
            description="Large group of fireflies near the pond", 
            photos="/static/uploads/firefly.jpeg", 
            latitude=40.7829,
            longitude=-73.9654,
            user_id=user1.id, 
            species_id=firefly.id
        )
        
        sighting2 = Sighting(
            place_guess="Prospect Park, Brooklyn", 
            observed_on=datetime.strptime("2023-06-16 21:00", "%Y-%m-%d %H:%M"), 
            description="Fireflies in the meadow", 
            photos="/static/uploads/firefly2.jpeg", 
            latitude=40.6602,
            longitude=-73.9690,
            user_id=user2.id, 
            species_id=firefly.id
        )

        db.session.add(sighting1)
        db.session.add(sighting2)

        # Tampa/Clearwater area firefly sightings
        sighting3 = Sighting(
            place_guess="Lettuce Lake Park, Tampa", 
            observed_on=datetime.strptime("2023-06-20 20:45", "%Y-%m-%d %H:%M"), 
            description="Fireflies along the boardwalk near the Hillsborough River", 
            photos="/static/uploads/firefly3.jpg", 
            latitude=28.0806,
            longitude=-82.3654,
            user_id=user1.id, 
            species_id=firefly.id
        )
        
        sighting4 = Sighting(
            place_guess="Philippe Park, Safety Harbor", 
            observed_on=datetime.strptime("2023-06-21 21:15", "%Y-%m-%d %H:%M"), 
            description="Fireflies in the oak hammock near the water", 
            photos="/static/uploads/firefly4.jpeg", 
            latitude=28.0008,
            longitude=-82.6965,
            user_id=user2.id, 
            species_id=firefly.id
        )
        
        sighting5 = Sighting(
            place_guess="Moccasin Lake Nature Park, Clearwater", 
            observed_on=datetime.strptime("2023-06-22 20:30", "%Y-%m-%d %H:%M"), 
            description="Fireflies near the lake at dusk", 
            photos="/static/uploads/firefly5.png", 
            latitude=27.9914,
            longitude=-82.7689,
            user_id=user1.id, 
            species_id=firefly.id
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
        
        # Add sightings for thisbe
        thisbe_sightings = [
            Sighting(
                place_guess="Lettuce Lake Park, Tampa",
                observed_on=datetime.strptime("2023-06-15 20:30", "%Y-%m-%d %H:%M"),
                description="Saw several fireflies near the boardwalk",
                photos="/static/uploads/firefly.jpeg",
                latitude=28.0797,
                longitude=-82.3697,
                user_id=user3.id,
                species_id=firefly.id
            ),
            Sighting(
                place_guess="Hillsborough River State Park",
                observed_on=datetime.strptime("2023-06-16 21:00", "%Y-%m-%d %H:%M"),
                description="Large group of fireflies near the river",
                photos="/static/uploads/firefly2.jpeg",
                latitude=28.1489,
                longitude=-82.2314,
                user_id=user3.id,
                species_id=firefly.id
            ),
            Sighting(
                place_guess="Al Lopez Park, Tampa",
                observed_on=datetime.strptime("2023-06-17 20:45", "%Y-%m-%d %H:%M"),
                description="Fireflies in the wooded area",
                photos="/static/uploads/firefly3.jpg",
                latitude=27.9789,
                longitude=-82.4897,
                user_id=user3.id,
                species_id=firefly.id
            ),
            Sighting(
                place_guess="Upper Tampa Bay Park",
                observed_on=datetime.strptime("2023-06-18 21:15", "%Y-%m-%d %H:%M"),
                description="Fireflies along the trail",
                photos="/static/uploads/firefly4.jpeg",
                latitude=28.0897,
                longitude=-82.5897,
                user_id=user3.id,
                species_id=firefly.id
            ),
            Sighting(
                place_guess="Eureka Springs Park, Tampa",
                observed_on=datetime.strptime("2023-06-19 20:30", "%Y-%m-%d %H:%M"),
                description="Fireflies in the garden area",
                photos="https://example.com/firefly5.jpg",
                latitude=27.9789,
                longitude=-82.3897,
                user_id=user3.id,
                species_id=firefly.id
            )
        ]

        for sighting in thisbe_sightings:
            db.session.add(sighting)
        db.session.commit()
        
        print("Database seeded successfully!")


