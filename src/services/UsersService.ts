import { getCustomRepository } from 'typeorm'

import UsersRepo from '../repositories/UsersRepo'

export default class UsersService {

    async create(email: string) {
        const usersRepo = getCustomRepository(UsersRepo)

        const userAlreadyExists = await usersRepo.findOne({email})
        if (userAlreadyExists) {
            return userAlreadyExists    //type: User, not Boolean
        }

        const user = usersRepo.create({
            email
        })

        await usersRepo.save(user)

        return user
    }
}