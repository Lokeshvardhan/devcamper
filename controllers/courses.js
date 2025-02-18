const Course = require('../models/Course');
const ErrorResponse  = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @desc       Get All Courses
// @route      GET /api/v1/courses
// @route      GET /api/v1/bootcamps/:bootcampId/courses
// #access     Public
exports.getCourses = asyncHandler(async (req, res, next )=>{
    let query;
    if(req.params.bootcampId){
        query = Course.find({bootcamp: req.params.bootcampId});
    }else{
        query = Course.find().populate({
            path:'bootcamp',
            select: 'name description'

        });
    }

    const courses= await query;
    res.status(200).json({success: true, 
            count: courses.length,
            data: courses    
        })
});

// @desc       Get single Courses
// @route      GET /api/v1/courses/:id
// @route      GET /api/v1/bootcamps/:bootcampId/courses
// #access     Public
exports.getCourse = asyncHandler(async (req, res, next )=>{
    const course = await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select: 'name description'
    });

    if(!course)
        return next(new ErrorResponse(`No course with the id ${req.params.id} exist`), 404);
    res.status(200).json({success: true,
            data: course  
        })
});

// @desc       Create new Course
// @route      POST /api/v1/bootcamp/:bootcampId/courses
// #access     private
exports.addCourse =  asyncHandler(async(req, res, next ) =>{
    req.body.bootcamp = req.params.bootcampId;
     const bootcamp = await Bootcamp.findById(req.params.bootcampId);
     if(!bootcamp)
        return next(new ErrorResponse(`No bootcamp with the id ${req.params.bootcampId} exist`), 404);
        const course = await Course.create(req.body);
        res.status(201).json({success:true, data:course});
    next();
      
   
})


// @desc       Update Course
// @route      PUT /api/v1/course/:id
// #access     Prvate
exports.updateCourse = asyncHandler(async(req, res, next ) =>{
    //try{
        // console.log(req.body);
        let course = await Course.findById(req.params.id);
        //console.log(course);
        if(!course)
          return next(new ErrorResponse(`Course not found id of ${req.params.id}`, 404));
       course = await Course.findByIdAndUpdate(req.params.id, req.body,{
          new: true,
          runValidators: true
      });
      res.status(200).json({success:true, data:course});
  
}) 

// @desc       Delete  Course
// @route      DELETE /api/v1/courses/:id 
// #access     Prvate
exports.deleteCourse = asyncHandler(async(req, res, next ) =>{
    
      let course = await Course.findById(req.params.id);
      if(!course)
        return next(new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404));
      await course.remove();
      res.status(200).json({success:true, data:{}});
    
} );