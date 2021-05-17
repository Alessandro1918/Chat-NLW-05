import { Request, Response } from 'express'

import MessagesService from '../services/MessagesService'

export default class MessagesController{

    async create(request: Request, response: Response){

        const {admin_id, user_id, text} = request.body
        //No need to get other fields like id or created_at.
        //They will be auto filled or have default values

        const messagesService = new MessagesService()

        const message = await messagesService.create({
            admin_id, user_id, text
        })

        return response.json(message)
    }

    async list(request: Request, response: Response){

        const {user_id} = request.params

        const messageService = new MessagesService()

        const list = await messageService.listFromUser(
            user_id
        )

        return response.json(list)
    }
}