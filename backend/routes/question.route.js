import express from "express"
import isAuthenticated from "../middleware/isAuth.js";
import { addQuestion, updateQuestion } from "../controller/questionController.js";

const router = express.Router();

router.route('/addQuestion/:id').post(isAuthenticated,addQuestion);
router.route('/update/:id').post(isAuthenticated,updateQuestion);

export default router;