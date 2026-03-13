from flask import request, jsonify
from flask_restful import Resource
from config import app, db, api
from models import Athlete, Scout, Opportunity, Application

# ---------------- ROOT ROUTE ---------------- #
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

# ---------------- NEW LOGIN ROUTE ---------------- #
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Try Athlete first
    athlete = Athlete.query.filter_by(email=email).first()
    if athlete and athlete.password == password:  
        return jsonify({
            "id": athlete.id,
            "name": athlete.name,
            "sport": athlete.sport,
            "country": athlete.country,
            "age": athlete.age,
            "scout_id": athlete.scout_id,
            "email": athlete.email,
            "role": "athlete"
        }), 200

    # Then try Scout
    scout = Scout.query.filter_by(email=email).first()
    if scout and scout.password == password:  
        return jsonify({
            "id": scout.id,
            "name": scout.name,
            "organization": scout.organization,
            "country": scout.country,
            "email": scout.email,
            "role": "scout"
        }), 200

    return jsonify({"error": "Invalid email or password"}), 401

# =====================================================
# ATHLETE RESOURCES
# =====================================================
class AthleteList(Resource):
    def get(self):
        athletes = Athlete.query.all()
        return [athlete.to_dict() for athlete in athletes], 200

    def post(self):
        data = request.get_json()
        new_athlete = Athlete(
            name=data.get("name"),
            sport=data.get("sport"),
            country=data.get("country"),
            age=data.get("age"),
            scout_id=data.get("scout_id"),
            email=data.get("email"),           
            password=data.get("password")      
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

    def patch(self, id):
        athlete = Athlete.query.get(id)
        if not athlete:
            return {"error": "Athlete not found"}, 404

        data = request.get_json()
        allowed = ['name', 'sport', 'country', 'age', 'scout_id', 'email', 'password']

        for field in allowed:
            if field in data:
                if field == 'age':
                    try:
                        setattr(athlete, field, int(data[field]))
                    except ValueError:
                        return {"error": "Age must be an integer"}, 400
                else:
                    setattr(athlete, field, data[field])

        db.session.commit()
        return athlete.to_dict(), 200

    def delete(self, id):
        athlete = Athlete.query.get(id)
        if not athlete:
            return {"error": "Athlete not found"}, 404
        db.session.delete(athlete)
        db.session.commit()
        return {"message": "Athlete deleted successfully"}, 200

# =====================================================
# SCOUT RESOURCES
# =====================================================
class ScoutList(Resource):
    def get(self):
        scouts = Scout.query.all()
        return [scout.to_dict() for scout in scouts], 200

    def post(self):
        data = request.get_json()
        new_scout = Scout(
            name=data.get("name"),
            organization=data.get("organization"),
            country=data.get("country"),
            email=data.get("email"),           
            password=data.get("password")     
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

    def patch(self, id):
        scout = Scout.query.get(id)
        if not scout:
            return {"error": "Scout not found"}, 404

        data = request.get_json()
        allowed = ['name', 'organization', 'country', 'email', 'password']

        for field in allowed:
            if field in data:
                setattr(scout, field, data[field])

        db.session.commit()
        return scout.to_dict(), 200

    def delete(self, id):
        scout = Scout.query.get(id)
        if not scout:
            return {"error": "Scout not found"}, 404
        db.session.delete(scout)
        db.session.commit()
        return {"message": "Scout deleted successfully"}, 200

# =====================================================
# OPPORTUNITY RESOURCES
# =====================================================
class OpportunityList(Resource):
    def get(self):
        opportunities = Opportunity.query.all()
        return [opp.to_dict() for opp in opportunities], 200

    def post(self):
        data = request.get_json()
        new_opp = Opportunity(
            title=data.get("title"),
            club=data.get("club"),
            country=data.get("country"),
            scout_id=data.get("scout_id")
        )
        db.session.add(new_opp)
        db.session.commit()
        return new_opp.to_dict(), 201

class OpportunityByID(Resource):
    def get(self, id):
        opp = Opportunity.query.get(id)
        if not opp:
            return {"error": "Opportunity not found"}, 404
        return opp.to_dict(), 200

    def patch(self, id):
        opp = Opportunity.query.get(id)
        if not opp:
            return {"error": "Opportunity not found"}, 404

        data = request.get_json()
        allowed = ['title', 'club', 'country', 'scout_id']

        for field in allowed:
            if field in data:
                setattr(opp, field, data[field])

        db.session.commit()
        return opp.to_dict(), 200

    def delete(self, id):
        opp = Opportunity.query.get(id)
        if not opp:
            return {"error": "Opportunity not found"}, 404
        db.session.delete(opp)
        db.session.commit()
        return {"message": "Opportunity deleted successfully"}, 200

# =====================================================
# APPLICATION RESOURCES
# =====================================================
class ApplicationList(Resource):
    def get(self):
        apps = Application.query.all()
        return [app.to_dict() for app in apps], 200

    def post(self):
        data = request.get_json()
        new_app = Application(
            status=data.get("status", "pending"),
            athlete_id=data.get("athlete_id"),
            opportunity_id=data.get("opportunity_id")
        )
        db.session.add(new_app)
        db.session.commit()
        return new_app.to_dict(), 201

class ApplicationByID(Resource):
    def get(self, id):
        app = Application.query.get(id)
        if not app:
            return {"error": "Application not found"}, 404
        return app.to_dict(), 200

    def patch(self, id):
        app = Application.query.get(id)
        if not app:
            return {"error": "Application not found"}, 404

        data = request.get_json()
        if 'status' in data:
            if data['status'] not in ['pending', 'accepted', 'rejected']:
                return {"error": "Invalid status"}, 400
            app.status = data['status']

        db.session.commit()
        return app.to_dict(), 200

    def delete(self, id):
        app = Application.query.get(id)
        if not app:
            return {"error": "Application not found"}, 404
        db.session.delete(app)
        db.session.commit()
        return {"message": "Application deleted"}, 200

# =====================================================
# REGISTER ALL ROUTES
# =====================================================
api.add_resource(AthleteList, '/athletes')
api.add_resource(AthleteByID, '/athletes/<int:id>')

api.add_resource(ScoutList, '/scouts')
api.add_resource(ScoutByID, '/scouts/<int:id>')

api.add_resource(OpportunityList, '/opportunities')
api.add_resource(OpportunityByID, '/opportunities/<int:id>')

api.add_resource(ApplicationList, '/applications')
api.add_resource(ApplicationByID, '/applications/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)