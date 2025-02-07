// Create web server
// Express is a web application framework for Node.js
const express = require('express');

// Create an express application
const app = express();

// Use the express.static middleware function to serve static files
app.use(express.static('public'));

// Use the body-parser middleware function to parse the body of incoming POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Use the express-handlebars middleware function to render HTML templates
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Use the mysql module to connect to the MySQL server
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comments'
});

// Use the express-session middleware function to create a session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Use the express-mysql-session middleware function to store session data in a MySQL database
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comments'
});

// Use the express-session middleware function to store session data in the session store
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

// Use the express-flash middleware function to display messages
const flash = require('express-flash');
app.use(flash());

// Display the home page
app.get('/', (req, res) => {
    res.render('home');
});

// Display the comments page
app.get('/comments', (req, res) => {
    // If the user is not logged in, redirect to the login page
    if (!req.session.userId) {
        res.redirect('/login');
        return;
    }

    // Retrieve the comments from the database
    pool.query('SELECT * FROM comments', (err, results) => {
        if (err) {
            throw err;
        }

        // Render the comments page
        res.render('comments', {
            comments: results
        });
    });
});

// Display the login page