from config import db
from sqlalchemy_serializer import SerializerMixin


class Athlete(db.Model, SerializerMixin):

    __tablename__ = "athletes"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String)
    sport = db.Column(db.String)
    position = db.Column(db.String)
    country = db.Column(db.String)
    age = db.Column(db.Integer)

    height = db.Column(db.String)
    weight = db.Column(db.String)
    achievements = db.Column(db.String)

    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)

    applications = db.relationship("Application", backref="athlete")

    serialize_rules = (
        "-applications.athlete",
        "-password",
    )


class Scout(db.Model, SerializerMixin):

    __tablename__ = "scouts"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String)
    organization = db.Column(db.String)
    country = db.Column(db.String)

    email = db.Column(db.String, unique=True)
    password = db.Column(db.String)

    opportunities = db.relationship("Opportunity", backref="scout")

    serialize_rules = (
        "-opportunities.scout",
        "-password",
    )


class Opportunity(db.Model, SerializerMixin):

    __tablename__ = "opportunities"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String)
    club = db.Column(db.String)
    country = db.Column(db.String)

    scout_id = db.Column(db.Integer, db.ForeignKey("scouts.id"))

    applications = db.relationship("Application", backref="opportunity")

    serialize_rules = (
        "-applications.opportunity",
    )


class Application(db.Model, SerializerMixin):

    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)

    status = db.Column(db.String)

    athlete_id = db.Column(db.Integer, db.ForeignKey("athletes.id"))
    opportunity_id = db.Column(db.Integer, db.ForeignKey("opportunities.id"))

    serialize_rules = (
        "-athlete.applications",
        "-opportunity.applications",
    )