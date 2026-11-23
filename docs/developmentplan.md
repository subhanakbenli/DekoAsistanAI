# **Deko Asistan - 2-Week Development Plan**

* **Start:** 23 July 2025, 19:00  
* **End:** 6 August 2025, 19:00  
* **Team:** 2 Developers \+ AI Assistants (GitHub Copilot, Gemini, etc.)

### **Week 1: Foundations and Core Functionality (23 July \- 30 July)**

The main goal of this week is to set up the project skeleton, build the basic backend and frontend structure, and integrate the core logic of the AI services.

#### **🚀 Days 1-2: Setup and Infrastructure (23-24 July)**

* **Tasks:**  
  * \[ \] Create the GitHub repository and open the main and develop branches.  
  * \[ \] **Backend (Developer 1):** Initialize the FastAPI project and create the base file structure (main.py, routers/, services/, models/).  
  * \[ \] **Backend (Developer 1):** Set up the PostgreSQL database and configure the SQLAlchemy ORM.  
  * \[ \] **Backend (Developer 1):** User model and JWT authentication infrastructure.  
  * \[ \] **Frontend (Developer 2):** Initialize the React (Vite) project and integrate React Router and Tailwind CSS.  
  * \[ \] **Frontend (Developer 2):** Basic page structure (Home, Login, Register, Favorites, Blog).  
  * \[ \] **Backend (Developer 1):** Set up infrastructure for managing API keys securely via a .env file.  
  * \[ \] **Shared Task:** Create the products.json file (starting with 15-20 sample products).

#### **🧠 Days 3-4: Authentication and Basic UI (25-26 July)**

* **Tasks (Backend \- Developer 1):**  
  * \[ \] Create the user registration and login endpoints (/auth/register, /auth/login).  
  * \[ \] JWT token creation and validation middleware.  
  * \[ \] Create the database models for favorites.  
  * \[ \] Create the /api/tasarim endpoint.  
  * \[ \] Define Pydantic models to receive text and an image file via multipart/form-data.  
* **Tasks (Frontend \- Developer 2):**  
  * \[ \] Build the login and registration page UI.  
  * \[ \] Set up a context/state structure for JWT token management.  
  * \[ \] Build the basic structure of the home page design form.  
  * \[ \] Interactive map component for selecting window/door positions.

#### **🔗 Days 5-7: AI Services and Function Calling (27-29 July)**

* **Tasks (Backend \- Developer 1):**  
  * \[ \] Write the core service function that sends text and image prompts to the Gemini API.  
  * \[ \] Write the core service function that sends prompts to the Imagen API and generates images.  
  * \[ \] **Function Calling:** Define the urun\_bul function (searches within products.json).  
  * \[ \] Endpoint for sending per-product update requests to the AI (/api/update-product).  
  * \[ \] Add the function definition to the Gemini API request and manage conversation history.  
  * \[ \] Create the add/remove favorites endpoints (/api/favorites).  
* **Tasks (Frontend \- Developer 2):**  
  * \[ \] Build the design results page UI (mood board, product list).  
  * \[ \] Add-to-favorites buttons and favorites page UI.  
  * \[ \] "Suggest something else" buttons for per-product updates.  
  * \[ \] Blog page and design sharing UI.

#### **✅ End-of-Week-1 Review (30 July, evening)**

* **Goal:** The backend authentication system, basic UI pages and core AI service logic should be complete. Users should be able to log in and fill in the design form, and the favorites infrastructure should be ready.

### **Week 2: Integration, Polish and Delivery (31 July \- 6 August)**

The main goal of this week is to make the project work end to end, improve the user experience, go live and prepare the presentation.

#### **🤝 Days 8-9: End-to-End Integration and Database (31 July \- 1 August)**

* **Tasks (Joint Work):**  
  * \[ \] Fully connect the frontend and backend.  
  * \[ \] Test user login and JWT token validation.  
  * \[ \] Test the design creation and add/remove favorites flow end to end.  
  * \[ \] Integrate the blog sharing system.  
  * \[ \] Test the product update functionality.  
  * \[ \] Test the database connection and data persistence.  
  * \[ \] Run the first end-to-end MVP test and fix the resulting bugs.

#### **✨ Days 10-11: Polish and User Experience (2-3 August)**

* **Tasks:**  
  * \[ \] **UI/UX (Developer 2):** Improve transitions between all pages (animations, loading states).  
  * \[ \] **UI/UX (Developer 2):** Optimize the user experience of the favorites and blog pages.  
  * \[ \] **UI/UX (Developer 2):** Check and adjust mobile responsiveness.  
  * \[ \] **Prompt Engineering (Developer 1):** Refine prompts to get more consistent, higher-quality results from Gemini and Imagen.  
  * \[ \] **Backend (Developer 1):** Database query optimizations and performance improvements.  
  * \[ \] **Error Handling (Joint):** Error states and user-friendly messages for all API endpoints.  
  * \[ \] **F2.1:** Add the "Try Again" button.  
  * \[ \] **F2.2:** Add the "Copy to Clipboard" button.

#### **🚀 Days 12-13: Deployment and Database Go-Live (4-5 August)**

* **Tasks:**  
  * \[ \] **Backend Deployment (Developer 1):** Set up the PostgreSQL database in the cloud (DigitalOcean Managed Database).  
  * \[ \] **Backend Deployment (Developer 1):** Deploy the backend application to a DigitalOcean VDS (Nginx \+ Gunicorn configuration).  
  * \[ \] **Frontend Deployment (Developer 2):** Deploy the frontend to Vercel and configure the backend API address correctly.  
  * \[ \] **Database Migration (Developer 1):** Create all tables in the production database and add test data.  
  * \[ \] **Testing (Joint):** Run thorough tests in the live environment (registration/login, design creation, adding favorites, blog sharing).  
  * \[ \] **Testing (Joint):** Test on different browsers and mobile devices. Fix CORS errors.

#### **🏆 Day 14: Presentation Prep and SUBMISSION\! (6 August, by 19:00)**

* **Tasks (Joint):**  
  * \[ \] Clean up the GitHub repository and update README.md in line with the PRD and plan.  
  * \[ \] Plan the 7-minute jury presentation (who presents what, how the demo flows).  
  * \[ \] Prepare the materials needed for the submission form (GitHub link, live link, 1-minute video).  
  * \[ \] Do a final check of the live system.  
  * \[ \] **SUBMIT THE PROJECT\!** 🎉
