\documentclass{article}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{geometry}
\geometry{a4paper, margin=1in}

\lstset{
    basicstyle=\ttfamily\footnotesize,
    keywordstyle=\color{blue}\bfseries,
    commentstyle=\color{gray},
    stringstyle=\color{red},
    showstringspaces=false,
    breaklines=true,
    frame=single,
    numbers=left,
    numberstyle=\tiny\color{gray},
    tabsize=2
}

\title{Practice-3: Backend Development Project}
\author{}
\date{}

\begin{document}

\maketitle

\section*{1. Project Structure}
The folder structure is as follows:
\begin{verbatim}
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
\end{verbatim}

\section*{2. app.js (Main Application File)}

\subsection*{a. Importing Modules}
\begin{lstlisting}[language=JavaScript]
const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');
\end{lstlisting}

\begin{itemize}
    \item \textbf{express}: A web framework for building server-side applications.
    \item \textbf{path}: A Node.js module for handling file paths.
    \item \textbf{userModel}: The Mongoose model for interacting with the \texttt{users} collection in MongoDB.
\end{itemize}

\subsection*{b. Middleware Setup}
\begin{lstlisting}[language=JavaScript]
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
\end{lstlisting}

\begin{itemize}
    \item \texttt{app.set("view engine", "ejs")}: Sets EJS as the templating engine for rendering dynamic HTML.
    \item \texttt{express.json()}: Parses incoming JSON requests.
    \item \texttt{express.urlencoded(\{ extended: true \})}: Parses URL-encoded data (e.g., form submissions).
    \item \texttt{express.static()}: Serves static files (e.g., CSS, images) from the \texttt{public} directory.
\end{itemize}

\subsection*{c. Routes}

\subsubsection*{1. Home Route}
\begin{lstlisting}[language=JavaScript]
app.get('/', (req, res) => {
    res.render("index");
});
\end{lstlisting}

\begin{itemize}
    \item \texttt{app.get()}: Defines a route for HTTP GET requests.
    \item \texttt{res.render("index")}: Renders the \texttt{index.ejs} file from the \texttt{views} folder.
\end{itemize}

\subsubsection*{2. Read Route}
\begin{lstlisting}[language=JavaScript]
app.get('/read', async (req, res) => {
    let users = await userModel.find();
    res.render("read", { users });
});
\end{lstlisting}

\begin{itemize}
    \item \texttt{userModel.find()}: Fetches all user documents from the MongoDB collection.
    \item \texttt{res.render("read", \{ users \})}: Passes the \texttt{users} data to the \texttt{read.ejs} template for rendering.
\end{itemize}

\subsubsection*{3. Create Route}
\begin{lstlisting}[language=JavaScript]
app.post('/create', async (req, res) => {
    let { name, email, password } = req.body;
    let newUser = await userModel.create({ name, email, password });
    res.redirect("/read");
});
\end{lstlisting}

\begin{itemize}
    \item \texttt{app.post()}: Defines a route for HTTP POST requests.
    \item \texttt{req.body}: Contains form data submitted by the user.
    \item \texttt{userModel.create()}: Inserts a new user document into the MongoDB collection.
    \item \texttt{res.redirect("/read")}: Redirects the user to the \texttt{/read} route after creating a user.
\end{itemize}

\subsubsection*{4. Delete Route}
\begin{lstlisting}[language=JavaScript]
app.get('/delete/:id', async (req, res) => {
    let users = await userModel.findOneAndDelete({ _id: req.params.id });
    res.redirect("/read");
});
\end{lstlisting}

\begin{itemize}
    \item \texttt{req.params.id}: Extracts the \texttt{id} parameter from the URL.
    \item \texttt{userModel.findOneAndDelete()}: Deletes a user document by its \texttt{\_id}.
    \item \texttt{res.redirect("/read")}: Redirects to the \texttt{/read} route after deletion.
\end{itemize}

\subsubsection*{5. Update Routes}

\textbf{GET Route for Rendering the Update Form:}
\begin{lstlisting}[language=JavaScript]
app.get('/update/:id', async (req, res) => {
    let id = req.params.id;
    let user = await userModel.findById(id);
    res.render("edit", { user });
});
\end{lstlisting}

\begin{itemize}
    \item \texttt{userModel.findById(id)}: Fetches a user document by its \texttt{\_id}.
    \item \texttt{res.render("edit", \{ user \})}: Passes the user data to the \texttt{edit.ejs} template for rendering the update form.
\end{itemize}

\textbf{POST Route for Updating the User:}
\begin{lstlisting}[language=JavaScript]
app.post('/update/:id', async (req, res) => {
    let id = req.params.id;
    let { name, email, password } = req.body;
    await userModel.findOneAndUpdate({ _id: id }, { name, email, password });
    res.redirect("/read");
});
\end{lstlisting}

\begin{itemize}
    \item \texttt{userModel.findOneAndUpdate()}: Updates a user document by its \texttt{\_id} with the new data.
\end{itemize}

\subsection*{d. Starting the Server}
\begin{lstlisting}[language=JavaScript]
app.listen(3000);
\end{lstlisting}

\begin{itemize}
    \item Starts the server on port \texttt{3000}.
\end{itemize}

\section*{3. user.js (Mongoose Schema and Model)}
\begin{lstlisting}[language=JavaScript]
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/Testapp1");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

module.exports = mongoose.model("user", userSchema);
\end{lstlisting}

\begin{itemize}
    \item \texttt{mongoose.connect()}: Connects to the MongoDB database at \texttt{mongodb://127.0.0.1:27017/Testapp1}.
    \item \texttt{new mongoose.Schema()}: Defines the schema for the \texttt{users} collection.
    \item \texttt{mongoose.model()}: Creates a model for interacting with the \texttt{users} collection.
\end{itemize}

\section*{4. views (EJS Templates)}

\subsection*{a. index.ejs}
- Displays a form for creating a new user.
- Submits the form data to the \texttt{/create} route.

\subsection*{b. read.ejs}
- Displays all users in a grid layout.
- Provides links for editing (\texttt{/update/:id}) and deleting (\texttt{/delete/:id}) users.

\subsection*{c. edit.ejs}
- Displays a form pre-filled with the user's data for editing.
- Submits the updated data to the \texttt{/update/:id} route.

\section*{5. style.css}
- Contains basic CSS for styling the application.

\section*{6. package.json}
- Lists the project dependencies:
    \begin{itemize}
        \item \textbf{express}: Web framework.
        \item \textbf{ejs}: Templating engine.
        \item \textbf{mongoose}: MongoDB object modeling tool.
        \item \textbf{mongodb}: MongoDB driver.
    \end{itemize}

\section*{Key Concepts}
\begin{enumerate}
    \item \textbf{Express.js}: Handles routing and middleware.
    \item \textbf{EJS}: Renders dynamic HTML templates.
    \item \textbf{Mongoose}: Provides schema-based interaction with MongoDB.
    \item \textbf{CRUD Operations}:
    \begin{itemize}
        \item \textbf{Create}: \texttt{/create} route.
        \item \textbf{Read}: \texttt{/read} route.
        \item \textbf{Update}: \texttt{/update/:id} routes.
        \item \textbf{Delete}: \texttt{/delete/:id} route.
    \end{itemize}
\end{enumerate}

This project demonstrates a simple CRUD application with a clean separation of concerns between the backend logic, database schema, and frontend templates.

\end{document}