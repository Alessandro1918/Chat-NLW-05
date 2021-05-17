import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createMessages1619041635411 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "messages",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "admin_id",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "user_id",
                        type: "uuid"
                    },
                    {
                        name: "text",
                        type: "varchar"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ],
                //V1 way to create a FK; V2 is in migrations/create_connections
                //Foreing Key from User:
                //the collumn "user_id" get its value
                //from table "user", column "id"
                foreignKeys: [
                    {
                        name: "FKUser",
                        columnNames: ["user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id"],
                        onDelete: "SET NULL",   //what to do if user
                        onUpdate: "SET NULL"    //is deleted / updated
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("messages")
    }

}
