import { Repository, EntityRepository } from 'typeorm'

import Connection from '../entities/Connection'

@EntityRepository(Connection)
export default class ConnectionsRepo extends Repository<Connection> {
}