import express from 'express'
import isAuthenticated from '../middleware/isAuth.js';
import { getAllStudent, login, logout, register } from '../controller/userController.js';

const router = express.Router();

router.route("/register").post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/getallStudent').get(isAuthenticated,getAllStudent)
export default router