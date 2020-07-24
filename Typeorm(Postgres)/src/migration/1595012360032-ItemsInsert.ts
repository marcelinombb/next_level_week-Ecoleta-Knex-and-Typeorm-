import {MigrationInterface, QueryRunner} from "typeorm";

export class ItemsInsert1595012360032 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.manager.createQueryBuilder()
        .insert()
        .into('items')
        .values([
            {title : "Lâmpadas", image:"lampadas.svg"},
            {title : "Pilhas e Baterias", image:"baterias.svg"},
            {title : "Papéis e Papelão", image:"papeis-papelao.svg"},
            {title : "Residuos Eletronicos", image:"eletronicos.svg"},
            {title : "Residuos Organicos", image:"organicos.svg"},
            {title : "|ôleo de Cozinha", image:"oleo.svg"}
        ])
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
