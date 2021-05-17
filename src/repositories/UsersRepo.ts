import { Repository, EntityRepository } from 'typeorm'

import User from '../entities/User'

@EntityRepository(User)
export default class UsersRepo extends Repository<User> {
}