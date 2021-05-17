import { Entity, PrimaryColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'

@Entity("settings")
export default class Setting {

    @PrimaryColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    chat: boolean;

    @UpdateDateColumn()
    updated_at: Date;

    @CreateDateColumn()
    created_at: Date;

    //When creating a Setting object, if the database itself
    //doesn't automatically fill a random id, used the v4
    //method, imported from uuid, to fill this field
    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}