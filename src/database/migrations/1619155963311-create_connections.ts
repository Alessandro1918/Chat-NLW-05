import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class createConnections1619155963311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "connections",
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
                        name: "socket_id",
                        type: "varchar"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()"
                    }
                ]
            })
        )

        //V2 way to create a FK; V1 is in migrations/create_messages
        await queryRunner.createForeignKey(
            "connections",
            new TableForeignKey({
                name: "FKUser",
                columnNames: ["user_id"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",   //what to do if user
                onUpdate: "SET NULL"    //is deleted / updated
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("connections", "FKUser")
        await queryRunner.dropTable("connections")
    }

}
