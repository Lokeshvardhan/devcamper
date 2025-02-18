const ErrorResponse  = require('../utils/errorResponse');
const errorHandler = (err,req, res, next) =>{
    //Log to console for deve
    let error = {...err};
    error.message= err.message;
    console.log(err);
    // Mongoose bad objects
    if(err.name === 'CastError'){
        const message = `Bootcamp not found id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    //Mongoose duplicate key
    if(err.code === 11000){
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400);
    }
    //mongoose validation error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(value => value.message);
        error =new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'});
};

module.exports = errorHandler;