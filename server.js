require('dotenv').config();
const express = require('express');
const app = express()
const path = require('path');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const logEvents = require("./middleware/logEvents");
//initialize object
const cors = require('cors')
const {logger}= require('./middleware/logEvents')
const errorHandler= require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;

//Connect to mongodb
connectDB();


//custom middleware logger
app.use(logger)



//handle options credentials check - before cors
//and fetch cookies credentials requirement. Set resp headers
app.use(credentials)

//corsOptions
app.use(cors(corsOptions));
//this handles form data .That is url encoded data.
//content-type: application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: false }));

//middleware for handling json data
app.use(express.json());

//middleware for cookie 
app.use(cookieParser());



//serves static files
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use("/", require("./routes/root"))
app.use("/register", require("./routes/register"))
app.use("/auth", require("./routes/auth"))
app.use("/refresh", require("./routes/refresh"))
app.use("/logout", require("./routes/logout")) 
//everything after this will use the JWT middleware
app.use(verifyJWT)
app.use("/employees", require("./routes/api/employees"))
//app.use('/users', require('./routes/api/users'));

//404 catch All
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html'))
    {
        res.sendFile(path.join(__dirname, "views","404.html"))
    } else if (req.accepts('json'))
    {
        res.json({error: "404 Not found"})
    } else
    {
        res.type('txt').send('404 Not found')
    }
    
})

app.use(errorHandler);
mongoose.connection.once('open', () => {
    console.log('connected to mongo db') //we want to connect first to mongodb
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`)) 
})
