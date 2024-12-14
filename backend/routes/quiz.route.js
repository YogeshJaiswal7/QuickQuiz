import express from "express"
import isAuthenticated from "../middleware/isAuth.js";
import { assignQuiz, attemptedQuiz, authorQuiz, createQuiz, getQuizById, NotAttemptedQuiz } from "../controller/quizController.js";

const router = express.Router();
router.route('/createQuiz').post(isAuthenticated,createQuiz);
router.route('/authorQuiz').get(isAuthenticated,authorQuiz);
router.route('/attemptedQuiz').get(isAuthenticated,attemptedQuiz);
router.route('/notattemptedQuiz').get(isAuthenticated,NotAttemptedQuiz);
router.route('/getquiz/:id').get(getQuizById);
router.route('/assign/:id').put(assignQuiz);

export default router;