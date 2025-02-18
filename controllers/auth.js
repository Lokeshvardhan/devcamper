const User = require('../models/User');
const ErrorResponse  = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc       Register User
// @route      POST /api/v1/auth/register
// #access     Public

exports.register = asyncHandler( async(req, res, next)=>{
    const {name, email, password, role }  = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    const token = user.getSignedJWTToken();
    res.status(200).json({success:true, token:token});
});

// @desc       Register User
// @route      POST /api/v1/auth/login
// #access     Public

exports.login = asyncHandler( async(req, res, next)=>{
    const {email, password }  = req.body;
    // validate email, password

    if(!email || !password){
        return next(new ErrorResponse('Please provide email and password', 400));
    }

    // check for user
    const user = await User.findOne({email}).select('+password');
    //console.log(user);
    if(!user){
        return next(new ErrorResponse('Please enter correct email and password', 401));
    }
    // check if password matches
    const isMatch = await user.matchPassword(password);
    //console.log(isMatch);
    if(!isMatch){
        return next(new ErrorResponse('Please enter correct email and password', 401));   
    }
    const token = user.getSignedJWTToken();
    res.status(200).json({success:true});
});