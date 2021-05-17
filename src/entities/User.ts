import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

@Entity("users")
export default class User {

    @PrimaryColumn()
    id: string

    @Column()
    email: string

    @CreateDateColumn()
    created_at: Date

    //When creating a User object, if the database itself
    //doesn't automatically fill a random id, used the v4
    //method, imported from uuid, to fill this field
    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}