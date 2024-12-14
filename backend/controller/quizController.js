import { Question } from "../models/question.js";
import {Quiz} from "../models/quiz.js";
import { QuizAttempt } from "../models/quizAttempt.js";
import { User } from "../models/user.js";

export const createQuiz = async(req,res) =>{
    try {
        const {title,description,subject,timeLimit} = req.body;
        const user =await User.findById(req.id);
        //console.log(user);
        if(!user || user.role !== 'teacher'){
            return res.status(400).json({
                message: 'Unathorized acess',
                success: false
            })
        }

        if(!title || !subject || !timeLimit){
            return res.status(400).json({
                message: 'Something is Missing',
                success: false
            });
        }
        const quiz = await Quiz.create({
            title,
            description,
            subject,
            createdBy : user.id,
            timeLimit
        })
        return res.status(201).json({
            message: "Quiz created successfully",
            quiz,
            success : true
        })
    } catch (error) {
       console.log(error); 
    }
}

export const authorQuiz = async(req,res)=>{
    try {
        const authorId = req.id;
        const quizzes =await Quiz.find({createdBy:authorId});
        if(!quizzes){
            return res.status(404).json({
                message: "No quiz found",
                success : false
            })
        }
        return res.status(200).json({
            quizzes,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const attemptedQuiz = async(req,res)=>{
    try {
        const studentId = req.id;
        const attemptedQuizzes = await QuizAttempt.find({
            studentId,
            isCompleted: true
        }).populate({
            path: 'quizId',
            // select :description,subject,totalMarks
        })
        if(attemptedQuizzes.length === 0){
            return res.status(404).json({
                message: 'No attempted Quiz',
            })
        }

        return res.status(200).json({
            attemptedQuizzes,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const NotAttemptedQuiz = async(req,res)=>{
    try {
        const userId = req.id;
        //fetch all quizes assigned to a student
        const assignedQuizes = await Quiz.find({assignedStudents: userId});

        //fetch quizzes attempted by a student
        const attemptedQuizzes = await QuizAttempt.find({studentId: userId,isCompleted:true}).select('quizId');

        const attemptedQuizIds = attemptedQuizzes.map((attempt) => attempt.quizId.toString());
        const NotAttemptedQuiz = assignedQuizes.filter(quiz => !attemptedQuizIds.includes(quiz.id.toString()));
        if(!NotAttemptedQuiz){
            return res.status(400).json({
                message: "No Quiz for attempting pending",
                success : false
            })
        }
        return res.status(200).json({
            message: "NotAttempted quiz fetched succesfully",
            NotAttemptedQuiz,
            success : true
        })

    } catch (error) {
        console.log(error);
    }
};

export const getQuizById = async(req,res)=>{
    try {
        const id = req.params.id;
        const quiz = await Quiz.findById(id).populate({
            path: 'questions'
        });
        if(!quiz){
            return res.status(400).json({
                message: "Quiz not found",
                success: false
            })
        }
        return res.status(200).json({
            quiz,
            success: true
        })
        } catch (error) {
            console.log(error);
    }
}

export const deleteQuiz = async(req,res)=>{
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById({quizId});
        
        if(!quiz){
            return res.status(400).json({
                message: "Quiz not found",
            })
        }
        await QuizAttempt.deleteMany({quizId});
        await Question.deleteMany({quizId});

        await Quiz.findByIdAndDelete({quizId});
        return res.status(200).json({
            message:"Quiz deleted successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const assignQuiz = async(req,res)=>{
    try {
        const quizId = req.params.id;
        const {studentIds} = req.body;
        
        const quiz = await Quiz.findById(quizId);
        if(!quiz){
            return res.status(400).json({
                message: "Quiz not found",
            })
        }

        if(!studentIds || studentIds.length === 0){
            return res.status(400).json({
                message: "Student IDs are required",
            })
        }

        quiz.assignedStudents = [...new Set([...quiz.assignedStudents, ...studentIds])];
        await quiz.save();

        res.status(200).json({
            message: "Quiz assigned successfully",
            success: true,
            quizID : quiz.id,
            assignedStudents : quiz.assignedStudents
        })
    } catch (error) {
        console.log(error)
    }
}