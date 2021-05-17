import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid'

import User from './User'

@Entity("connections")
export default class Connection{
    
    @PrimaryColumn()
    id: string;

    @Column()
    admin_id: string;
    
    //This one is not a table column; it's an instance of an Object
    //Relação: Many Connections to One User
    @JoinColumn({name: "user_id"})
    @ManyToOne(() => User)
    user: User;

    @Column()
    user_id: string;
    
    @Column()
    socket_id: string;
    
    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;

    //When creating a Message object, if the database itself
    //doesn't automatically fill a random id, used the v4
    //method, imported from uuid, to fill this field
    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}