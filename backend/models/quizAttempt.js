import mongoose from "mongoose"

const quizAttemptSchema = new mongoose.Schema({
    quizId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startedAt:{
        type: Date,
        default : Date.now
    },
    completedAt:{
        type : Date,
    },
    answers:[
        {
            questionId :{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Question'
            },
            studentAnswer: Number,
            isCorrect: Boolean
        }
    ],
    score:{
        type: Number,
        default : 0
    },
    isCompleted :{
        type:Boolean,
        default : false
    }
});

export const QuizAttempt = mongoose.model('QuizAttempt',quizAttemptSchema)