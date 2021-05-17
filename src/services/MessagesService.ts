import { getCustomRepository, Repository } from "typeorm";

import MessagesRepo from '../repositories/MessagesRepo'
import Message from '../entities/Message'

interface IMessageCreate {
    admin_id?: string;  //This one can be null
    user_id: string;
    text: string;
}

export default class MessagesService {

    private messagesRepo: Repository<Message>;
    constructor() {
        this.messagesRepo = getCustomRepository(MessagesRepo)
    }

    async create({admin_id, user_id, text}: IMessageCreate){

        //const messagesRepo = getCustomRepository(MessagesRepo)

        const message = this.messagesRepo.create({
            admin_id, user_id, text
        })

        await this.messagesRepo.save(message)

        return message
    }

    async listFromUser(user_id: string){

        //const messagesRepo = getCustomRepository(MessagesRepo)

        const messages = await this.messagesRepo.find({
            //V1 - return the messages from that user
            //user_id

            //V2 = V1, with JOIN with table 'users' at 'user_id'
            where: {user_id},
            relations: ["user"]     //name from the property in the entities/Message.ts file
        })

        return messages
    }
}