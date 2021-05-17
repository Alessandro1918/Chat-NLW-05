import { Request, Response } from 'express'

import SettingsService from '../services/SettingsService'

export default class SettingsController {

    async create(request: Request, response: Response){

        const {chat, username} = request.body
        //No need to get other fields like id, updated_at or created_at.
        //They will be auto filled or have default values
        
        const settingsService = new SettingsService()
    
        try {
            const settings = await settingsService.create({
                chat, username
            })
            return response.json(settings)
        } catch(err) {
            return response.status(400).json({message: err.message})
        }
    }

    async findByUsername(request: Request, response: Response) {
        
        const {username} = request.params

        const settingsService = new SettingsService()

        const settings = await settingsService.findByUsername(username)
        
        return response.json(settings)
    }

    async update(request: Request, response: Response) {

        const {username} = request.params
        const {chat} = request.body

        const settingsService = new SettingsService()

        //service for the 'create' method: uses a {} object of type ISettingsCreate;
        //service for the 'update' method: uses two string params;
        //so, here I don't need to call the method with {}!
        const settings = await settingsService.update(
            username, chat
        )

        return response.json(settings)
    }
}