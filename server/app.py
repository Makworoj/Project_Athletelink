#!/usr/bin/env python3

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import Athlete, Scout, Opportunity, Application


# ---------------- ROOT ROUTE ---------------- #

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


# =====================================================
# ATHLETE RESOURCES
# =====================================================

class AthleteList(Resource):

    def get(self):

        athletes = Athlete.query.all()

        athlete_list = [
            {
                "id": athlete.id,
                "name": athlete.name,
                "sport": athlete.sport,
                "country": athlete.country,
                "age": athlete.age,
                "scout_id": athlete.scout_id
            }
            for athlete in athletes
        ]

        return athlete_list, 200


    def post(self):

        data = request.get_json()

        new_athlete = Athlete(
            name=data["name"],
            sport=data.get("sport"),
            country=data.get("country"),
            age=data.get("age"),
            scout_id=data.get("scout_id")
        )

        db.session.add(new_athlete)
        db.session.commit()

        return new_athlete.to_dict(), 201


class AthleteByID(Resource):

    def get(self, id):

        athlete = Athlete.query.get(id)

        if not athlete:
            return {"error": "Athlete not found"}, 404

        return athlete.to_dict(), 200

class AthleteOpportunities(Resource):

    def get(self, id):

        athlete = Athlete.query.get(id)

        if not athlete:
            return {"error": "Athlete not found"}, 404

        opportunities = [
            opportunity.to_dict()
            for opportunity in athlete.opportunities
        ]

        return opportunities, 200


# =====================================================
# SCOUT RESOURCES
# =====================================================

class ScoutList(Resource):

    def get(self):

        scouts = Scout.query.all()

        scout_list = [
            {
                "id": scout.id,
                "name": scout.name,
                "organization": scout.organization,
                "country": scout.country
            }
            for scout in scouts
        ]

        return scout_list, 200


    def post(self):

        data = request.get_json()

        new_scout = Scout(
            name=data["name"],
            organization=data.get("organization"),
            country=data.get("country")
        )

        db.session.add(new_scout)
        db.session.commit()

        return new_scout.to_dict(), 201


class ScoutByID(Resource):

    def get(self, id):

        scout = Scout.query.get(id)

        if not scout:
            return {"error": "Scout not found"}, 404

        return scout.to_dict(), 200


# =====================================================
# OPPORTUNITY RESOURCES
# =====================================================

class OpportunityList(Resource):

    def get(self):

        opportunities = Opportunity.query.all()

        opportunity_list = [
            {
                "id": opp.id,
                "title": opp.title,
                "club": opp.club,
                "country": opp.country,
                "scout_id": opp.scout_id
            }
            for opp in opportunities
        ]

        return opportunity_list, 200


    def post(self):

        data = request.get_json()

        new_opportunity = Opportunity(
            title=data["title"],
            club=data.get("club"),
            country=data.get("country"),
            scout_id=data.get("scout_id")
        )

        db.session.add(new_opportunity)
        db.session.commit()

        return new_opportunity.to_dict(), 201


class OpportunityByID(Resource):

    def get(self, id):

        opportunity = Opportunity.query.get(id)

        if not opportunity:
            return {"error": "Opportunity not found"}, 404

        return opportunity.to_dict(), 200


# =====================================================
# APPLICATION RESOURCES
# =====================================================

class ApplicationList(Resource):

    def get(self):

        applications = Application.query.all()

        application_list = [
            {
                "id": app.id,
                "status": app.status,
                "athlete_id": app.athlete_id,
                "opportunity_id": app.opportunity_id
            }
            for app in applications
        ]

        return application_list, 200


    def post(self):

        data = request.get_json()

        new_application = Application(
            status=data["status"],
            athlete_id=data["athlete_id"],
            opportunity_id=data["opportunity_id"]
        )

        db.session.add(new_application)
        db.session.commit()

        return new_application.to_dict(), 201


class ApplicationByID(Resource):

    def get(self, id):

        application = Application.query.get(id)

        if not application:
            return {"error": "Application not found"}, 404

        return application.to_dict(), 200


# =====================================================
# REGISTER ROUTES
# =====================================================

api.add_resource(AthleteList, '/athletes')
api.add_resource(AthleteByID, '/athletes/<int:id>')
api.add_resource(AthleteOpportunities, '/athletes/<int:id>/opportunities')

api.add_resource(ScoutList, '/scouts')
api.add_resource(ScoutByID, '/scouts/<int:id>')

api.add_resource(OpportunityList, '/opportunities')
api.add_resource(OpportunityByID, '/opportunities/<int:id>')

api.add_resource(ApplicationList, '/applications')
api.add_resource(ApplicationByID, '/applications/<int:id>')


# =====================================================
# RUN SERVER
# =====================================================

if __name__ == '__main__':
    app.run(port=5555, debug=True)