# ---------------- IMPORTS ---------------- #

from flask import request
from flask_restful import Resource
from config import app, db, api
from models import Athlete, Scout, Opportunity, Application


# ---------------- ROOT ROUTE ---------------- #

@app.route('/')
def index():
    return {"message": "AthleteLink API Running"}, 200


# ---------------- LOGIN ROUTE ---------------- #

@app.route('/login', methods=['POST'])
def login():

    data = request.get_json() or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password required"}, 400

    athlete = Athlete.query.filter_by(email=email).first()

    if athlete and athlete.password == password:
        return {
            "role": "athlete",
            "user": athlete.to_dict()
        }, 200

    scout = Scout.query.filter_by(email=email).first()

    if scout and scout.password == password:
        return {
            "role": "scout",
            "user": scout.to_dict()
        }, 200

    return {"error": "Invalid credentials"}, 401


# ---------------- ATHLETES ---------------- #

class AthleteList(Resource):

    def get(self):

        athletes = Athlete.query.all()

        return [a.to_dict() for a in athletes], 200


    def post(self):

        data = request.get_json() or {}

        if not data.get("email") or not data.get("password"):
            return {"error": "Email and password required"}, 400

        athlete = Athlete(
            name=data.get("name"),
            sport=data.get("sport"),
            position=data.get("position"),
            country=data.get("country"),
            age=data.get("age"),
            height=data.get("height"),
            weight=data.get("weight"),
            achievements=data.get("achievements"),
            email=data.get("email"),
            password=data.get("password")
        )

        db.session.add(athlete)
        db.session.commit()

        return athlete.to_dict(), 201


class AthleteDetail(Resource):

    def get(self, id):

        athlete = Athlete.query.get(id)

        if not athlete:
            return {"error": "Athlete not found"}, 404

        return athlete.to_dict(), 200


    def patch(self, id):

        athlete = Athlete.query.get(id)

        if not athlete:
            return {"error": "Athlete not found"}, 404

        data = request.get_json() or {}

        athlete.name = data.get("name", athlete.name)
        athlete.country = data.get("country", athlete.country)
        athlete.sport = data.get("sport", athlete.sport)
        athlete.position = data.get("position", athlete.position)
        athlete.age = data.get("age", athlete.age)
        athlete.height = data.get("height", athlete.height)
        athlete.weight = data.get("weight", athlete.weight)
        athlete.achievements = data.get("achievements", athlete.achievements)

        db.session.commit()

        return athlete.to_dict(), 200


    def delete(self, id):

        athlete = Athlete.query.get(id)

        if not athlete:
            return {"error": "Athlete not found"}, 404

        db.session.delete(athlete)
        db.session.commit()

        return {"message": "Athlete deleted"}, 200


# ---------------- SCOUTS ---------------- #

class ScoutList(Resource):

    def get(self):

        scouts = Scout.query.all()

        return [s.to_dict() for s in scouts], 200


    def post(self):

        data = request.get_json() or {}

        if not data.get("email") or not data.get("password"):
            return {"error": "Email and password required"}, 400

        scout = Scout(
            name=data.get("name"),
            organization=data.get("organization"),
            country=data.get("country"),
            email=data.get("email"),
            password=data.get("password")
        )

        db.session.add(scout)
        db.session.commit()

        return scout.to_dict(), 201


# ---------------- OPPORTUNITIES ---------------- #

class OpportunityList(Resource):

    def get(self):

        opportunities = Opportunity.query.all()

        return [o.to_dict() for o in opportunities], 200


    def post(self):

        data = request.get_json() or {}

        if not data.get("title"):
            return {"error": "Title required"}, 400

        opportunity = Opportunity(
            title=data.get("title"),
            club=data.get("club"),
            country=data.get("country"),
            scout_id=data.get("scout_id")
        )

        db.session.add(opportunity)
        db.session.commit()

        return opportunity.to_dict(), 201


class OpportunityDetail(Resource):

    def get(self, id):

        opp = Opportunity.query.get(id)

        if not opp:
            return {"error": "Opportunity not found"}, 404

        return opp.to_dict(), 200


    def patch(self, id):

        opp = Opportunity.query.get(id)

        if not opp:
            return {"error": "Opportunity not found"}, 404

        data = request.get_json() or {}

        opp.title = data.get("title", opp.title)
        opp.club = data.get("club", opp.club)
        opp.country = data.get("country", opp.country)

        db.session.commit()

        return opp.to_dict(), 200


    def delete(self, id):

        opp = Opportunity.query.get(id)

        if not opp:
            return {"error": "Opportunity not found"}, 404

        db.session.delete(opp)
        db.session.commit()

        return {"message": "Opportunity deleted"}, 200


# ---------------- APPLICATIONS ---------------- #

class ApplicationList(Resource):

    def get(self):

        applications = Application.query.all()

        return [a.to_dict() for a in applications], 200


    def post(self):

        data = request.get_json() or {}

        if not data.get("athlete_id") or not data.get("opportunity_id"):
            return {"error": "athlete_id and opportunity_id required"}, 400

        application = Application(
            athlete_id=data.get("athlete_id"),
            opportunity_id=data.get("opportunity_id"),
            status=data.get("status", "pending")
        )

        db.session.add(application)
        db.session.commit()

        return application.to_dict(), 201


class ApplicationDetail(Resource):

    def patch(self, id):

        app_obj = Application.query.get(id)

        if not app_obj:
            return {"error": "Application not found"}, 404

        data = request.get_json() or {}

        app_obj.status = data.get("status", app_obj.status)

        db.session.commit()

        return app_obj.to_dict(), 200


# ---------------- ROUTES ---------------- #

api.add_resource(AthleteList, "/athletes")
api.add_resource(AthleteDetail, "/athletes/<int:id>")

api.add_resource(ScoutList, "/scouts")

api.add_resource(OpportunityList, "/opportunities")
api.add_resource(OpportunityDetail, "/opportunities/<int:id>")

api.add_resource(ApplicationList, "/applications")
api.add_resource(ApplicationDetail, "/applications/<int:id>")


# ---------------- RUN SERVER ---------------- #

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=5555, debug=True)