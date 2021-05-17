import { getCustomRepository, Repository } from 'typeorm'

import ConnectionsRepo from '../repositories/ConnectionsRepo'
import Connection from '../entities/Connection'

interface IConnectionCreate{
    id?: string;        //Optional
    admin_id?: string;
    user_id: string;
    socket_id: string;
}

export default class ConnectionsService {

    private connectionsRepo: Repository<Connection>;
    constructor() {
        this.connectionsRepo = getCustomRepository(ConnectionsRepo)
    }

    //NOTE: Unlike every Service that is imported by a Controller,
    //this one will be used by a web socket (client.ts)
    async create({admin_id, user_id, socket_id, id}: IConnectionCreate) {
    
        const connection = this.connectionsRepo.create({
            id, admin_id, user_id, socket_id
        })

        await this.connectionsRepo.save(connection)

        return connection
    }

    async findByUserId(user_id: string) {
        const connection = await this.connectionsRepo.findOne({
            user_id
        })

        return connection
    }

    async findAllWithoutAdmin() {
        const connections = this.connectionsRepo.find({
            where: {admin_id: null},
            relations: ["user"]
        })
        return connections
    }

    async findBySocketID(socket_id: string) {
        const connection = await this.connectionsRepo.findOne({socket_id})
        return connection
    }

    async updateAdminId(user_id: string, admin_id:string) {
        await this.connectionsRepo
        .createQueryBuilder()
        .update(Connection)
        .set({admin_id})
        .where("user_id = :user_id", {
            user_id
        })
        .execute()
    }
}