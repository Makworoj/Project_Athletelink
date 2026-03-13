#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Athlete, Scout, Opportunity, Application

if __name__ == '__main__':
    fake = Faker()

    with app.app_context():
        print("Starting seed...")

        # ---------------- CLEAR DATABASE ---------------- #

        Application.query.delete()
        Athlete.query.delete()
        Opportunity.query.delete()
        Scout.query.delete()


        # ---------------- CREATE SCOUTS ---------------- #

        scouts = []

        for _ in range(3):
            scout = Scout(
                name=fake.name(),
                organization=fake.company(),
                country=fake.country()
            )

            scouts.append(scout)

        db.session.add_all(scouts)
        db.session.commit()


        # ---------------- CREATE ATHLETES ---------------- #

        sports = ["Football", "Basketball", "Athletics", "Tennis"]

        athletes = []

        for _ in range(6):
            athlete = Athlete(
                name=fake.name(),
                sport=rc(sports),
                country=fake.country(),
                age=randint(18, 25),
                scout_id=rc(scouts).id
            )

            athletes.append(athlete)

        db.session.add_all(athletes)
        db.session.commit()


        # ---------------- CREATE OPPORTUNITIES ---------------- #

        opportunities = []

        for _ in range(4):
            opportunity = Opportunity(
                title=fake.job(),
                club=fake.company(),
                country=fake.country(),
                scout_id=rc(scouts).id
            )

            opportunities.append(opportunity)

        db.session.add_all(opportunities)
        db.session.commit()


        # ---------------- CREATE APPLICATIONS ---------------- #

        statuses = ["pending", "accepted", "rejected"]

        applications = []

        for _ in range(5):
            application = Application(
                status=rc(statuses),
                athlete_id=rc(athletes).id,
                opportunity_id=rc(opportunities).id
            )

            applications.append(application)

        db.session.add_all(applications)
        db.session.commit()


        print("Seeding complete!")