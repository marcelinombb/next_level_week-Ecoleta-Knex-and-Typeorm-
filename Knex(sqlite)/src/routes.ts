import express, { request } from "express";
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController';

const pointsController = new PointsController();
const itemsController = new ItemsController();

const routes = express.Router();

routes.post("/new_point", pointsController.create);
routes.get("/points/:id", pointsController.show);
routes.get("/points", pointsController.filterPoint);
routes.get("/items", itemsController.index);

export default routes;