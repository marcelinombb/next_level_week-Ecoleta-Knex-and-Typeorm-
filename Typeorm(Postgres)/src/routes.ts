import {Router} from 'express';
import {PointsController} from "./controller/PointsController";
import {ItemsController} from "./controller/ItemsController";

const pointController = new PointsController();
const itemsController = new ItemsController();

const routes = Router();

routes.post("/new_point",pointController.insert);
//routes.get("/points/:id",pointController.pointItems);
routes.get("/points",pointController.filterPoint);
routes.get("/points/:id",pointController.one);
routes.get("/items",itemsController.all);

export default routes;
