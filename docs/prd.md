# **Product Requirements Document (PRD): Deko Asistan**

* **Product Name:** Deko Asistan  
* **Version:** 1.0 (Hackathon MVP)  
* **Date:** 24 July 2025  
* **Authors:** Developer 1, Developer 2  
* **Stakeholders:** BTK Akademi, Google, Girvak (Hackathon 2025 Committee)

### **1\. Overview**

Deko Asistan is a Google Gemini-powered web application built for the "E-commerce" theme of Hackathon 2025. Users provide specific parameters, personal notes and, optionally, photos of their room, and receive personalized interior design suggestions from AI. The application visualizes these suggestions with a mood board and uses Function Calling to find a purchasable product that fits the design in a static e-commerce dataset and present it to the user.

### **2\. Problem Solved**

When people want to decorate their home or a room, they face scattered sources of inspiration, difficulty finding concepts that match their personal taste and the physical characteristics of the room, and the complexity of turning that inspiration into real, purchasable products. Deko Asistan simplifies and speeds up this process by bringing it together on a single platform.

### **3\. Target Audience**

Tech-savvy adults (18+) living in Turkey who want to renovate their home or room but don't know where to start or need creative ideas.

### **4\. Project Goals and Success Criteria**

* **User Goal:** In under 2 minutes, the user receives an actionable design concept created specifically for their room, including a visual mood board and at least one concrete product recommendation.  
* **Hackathon Goals:**  
  * Deliver a working MVP (Minimum Viable Product) containing all Must-Have features by the competition deadline of **31 July 2025**.  
  * Reach the top 10 by creatively showcasing advanced Gemini API capabilities such as multimodal (text + image) input and Function Calling.  
  * Aim for the top 3 with a smooth, innovative product demo that makes an impact in the 7-minute jury presentation.

### **5\. Features & Scope**

#### **V1.0 \- MVP (Must-Have)**

* **F1.1: User Interface:** A clean, modern multi-page web interface (Home, Login, Favorites, Blog).  
* **F1.2: User Login and Authorization:** A simple email/password-based login and registration system.  
* **F1.3: Structured Input:** A focused form that collects: Room Type, Design Style.  
* **F1.4: Space Details:** Interactive area selection where the user can mark window and door positions in the room.  
* **F1.5: Free-Text Input:** A "Your Notes" text field for custom requests.  
* **F1.6: Image Upload:** An optional field for uploading a photo of the room.  
* **F1.7: Backend API Endpoints:** Design endpoints that accept all data from the frontend (as multipart/form-data) and send it to the Gemini API.  
* **F1.8: Design Text Display:** Showing the detailed design suggestion text returned by Gemini on screen.  
* **F1.9: Mood Board Display:** Showing the mood board image generated with the Imagen API to match the design text.  
* **F1.10: Product Recommendations (Function Calling):** Gemini uses Function Calling to find **multiple products** that fit the design in the static products.json file and shows their links.  
* **F1.11: Per-Product Updates:** The user can ask the AI to redesign specific products.  
* **F1.12: Favorites:** The user can add individual products or the whole design set (input + output) to favorites.  
* **F1.13: Blog Sharing:** The user can share designs they like in blog format.  
* **F1.14: Loading State:** After the "Design" button is pressed, an animation or text such as "Your Deko Asistan is imagining your room..." is shown until the results arrive.

#### **Should-Have**

* **F2.1:** A "Try Again" button to request a different suggestion with the same inputs.  
* **F2.2:** A "Copy to Clipboard" button for the generated design text.  
* **F2.3:** Viewing design history.  
* **F2.4:** Sharing designs via social media integration.

#### **Won't-Have**

* Real-time web scraping.  
* Multi-language support.  
* Third-party e-commerce integration.  
* Mobile app development.

### **6\. User Flow**

1. The user visits the website.  
2. The user signs up if they have no account, or logs in otherwise.  
3. On the home page they see the design form and fill in the fields:  
   * Room Type: Living room, Style: Modern  
   * They mark window and door positions on the interactive map  
4. In the notes box they write "I want a large bookcase and a comfortable reading chair".  
5. (Optional) They upload a photo of an empty corner of their living room.  
6. They click the "Imagine It\!" button.  
7. A loading animation appears.  
8. After about 10-15 seconds the page updates and shows the results:  
   * Title: "Your Modern, Bright Reading Nook"  
   * A detailed description.  
   * The generated mood board image.  
   * A list of recommended products (3-5 items).  
9. The user adds products they like to favorites, or favorites the whole design.  
10. Optionally, they request an update from the AI for specific products by saying "Suggest something else instead of this product".  
11. If they are happy with the design, they share it on the blog page.

### **7\. Tech Stack**

* **Backend:** Python 3.11+, FastAPI, SQLAlchemy (ORM), PostgreSQL (database)  
* **Frontend:** React (Vite), Tailwind CSS, React Router (page routing)  
* **AI APIs:** Google Gemini API (text, analysis, Function Calling), Google Imagen API (image generation)  
* **Data:** products.json (static product dataset), PostgreSQL (user data, favorites, blog posts)  
* **Authentication:** JWT (JSON Web Tokens)  
* **Deployment:** Vercel (frontend), DigitalOcean VDS \+ Nginx \+ Gunicorn (backend)  
* **Development Tools:** Git, GitHub, VS Code, GitHub Copilot, Gemini

### **8\. Risks and Assumptions**

* **Risk:** AI-assisted frontend development may take longer than expected when integrating components.  
  * *Mitigation:* Ask for simple, atomic components and get a static interface working first.  
* **Risk:** Configuration issues during backend deployment on our own server.  
  * *Mitigation:* Dedicate the last 2 days of development entirely to deployment and testing.  
* **Assumption:** Google Cloud APIs will be stable and available throughout the competition.  
* **Assumption:** Two developers, supported by AI assistants, can complete the MVP scope above within 2 weeks.
