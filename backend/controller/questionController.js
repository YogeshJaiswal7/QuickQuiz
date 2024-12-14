import {Question} from '../models/question.js'
import { Quiz } from '../models/quiz.js';

export const addQuestion = async(req,res)=>{
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
        if(!quiz){
            return res.status(404).json({
                message: "Quiz not found",
                success : false
            });
        }
        const{questionText,options,correctOption} = req.body;
        if(!questionText || options.length < 4  || !correctOption){
            return res.status(400).json({
                message: "Please fill all the fields",
                success : false
            })
        }
        if(correctOption < 0 || correctOption > 4){
            return res.status(404).json({
                message: "Invalid correct option",
                success : false
            })
        }
        const question = await Question.create({
            questionText,
            options,
            correctOption
        });
        
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId,
            {$push: {questions: question.id}},
            {new: true},
        ).populate('questions');

        if(!updatedQuiz){
            return res.status(404).json({
                message: "Quiz not found",
                success : false
            })
        }
        return res.status(201).json({
            message: "Question added successfully",
            // quiz: updatedQuiz,
            success : true
    });
    } catch (error) {
        console.log(error);
    }
}

export const updateQuestion = async(req,res)=>{
    try {
        const questionId = req.params.id;
        let question = await Question.findById(questionId);
        if(!question){
            return res.status(404).json({
                message: "Question not found",
                success: false
            })
        }
        const {questionText,options,correctOption} = req.body;
        // let optionArray;
        // if(options){
        //     optionArray = options.split(',');
        // }

        if(questionText)question.questionText = questionText;
        if(options)question.options = options;
        if(correctOption)question.correctOption = correctOption;

        await question.save();

        question = {
            _id : question._id,
            questionText : question.questionText,
            options : question.options,
            correctOption: question.correctOption
        }
        return res.status(200).json({
            message: "Question updated successfully",
            question,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

// export const deleteQuestion = async(req,res)=>{
//     const quesId = req.params.id;
    
// }