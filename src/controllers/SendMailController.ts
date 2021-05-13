import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/surveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUserRepository";
import { UsersRepository } from "../repositories/usersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
    async execute(request: Request, response: Response) {
      const { email, survey_id } = request.body;
  
      const usersRepository = getCustomRepository(UsersRepository);
      const surveysRepository = getCustomRepository(SurveysRepository);
      const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
  
      const user = await usersRepository.findOne({ email });
  
      if (!user) {
        throw new AppError("User do not exists.");
      }
  
      const survey = await surveysRepository.findOne({
        id: survey_id,
      });
  
      if (!survey) {
        throw new AppError("Survey do not exists.");
      }
      
      const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
      
      const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
        where: { user_id: user.id, value: null, survey_id: survey_id },
        relations: ['user', 'survey'],
      });
      
      const variables = {
        name: user.name,
        title: survey.description,
        id: "",
        link: process.env.URL_MAIL,
      };
  
      if (surveyUserAlreadyExists) {
        variables.id = surveyUserAlreadyExists.id;
        await SendMailService.execute(email, survey.title, variables, npsPath);
        return response.json(surveyUserAlreadyExists);
      };
  
      const surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id,
      });
  
      await surveysUsersRepository.save(surveyUser);
      variables.id = surveyUser.id

      await SendMailService.execute(email, survey.title, variables, npsPath);
  
      return response.json(surveyUser);
    };
  };  

export { SendMailController };