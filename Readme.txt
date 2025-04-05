## **1. Project Structure**
The folder structure is as follows:
```
Practice-3/
├── app.js                // Main application file
├── models/
│   └── user.js           // Mongoose schema and model for users
├── public/
│   └── stylesheets/
│       └── style.css     // CSS file for styling
├── views/
│   ├── index.ejs         // EJS template for the home page
│   ├── read.ejs          // EJS template for displaying user data
│   └── edit.ejs          // EJS template for editing user data
├── package.json          // Project metadata and dependencies
└── Readme.txt            // Empty readme file
```

---

## **2. app.js (Main Application File)**

### **a. Importing Modules**
```javascript
const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');
```
- **`express`**: A web framework for building server-side applications.
- **`path`**: A Node.js module for handling file paths.
- **`userModel`**: The Mongoose model for interacting with the `users` collection in MongoDB.

---

### **b. Middleware Setup**
```javascript
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
```
- **`app.set("view engine", "ejs")`**: Sets EJS as the templating engine for rendering dynamic HTML.
- **`express.json()`**: Parses incoming JSON requests.
- **`express.urlencoded({ extended: true })`**: Parses URL-encoded data (e.g., form submissions).
- **`express.static()`**: Serves static files (e.g., CSS, images) from the public directory.

---

### **c. Routes**

#### **1. Home Route**
```javascript
app.get('/', (req, res) => {
    res.render("index");
});
```
- **`app.get()`**: Defines a route for HTTP GET requests.
- **`res.render("index")`**: Renders the index.ejs file from the views folder.

---

#### **2. Read Route**
```javascript
app.get('/read', async (req, res) => {
    let users = await userModel.find();
    res.render("read", { users });
});
```
- **`userModel.find()`**: Fetches all user documents from the MongoDB collection.
- **`res.render("read", { users })`**: Passes the `users` data to the read.ejs template for rendering.

---

#### **3. Create Route**
```javascript
app.post('/create', async (req, res) => {
    let { name, email, password } = req.body;
    let newUser = await userModel.create({ name, email, password });
    res.redirect("/read");
});
```
- **`app.post()`**: Defines a route for HTTP POST requests.
- **`req.body`**: Contains form data submitted by the user.
- **`userModel.create()`**: Inserts a new user document into the MongoDB collection.
- **`res.redirect("/read")`**: Redirects the user to the `/read` route after creating a user.

---

#### **4. Delete Route**
```javascript
app.get('/delete/:id', async (req, res) => {
    let users = await userModel.findOneAndDelete({ _id: req.params.id });
    res.redirect("/read");
});
```
- **`req.params.id`**: Extracts the `id` parameter from the URL.
- **`userModel.findOneAndDelete()`**: Deletes a user document by its `_id`.
- **`res.redirect("/read")`**: Redirects to the `/read` route after deletion.

---

#### **5. Update Routes**
**GET Route for Rendering the Update Form:**
```javascript
app.get('/update/:id', async (req, res) => {
    let id = req.params.id;
    let user = await userModel.findById(id);
    res.render("edit", { user });
});
```
- **`userModel.findById(id)`**: Fetches a user document by its `_id`.
- **`res.render("edit", { user })`**: Passes the user data to the edit.ejs template for rendering the update form.

**POST Route for Updating the User:**
```javascript
app.post('/update/:id', async (req, res) => {
    let id = req.params.id;
    let { name, email, password } = req.body;
    await userModel.findOneAndUpdate({ _id: id }, { name, email, password });
    res.redirect("/read");
});
```
- **`userModel.findOneAndUpdate()`**: Updates a user document by its `_id` with the new data.

---

### **d. Starting the Server**
```javascript
app.listen(3000);
```
- Starts the server on port `3000`.

---

## **3. user.js (Mongoose Schema and Model)**
```javascript
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/Testapp1");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

module.exports = mongoose.model("user", userSchema);
```
- **`mongoose.connect()`**: Connects to the MongoDB database at `mongodb://127.0.0.1:27017/Testapp1`.
- **`new mongoose.Schema()`**: Defines the schema for the `users` collection.
- **`mongoose.model()`**: Creates a model for interacting with the `users` collection.

---

## **4. views (EJS Templates)**

### **a. index.ejs**
- Displays a form for creating a new user.
- Submits the form data to the `/create` route.

---

### **b. read.ejs**
- Displays all users in a grid layout.
- Provides links for editing (`/update/:id`) and deleting (`/delete/:id`) users.

---

### **c. edit.ejs**
- Displays a form pre-filled with the user's data for editing.
- Submits the updated data to the `/update/:id` route.

---

## **5. style.css**
- Contains basic CSS for styling the application.

---

## **6. package.json**
- Lists the project dependencies:
  - **`express`**: Web framework.
  - **`ejs`**: Templating engine.
  - **`mongoose`**: MongoDB object modeling tool.
  - **`mongodb`**: MongoDB driver.

---

## **Key Concepts**
1. **Express.js**: Handles routing and middleware.
2. **EJS**: Renders dynamic HTML templates.
3. **Mongoose**: Provides schema-based interaction with MongoDB.
4. **CRUD Operations**:
   - **Create**: `/create` route.
   - **Read**: `/read` route.
   - **Update**: `/update/:id` routes.
   - **Delete**: `/delete/:id` route.

This project demonstrates a simple CRUD application with a clean separation of concerns between the backend logic, database schema, and frontend templates.