import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText :{
        type : String,
        required : true
    },
    options:[
        {
            type : String,
            required: true
        }
    ],
    correctOption:{
        type: Number,
        required: true
    },
    marks :{
        type : Number,
        default : 1
    }
})

export const Question = mongoose.model('Question',questionSchema);