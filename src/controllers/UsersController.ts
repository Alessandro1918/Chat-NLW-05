import { Request, Response } from 'express'

import UsersService from '../services/UsersService'

export default class UsersController {

    async create(request: Request, response: Response): Promise<Response>{

        const {email} = request.body
        //No need to get other fields like id or created_at.
        //They will be auto filled or have default values
        
        const usersService = new UsersService()

        const user = await usersService.create(email)
        
        return response.json(user)
    }
}