import {Entity,PrimaryGeneratedColumn,Column, ManyToMany, JoinTable} from 'typeorm';
import {Items} from './items';

@Entity()
export class Points{
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({nullable:true})
    image:string;

    @Column()
    email:string;

    @Column()
    whatsapp:string;

    @Column("double precision")
    latitude:number;

    @Column("double precision")
    longitude:number;

    @Column()
    uf:string;

    @Column()
    city:string;

    @ManyToMany(type=>Items)
    @JoinTable()
    items:Items[];
}