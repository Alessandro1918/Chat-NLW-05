import { Repository, EntityRepository } from 'typeorm'

import Setting from '../entities/Setting'

@EntityRepository(Setting)
export default class SettingsRepo extends Repository<Setting> {
}