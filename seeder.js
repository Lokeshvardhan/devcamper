const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env avriables
dotenv.config({path: './config/config.env'});
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

//connect to database
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useCreateIndex : true,
    useFindAndModify: false,
    useUnifiedTopology: true
});


//Read json files
const bootcamps  = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses  = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
//import into db
const importData = async() =>{
    try{
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Data is imported');
        process.exit();
    } catch(err){
        console.log(err.message);
    }
}

// delete data 
const deleteData = async() =>{
    try{
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data is destroyed');
        process.exit();
    } catch(err){
        console.log(err.message);
    }
}

if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d'){
    deleteData();
}