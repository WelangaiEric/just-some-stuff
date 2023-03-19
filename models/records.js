const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const recordsSchema = new Schema({
    studentName:{
        type: String,
        required :true
    },
    StdAdm:{
        type: String,
        required :true
    },
    email:{
        type: String,
        required :true,
        unique:true
    },
    Depart1:{
        type: String,
        required :true
    },
    Depart2:{
        type: String,
        required :true
    },
    Depart3:{
        type: String, 
        required :true
    }
},{timestamps:true});
const Records= mongoose.model('Record',recordsSchema)
module.exports = Records;