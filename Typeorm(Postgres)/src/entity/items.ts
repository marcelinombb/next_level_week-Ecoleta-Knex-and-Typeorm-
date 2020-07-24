import { type } from "os";
import {Entity,PrimaryGeneratedColumn,Column, ManyToMany} from "typeorm";
import { Points } from "./points";

@Entity()
export class Items{
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    image:string;

    @ManyToMany(type=>Points)
    points:Points[];
}