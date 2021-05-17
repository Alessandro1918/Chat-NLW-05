import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

import User from './User'

@Entity("messages")
export default class Message {
    
    @PrimaryColumn()
    id: string;

    @Column()
    admin_id: string;
    
    //This one is not a table column; it's an instance of an Object
    //Relação: Many Messages to One User
    @JoinColumn({name: "user_id"})
    @ManyToOne(() => User)
    user: User;

    @Column()
    user_id: string;
    
    @Column()
    text: string;
    
    @CreateDateColumn()
    created_at: Date;

    //When creating a Message object, if the database itself
    //doesn't automatically fill a random id, used the v4
    //method, imported from uuid, to fill this field
    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}