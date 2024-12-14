import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    description:{
        type: String,
    },
    subject:{
        type: String,
        required : true
    },
    createdBy :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    totalMarks:{
        type : Number,
        default : 0
    },
    assignedStudents:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User',
        }
    ],
    timeLimit: {
        type : Number,
        required : true
    },
    questions:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Question'

        }
    ]
},{timestamps : true});

export const Quiz = mongoose.model('Quiz',quizSchema);