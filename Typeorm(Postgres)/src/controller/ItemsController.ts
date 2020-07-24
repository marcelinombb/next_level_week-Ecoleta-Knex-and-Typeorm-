import {getRepository} from 'typeorm';
import {Request, Response} from "express";
import {Items} from "../entity/items";

export class ItemsController{

    async insert(request:Request,response:Response){

        await getRepository(Items).save(request.body);

        return response.json({success:true})
    }

    async all(request:Request,response:Response){

        const items = await getRepository(Items).find();

        const serializedItems = items.map(item=>{
            return {
                id:item.id,
                title:item.title,
                url_image:`http://192.168.1.116:3333/uploads/${item.image}`
            }
        })

        return response.json(serializedItems);
    }

}