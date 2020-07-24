import {getRepository} from  "typeorm";
import {Request, Response} from "express";
import {Points} from '../entity/points';
import {Items} from '../entity/items';

export class PointsController{
    
    async insert(request:Request,response:Response){

        const data = request.body;
        
        const items = data.items.map((item_id:number)=>{
            return {
                id: item_id
            };
        })

        data.items = items;

        await getRepository(Points).save(data);

        return response.json({success:true}) 
       
    }
    
    async one(request: Request, response: Response) {
 
        const point = await getRepository(Points).findOne(request.params.id);
        
        const items = await getRepository(Items)
        .createQueryBuilder("items")
        .innerJoin("points_items_items",
        "point_items","point_items.pointsId=:id AND items.id=point_items.itemsId",
        {id:request.params.id})
        .distinct()
        .getMany();

        return response.json({point,items});
    }

    async filterPoint(request: Request,response: Response){

        const {uf,city,items} = request.query;

        const parsedItems = String(items)
        .split(",")
        .map(item=>{
            return Number(item.trim())
        })

        const filteredPoint = await getRepository(Points)
        .createQueryBuilder("point")
        .innerJoin("point.items","items")
        .select()
        .where("point.uf=:uf and point.city=:city",{uf:uf,city:city})
        .andWhere("items.id IN (:...parsedItems)",{parsedItems:parsedItems})
        .getMany();

        return response.json(filteredPoint);

    }  


}