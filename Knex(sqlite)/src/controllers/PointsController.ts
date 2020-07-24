import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController{

    async create(request: Request,response: Response){
        const data = request.body;
        data.image = "image-fake";

        const items = data.items;

        delete data.items;

        const trx = await knex.transaction();

        const id = await trx('points').insert(data);

        const pointItems = items.map((item_id : Number) =>{
            return {
                item_id : item_id,
                point_id: id[0]
            };
        })

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({success : true});

    }

    async show(request:Request,response:Response){
        const {id} = request.params;
        const point = await knex("points").where("id",id).first();

        if(!point) return response.status(400).json({message : "point not found"});

        const items = await knex("items")
        .join("point_items","items.id","=","point_items.item_id")
        .where("point_items.point_id",id)
        .select("items.title");
        
        return response.json({point,items});
    }

    async filterPoint(request:Request,response:Response){
        const { city, items, uf } = request.query;

        const parsedItems = String(items)
          .split(',')
          .map(item => Number(item.trim()));
    
        const points = await knex('points')
          .join('point_items', 'points.id', '=', 'point_items.point_id')
          .whereIn('point_items.item_id', parsedItems)
          .where('city', String(city))
          .where('uf', String(uf))
          .distinct()
          .select('points.*');

        //const pointItems = await knex('items').select("*").whereIn("items.id",parsedItems).distinct()
    
        return response.json(points);
    }
}

export default PointsController;