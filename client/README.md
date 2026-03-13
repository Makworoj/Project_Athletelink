# AthleteLink: Professional Talent Recruitment Platform

AthleteLink is a professional networking and job board application designed to bridge the gap between aspiring athletes and professional sports scouts. The platform empowers scouts to manage talent pipelines and post global opportunities, while athletes can showcase their skills and track their career applications in real-time.

---

## 🚀 Key Features

* **Dual-Persona Authentication**: Tailored experiences with specific dashboards and permissions for both **Scouts** and **Athletes**.
* **Opportunity Management**: Scouts can create, edit, and track job postings (Youth Academies, Professional Trials, and Club Contracts).
* **Talent & Scout Directories**: Searchable databases to find verified professional scouts and rising athletes.
* **Application Tracking System (ATS)**: Real-time status updates (Pending, Accepted, Rejected) to keep athletes informed.
* **Protected Routing**: Secure frontend guards (higher-order components) ensure only authorized scouts can access administrative tools.

---

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 18, React Router 6 |
| **Styling** | Tailwind CSS, Heroicons |
| **State Management** | React Context API (AuthContext) |
| **Form Handling** | Formik & Yup (Schema-based validation) |
| **Backend (Expected)** | Python/Flask or Node.js (RESTful API) |

---

## 📂 Project Structure

```text
src/
├── components/        # Reusable UI (Navbar, Toast, PrivateRoutes)
├── context/           # AuthContext for global user state management
├── pages/             # Page views (Home, Dashboards, Details, Forms)
├── App.js             # Navigation structure and Route guards
└── index.js           # Main application entry point

```

---

## 💻 Setup & Installation

To get AthleteLink running locally, ensure you have both the frontend and backend environments configured.

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/athlete-link.git
cd athlete-link

```


2. **Install Frontend dependencies:**
```bash
npm install

```


3. **Start the Backend API:**
Ensure your server (default: `http://127.0.0.1:5555`) is running. If using Flask, run:
```bash
python server/app.py

```


4. **Start the React application:**
```bash
npm start

```



---

## 👥 User Roles & Workflow

### **For Scouts**

1. **Dashboard Access**: Login to view metrics on pending applications.
2. **Recruitment**: Post "New Opportunities" with club-specific requirements.
3. **Talent Review**: Manage athlete applications and update statuses to move talent through the pipeline.

### **For Athletes**

1. **Discovery**: Browse the global list of scouts and filter open opportunities.
2. **Engagement**: Submit profiles and portfolios to specific job postings.
3. **Tracking**: Use the "My Applications" portal to monitor scout reviews and feedback.

---

## 🔗 API Endpoints Used

The frontend is designed to interact with a RESTful architecture:

* `GET /scouts` & `POST /scouts`: Manage scout profiles.
* `GET /athletes`: Retrieve the global athlete directory.
* `GET /opportunities` & `POST /opportunities`: CRUD operations for job postings.
* `GET /applications`: Centralized tracking for application data.

---

## 👨‍💻 Collaborators

Meet the team behind AthleteLink:

* **James Makworo** — Backend Systems & API Design
* **James Eshiwani** — Frontend Systems 
* **Julius Mwangi** — TM

---

## 🔮 Future Enhancements

* **Real-time Messaging**: Direct, secure chat between scouts and athletes.
* **Video Highlights**: Native support for performance reels and scout-exclusive footage.
* **Advanced Filtering**: Granular search by sport type, age group, and salary expectations.

---

