import { QuizAttempt } from "../models/quizAttempt.js";
import {Quiz} from "../models/quiz.js"

export const startquiz = async(req,res)=>{
    try {
        const quizId = req.params.id;
        const studentId =  req.body;

        const quiz= await Quiz.findById(quizId);
        if(!quiz){
            return res.status(400).json({
                message: "Quiz not found",
                success: false
            })
        }

        if(!quiz.assignedStudents.includes(studentId)){
            return res.status(403).json({
                message :'You are not authorised',
                success: false
            })
        }
        
        const existingAttempt = await QuizAttempt.findOne({
            quizId,studentId,
        });
        if(existingAttempt){
            return res.status(400).json({
                message: "You have already attempted this quiz",
                success : false,
            })
        }

        const newAttempt = new QuizAttempt({
            quizId,
            studentId,
        })
        await newAttempt.save();
        return res.status(200).json({
            message: "quiz started successfully",
            questions : quiz.questions
        })

    } catch (error) {
        console.log(error);
    }
}

export const saveSelectAnswer = async(req,res) =>{
    try {
        const {quizId,questionId} = req.params;

        const {studentId,selectedOption} = req.body;

        const quizAttempt = await QuizAttempt.findOne({quizId,studentId});
        if(!quizAttempt){
            return res.status(404).json({
                message:'quiz attempt not found.'
            })
        }
        const existingAnsIndex = quizAttempt.answers.findIndex((answer)=> ans.questionId.toString() === questionId);
        if(existingAnsIndex > -1){
            quizAttempt.answers[existingAnsIndex].studentAnswer = selectedOption;
        }
        else{
            quizAttempt.answers.push({
                questionId,
                studentAnswer: selectedOption,
                isCorrect : false
            })
        }

        await quizAttempt.save();
        return res.status(200).json({
            message: 'answer saved successfully',
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const submitResult = async(req,res)=>{
    try {
        const quizId = req.params.id;
        const studentId = req.body;

        const quizAttempt = await QuizAttempt.findOne({quizId,studentId}).populate({
            path: 'answers.questionId',
            select : 'correctOption'
        })
        if(!quizAttempt){
            return res.status(404).json({
                message: 'quiz attempt not found',
                success :false
            })
        }

        if(quizAttempt.isCompleted){
            return res.status(400).json({
                message: 'quiz already completed',
            })
        }
        const quiz = await Quiz.findById(quizId);
        if(!quiz){
            return res.status(404).json({
                message: 'quiz not found',
                success: false
            })
        }
        let score = 0;
        const resultDeatails = quizAttempt.answers.map((answer) =>{
            const correctAnswerInd = answer.questionId.correctOption; 
            const isCorrect = answer.studentAnswer === correctAnswerInd;
            if(isCorrect){
                score++;
            }
            return {
                questionId: answer.questionId.id,
                studentAnswer: answer.studentAnswer,
                correctAnswerInd,
                isCorrect
            }
        });
        quizAttempt.score = score;
        quizAttempt.isCompleted = true;
        quizAttempt.completedAt = new Date();
        await quizAttempt.save();

        return res.status(200).json({
            message: 'Quiz submitted successfully',
            score,
            totalQUestions : quiz.questions.length,
            resultDeatails
        })
    } catch (error) {
        console.log(error);
    }
}

export const getLeaderBoard = async(req,res)=>{
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById({quizId});
        if(!quiz){
            return res.status(404).json({
                message: 'quiz not found',
            })
        }
        const attempts = QuizAttempt.find({quizId,isCompleted:true}).populate({
            path: 'studentId',
            select: fullname,email
        }).sort({score : -1}).select(studentId,score);

        if(!attempts){
            return res.status(404).json({
                message: 'No attempts found',
            });
        }

        const leaderboard = attempts.map((attempt,index) =>({
            rank : index +1,
            fullname: attempt.studentId.fullname,
            email : attempt.studentId.email,
            score : attempt.score,
            Total_marks : quiz.totalMarks
        }));

        return res.status(200).json({
            leaderboard,
            message: 'Leaderboard fetched successfully',
        })
    } catch (error) {
        console.log(error)
    }
}