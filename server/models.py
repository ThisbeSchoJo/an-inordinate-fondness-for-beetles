from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db

# Models go here!
class DyeMaterial(db.Model, SerializerMixin):
    __tablename__ = 'dyematerials'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=True)
    base_color = db.Column(db.String, nullable=True)
    image = db.Column(db.String, nullable=False)

    @validates('name', 'base_color', 'image')
    def validate_location(self, column_name, value):
        if type(value) != str:
            raise TypeError(f"{column_name} must be a string!")
        elif len(value) < 4:
            raise ValueError(f"{column_name} must be at least 5 characters long!")
        else:
            return value
        
    def __repr__(self):
        return f"<Dye Material {self.id} - Name: {self.name}, Base Color: {self.base_color}, Image: {self.image}>"
