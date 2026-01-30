# React Login, Register & Task Manager App

This is a simple React web application that includes **User Registration**, **Login**, and a **Task Manager**.  
All data is stored in the browser using **LocalStorage**.  
After login, users can add, edit, and delete tasks.

---

## 🚀 Features

- User Registration
- User Login & Logout
- Authentication using React Context
- Tasks stored user-wise using LocalStorage
- Add, Edit, Delete tasks
- Responsive UI using Bootstrap
- Protected task access (only logged-in users can manage tasks)

---

## 🧠 Application Flow

1. When the project runs, the **Home page** is displayed.
2. If the user is **not logged in**, they will see:
   - Register option
   - Login option
3. After **Register**, user data is stored in **LocalStorage**.
4. After **Login**, the user:
   - Is redirected to the **Home page**
   - Can **add, edit, and delete tasks**
5. Tasks are stored **separately for each user** using the user’s email.
6. On **Logout**, the user session is cleared and the app redirects to **Home**.

---

## 📥 Clone the Repository

Clone the project using the command below:

## git clone https://github.com/Rudra616/react.git
▶️ Run the Project (CRUD Folder)
Navigate to the project folder:
cd react
Open the CRUD folder (where package.json is available)
Install dependencies:
npm install
Start the development server:
npm run dev
Open the link shown in the terminal (example):
http://localhost:5173


## 🗂 Project Structure
src/
│
├── context/
│   └── AuthContext.js
│
├── screen/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── About.jsx
│
├── components/
│   └── Navbar.jsx
│
├── App.jsx
└── main.jsx

## 🧰 Technologies Used
React
React Router DOM
React Bootstrap
Context API
JavaScript
HTML & CSS
LocalStorage
