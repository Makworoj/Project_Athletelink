#!/usr/bin/env python3

from random import randint, choice as rc
from faker import Faker

from app import app
from models import db, Athlete, Scout, Opportunity, Application


if __name__ == '__main__':

    fake = Faker()

    with app.app_context():

        print("Starting seed...")

        # ---------------- CLEAR DATABASE ---------------- #

        print("Clearing existing data...")

        Application.query.delete()
        Athlete.query.delete()
        Opportunity.query.delete()
        Scout.query.delete()

        db.session.commit()


        # ---------------- CREATE SCOUTS ---------------- #

        print("Creating scouts...")

        scouts = []

        for _ in range(3):

            scout = Scout(
                name=fake.name(),
                organization=fake.company(),
                country=fake.country(),
                email=fake.email(),
                password=fake.password(length=12)
            )

            scouts.append(scout)

        db.session.add_all(scouts)
        db.session.commit()

        print(f"Created {len(scouts)} scouts")


        # ---------------- CREATE ATHLETES ---------------- #

        print("Creating athletes...")

        sports = ["Football", "Basketball", "Athletics", "Tennis"]
        positions = ["Forward", "Midfielder", "Defender", "Goalkeeper"]

        athletes = []

        for _ in range(6):

            athlete = Athlete(
                name=fake.name(),
                sport=rc(sports),
                position=rc(positions),
                country=fake.country(),
                age=randint(18, 25),
                height=str(randint(160, 200)) + " cm",
                weight=str(randint(60, 90)) + " kg",
                achievements=fake.sentence(),
                email=fake.email(),
                password=fake.password(length=12)
            )

            athletes.append(athlete)

        db.session.add_all(athletes)
        db.session.commit()

        print(f"Created {len(athletes)} athletes")


        # ---------------- CREATE OPPORTUNITIES ---------------- #

        print("Creating opportunities...")

        sports_opportunities = [
            {"title": "Football Trial", "club": "FC Barcelona", "country": "Spain"},
            {"title": "Basketball Scholarship", "club": "Duke University", "country": "USA"},
            {"title": "Athletics Training Camp", "club": "Kenya National Athletics Camp", "country": "Kenya"},
            {"title": "Tennis Development Program", "club": "Rafael Nadal Academy", "country": "Spain"}
        ]

        opportunities = []

        for data in sports_opportunities:

            opportunity = Opportunity(
                title=data["title"],
                club=data["club"],
                country=data["country"],
                scout_id=rc(scouts).id
            )

            opportunities.append(opportunity)

        db.session.add_all(opportunities)
        db.session.commit()

        print(f"Created {len(opportunities)} opportunities")


        # ---------------- CREATE APPLICATIONS ---------------- #

        print("Creating applications...")

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

        print(f"Created {len(applications)} applications")


        # ---------------- SUMMARY ---------------- #

        print("Seeding complete!")

        print(f"Total scouts: {Scout.query.count()}")
        print(f"Total athletes: {Athlete.query.count()}")
        print(f"Total opportunities: {Opportunity.query.count()}")
        print(f"Total applications: {Application.query.count()}")