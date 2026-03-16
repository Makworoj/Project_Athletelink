# AthleteLink

## Overview

AthleteLink is a web platform designed to connect **athletes** with **sports scouts and professional opportunities**. The platform allows athletes to showcase their profiles and apply for opportunities posted by scouts, while scouts can discover talent and manage applications.

This project was built as a full-stack web application using **React for the frontend** and **Flask for the backend API**, with **SQLAlchemy** managing the database.

---

## Features

### Athlete Features

* Create an athlete profile
* Browse available opportunities
* Apply to opportunities posted by scouts
* Track the status of applications (pending, accepted, rejected)
* View and update personal profile details

### Scout Features

* Create a scout profile
* Post new sports opportunities
* View athletes who have applied
* Accept or reject applications
* Manage posted opportunities

### Platform Features

* Secure login system
* RESTful API architecture
* Database-backed data storage
* Clean user interface with responsive design

---

## Tech Stack

### Frontend

* React
* React Router
* Formik & Yup (form handling and validation)
* Tailwind CSS
* Fetch API

### Backend

* Python
* Flask
* Flask-RESTful
* Flask-SQLAlchemy
* Flask-Migrate
* Flask-CORS

### Database

* SQLite (development)
* PostgreSQL (production compatible)

### Deployment

* Frontend: Vercel
* Backend API: Render

---

## Project Structure

```
Project_Athletelink
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server
│   ├── models.py
│   ├── app.py
│   ├── config.py
│   └── migrations
│
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description               |
| ------ | -------- | ------------------------- |
| POST   | `/login` | Login as athlete or scout |

### Athletes

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| GET    | `/athletes`      | Get all athletes    |
| POST   | `/athletes`      | Create athlete      |
| GET    | `/athletes/<id>` | Get athlete details |
| PATCH  | `/athletes/<id>` | Update athlete      |
| DELETE | `/athletes/<id>` | Delete athlete      |

### Scouts

| Method | Endpoint  | Description    |
| ------ | --------- | -------------- |
| GET    | `/scouts` | Get all scouts |
| POST   | `/scouts` | Create scout   |

### Opportunities

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | `/opportunities`      | List opportunities  |
| POST   | `/opportunities`      | Create opportunity  |
| GET    | `/opportunities/<id>` | Opportunity details |
| PATCH  | `/opportunities/<id>` | Update opportunity  |
| DELETE | `/opportunities/<id>` | Delete opportunity  |

### Applications

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| GET    | `/applications`      | List applications         |
| POST   | `/applications`      | Create application        |
| PATCH  | `/applications/<id>` | Update application status |

---

## Installation (Local Development)

### 1. Clone the repository

```
git clone https://github.com/Makworoj/Project_Athletelink.git
cd Project_Athletelink
```

---

### 2. Backend Setup

```
cd server

pipenv install
pipenv shell

flask db upgrade
python app.py
```

Backend runs on:

```
https://project-athletelink.onrender.com

```

---

### 3. Frontend Setup

```
cd client

npm install
npm start
```

Frontend runs on:

```
https://project-athletelink-o3bbxdxyt-makworojs-projects.vercel.app/
```

---

## Deployment

### Frontend

Hosted on **Vercel**

### Backend

Hosted on **Render**

Production API:

```
https://project-athletelink.onrender.com
```

---

## Future Improvements

* Password hashing and authentication security
* Real scout verification system
* Athlete performance analytics
* Messaging between scouts and athletes
* Athlete media uploads (videos, highlights)
* Search filters for scouts

---

## Authors

**James Makworo**
**James Eshiwani**

---

## License

This project is open source and available under the MIT License.
