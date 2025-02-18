const express = require("express");
const dotenv = require('dotenv');
const morgan  = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
/// Route files
const bootcamps  = require('./routes/bootcamps');
const courses  = require('./routes/courses');
const auth  = require('./routes/auth');
dotenv.config({path: './config/config.env'});


//connect to DB;
connectDB();

const app  = express();
// Body Parser  
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use(errorHandler);
const PORT= process.env.PORT || 5000;

const server = app.listen(PORT, ()=>{console.log(`Server running in ${process.env.NODE_ENV} mode port ${PORT}` )});
process.on('unhandledRejection', (err, promise) =>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
})