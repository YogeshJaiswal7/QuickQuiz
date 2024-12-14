import express from "express"
import isAuthenticated from "../middleware/isAuth.js";
import { getLeaderBoard, saveSelectAnswer, startquiz, submitResult } from "../controller/quizAttemptController.js";

const router = express.Router();

router.route('/startquiz/:id').post(isAuthenticated,startquiz);
router.route('/quiz/:quizId/question/:questionId/ans').post(isAuthenticated,saveSelectAnswer);
router.route('/submit/:id').post(isAuthenticated,submitResult)
router.route('/quiz/submitquiz/:id').get(isAuthenticated,getLeaderBoard);

export default router