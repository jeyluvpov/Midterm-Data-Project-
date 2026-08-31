# Midterm-Data-Project (Wine Store Website)

A Vivino-inspired wine e-commerce web application developed as a midterm project, featuring user authentication, an interactive wine catalog with multi-criteria filtering, inventory management, a session-based shopping cart, and simulated payment processing.

---

## 🛠 Tech Stack & Extensions
* **Backend**: Node.js, Express.js
* **Database**: SQLite3 (`users.db`)
* **Frontend**: HTML5, CSS3, JavaScript
* **Recommended VS Code Extensions**:
  * **Live Server** (For previewing static frontend pages during local development)
  * **SQLite Viewer** (For inspecting and managing database tables directly in the editor)

---

## 📁 Project Structure
* `public/` - Front-end web pages and user interface assets
  * `wines.html` - Wine collection catalog and filtering interface
  * `store.html` - Main store landing page
  * `cart.html` - Shopping cart and checkout interface
  * `cellar.html` - Inventory and CRUD management dashboard
  * `login.html` / `signup.html` - User authentication pages
* `server.js` - Main backend server handling routing, API endpoints, and database interactions
* `users.db` - SQLite database storing user accounts and wine inventory data
* `package.json` - Project dependencies and configuration settings

---

## 🚀 How to Run this Project
Follow these steps to run the application locally:

1. Open a terminal or command prompt inside the project root directory.
2. Install dependencies and start the server by running:
   ```bash
   npm install
   node server.js

