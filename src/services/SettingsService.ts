import { getCustomRepository } from 'typeorm'

import SettingsRepo from '../repositories/SettingsRepo'
import Setting from '../entities/Setting'

interface ISettingsCreate {
    chat: boolean;
    username: string;
}

export default class SettingsService {

    //Create a setting (chat: true or false) for a user
    async create({chat, username}: ISettingsCreate) {

        const settingsRepo = getCustomRepository(SettingsRepo)
        
        //Validation to check if user already exists
        //(can't have 2 settings config for one user)
        const userAlreadyExists = await settingsRepo.findOne({username})
        if (userAlreadyExists) {
            throw new Error("User already exists")
        }

        const setting = settingsRepo.create({
            chat, username
        })
    
        await settingsRepo.save(setting)

        return setting
    }

    //Get the setting (chat: true or false) for that user
    async findByUsername(username: string) {

        const settingsRepo = getCustomRepository(SettingsRepo)

        const settings = await settingsRepo.findOne({
            username
        })
        
        return settings
    }

    //Edit the setting (chat: true or false) for that user
    async update(username: string, chat: boolean){

        const settingsRepo = getCustomRepository(SettingsRepo)

        await settingsRepo
        .createQueryBuilder()
        .update(Setting)
        .set({chat})
        .where("username = :username", {
            username
        })
        .execute()
    }
}