import { Router } from 'express'
import { AnswerController } from './controllers/AnswerController.com';
import { NpsController } from './controllers/NpsController';
import { SendMailController } from './controllers/SendMailController';
import { SurveysController } from './controllers/SurveysController';
import { UserController } from './controllers/UsersController';

const router = Router();
const userController = new  UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const answerController = new AnswerController();
const npsController = new NpsController();

router.post("/users", userController.create);
router.post("/surveys", surveysController.create);
router.post("/sendMail", sendMailController.execute);

router.get("/surveys", surveysController.show);
router.get("/answers/:value", answerController.execute);
router.get("/nps/:survey_id", npsController.execute);

export { router };