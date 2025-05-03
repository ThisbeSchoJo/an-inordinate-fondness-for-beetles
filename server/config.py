#!/usr/bin/env python3

# Standard library imports
import os

# Remote library imports
from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Set the secret key for session management
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)

# Instantiate bcrypt
bcrypt = Bcrypt(app)

# Instantiate REST API
api = Api(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize db
db.init_app(app)

# Configure CORS
CORS(app, 
     origins=["http://localhost:3000"],
     supports_credentials=True,
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Authorization"])
