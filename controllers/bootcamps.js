const Bootcamp = require('../models/Bootcamp');
const ErrorResponse  = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// @desc       Get All Bootcamps
// @route      GET /api/v1/bootcamps
// #access     Public
exports.getBootcamps = asyncHandler(async(req, res, next ) =>{
    //try{
        let query;
        //create req.query
        const reqQuery = {...req.query};
        // fields to execute
        const removeFields = ['select','sort','page','limit'];
        //Loop over removeFields and delete them from reQuery
        removeFields.forEach(param => delete reqQuery[param]);
        //create  query string
        
        let queryStr= JSON.stringify(reqQuery);
        //create operators ($gt, $gte, $lt, $lte)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);
        console.log(queryStr);
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');
        // select fields
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            console.log(fields);
            query = query.select(fields);
        }

        //sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query=query.sort(sortBy);
        }else{
            query=query.sort('-createdAt');
        }

        //pagination
        const page =parseInt(req.query.page,10)||1;
        const limit= parseInt(req.query.limit,10)||25;
        const startIndex =(page-1)*limit;
        const endIndex = page*limit;
        const total = await Bootcamp.countDocuments();
        query=query.skip(startIndex).limit(limit);
        const  bootcamps = await query;

        //pagination result;
        const pagination= {};
        if(endIndex < total){
            pagination.next ={
                page: page+1,
                limit
            }
        }
        if(startIndex >0 ){
            pagination.pre={
                page: page-1,
                limit
            }
        }
        res.status(200).json({success:true, count: bootcamps.length, pagination:pagination, data: bootcamps});
    // }catch(err){
        
    //     next(err);
    //     // console.log(err.message);
    //     // res.status(400).json({success: false});

    // }
});

// @desc       Get single Bootcamp
// @route      GET /api/v1/bootcamps/:id
// #access     Public
exports.getBootcamp = asyncHandler(async(req, res, next ) =>{
    //try{
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp)
            return next(new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404));
        res.status(200).send({success:true, data:bootcamp});
    // }catch(err){
    //     ///console.log(err.message);
    //     //res.status(400).json({success: false});
    //     next(err);
    // }
})

// @desc       Create new Bootcamps
// @route      POST /api/v1/bootcamps
// #access     private
exports.createBootcamp =  asyncHandler(async(req, res, next ) =>{
    //try{
       // console.log(req.body); 
     const bootcamp = await Bootcamp.create(req.body);
     res.status(201).json({success:true, data:bootcamp});
    // } catch(err){
        
    //     next(err);
    //     // console.log(err.message);
    //     // res.status(400).json({success: false});
    // }
      
   
})
// @desc       Update Bootcamps
// @route      PUT /api/v1/bootcamps/:id
// #access     Prvate
exports.updateBootcamp = asyncHandler(async(req, res, next ) =>{
    //try{
        // console.log(req.body); 
      const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
          new: true,
          runValidators: true
      });
      if(!bootcamp)
      return next(new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404));
      res.status(200).json({success:true, data:bootcamp});
    //  } catch(err){
         
    //     next(err);
    //     //  console.log(err.message);
    //     //  res.status(400).json({success: false});
    //  }
}) 

// @desc       Delete  Bootcamps
// @route      DELETE /api/v1/bootcamps/:id
// #access     Prvate
exports.deleteBootcamp = asyncHandler(async(req, res, next ) =>{
    //try{
        // console.log(req.body); 
      const bootcamp = await Bootcamp.findById(req.params.id);
      if(!bootcamp)
        return next(new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404));
      bootcamp.remove();
      res.status(200).json({success:true, data:{}});
    //  } catch(err){
         
    //     next(err);
    //     //  console.log(err.message);
    //     //  res.status(400).json({success: false});
    //  }
} );