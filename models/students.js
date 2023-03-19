const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const studentsSchema = new Schema({
    studentName:{
        type: String,
        required :true
    },
    StdAdm:{
        type: String,
        required :true,
        unique:true
    },
    email:{
        type: String,
        required :true,
        // unique:true
    },
    Password:{
        type: String,
        required :true
    }
},{timestamps:true});
const Students= mongoose.model('Student',studentsSchema)
module.exports = Students;