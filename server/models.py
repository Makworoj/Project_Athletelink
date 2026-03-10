from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db


# ---------------- ATHLETE MODEL ---------------- #

class Athlete(db.Model, SerializerMixin):

    __tablename__ = "athletes"

    serialize_rules = ("-applications.athlete", "-scout.athletes")

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    sport = db.Column(db.String)
    country = db.Column(db.String)
    age = db.Column(db.Integer)

    scout_id = db.Column(db.Integer, db.ForeignKey("scouts.id"))

    scout = db.relationship("Scout", back_populates="athletes")

    applications = db.relationship("Application", back_populates="athlete")

    opportunities = association_proxy("applications", "opportunity")


# ---------------- SCOUT MODEL ---------------- #

class Scout(db.Model, SerializerMixin):

    __tablename__ = "scouts"

    serialize_rules = ("-athletes.scout", "-opportunities.scout")

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    organization = db.Column(db.String)
    country = db.Column(db.String)

    athletes = db.relationship("Athlete", back_populates="scout")

    opportunities = db.relationship("Opportunity", back_populates="scout")


# ---------------- OPPORTUNITY MODEL ---------------- #

class Opportunity(db.Model, SerializerMixin):

    __tablename__ = "opportunities"

    serialize_rules = ("-applications.opportunity", "-scout.opportunities")

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    club = db.Column(db.String)
    country = db.Column(db.String)

    scout_id = db.Column(db.Integer, db.ForeignKey("scouts.id"))

    scout = db.relationship("Scout", back_populates="opportunities")

    applications = db.relationship("Application", back_populates="opportunity")

    athletes = association_proxy("applications", "athlete")


# ---------------- APPLICATION MODEL ---------------- #

class Application(db.Model, SerializerMixin):

    __tablename__ = "applications"

    serialize_rules = ("-athlete.applications", "-opportunity.applications")

    id = db.Column(db.Integer, primary_key=True)

    status = db.Column(db.String)  # pending / accepted / rejected

    athlete_id = db.Column(db.Integer, db.ForeignKey("athletes.id"))
    opportunity_id = db.Column(db.Integer, db.ForeignKey("opportunities.id"))

    athlete = db.relationship("Athlete", back_populates="applications")
    opportunity = db.relationship("Opportunity", back_populates="applications")