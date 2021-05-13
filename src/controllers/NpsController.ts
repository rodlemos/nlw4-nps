import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUserRepository";

class NpsController {
    async execute(req: Request, res: Response) {
        const { survey_id } = req.params;
        const surveyUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUsers = await surveyUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractors = surveyUsers.filter(survey => 
            (survey.value >= 1 && survey.value <= 6)
        ).length;

        const promoters = surveyUsers.filter(survey => 
            (survey.value >= 9 && survey.value <= 10)
        ).length;

        const passives = surveyUsers.filter(survey => 
            (survey.value >= 7 && survey.value <= 8)
        ).length;

        const totalAnswers = surveyUsers.length;

        const calculate = Number((((promoters - detractors) / totalAnswers) * 100).toFixed(1));

        return res.json({
            detractors,
            promoters,
            passives,
            totalAnswers,
            nps: calculate
        })
    }
}

export { NpsController }