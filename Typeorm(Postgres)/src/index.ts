import "reflect-metadata";
import * as express from "express";
import { createConnection }  from 'typeorm';
import * as bodyParser from "body-parser";
import routes from "./routes";
import {resolve} from 'path';

createConnection().then(async connection => {

    const app = express();
    app.use(bodyParser.json());
    app.use(routes); 
    app.use('/uploads',express.static(resolve(__dirname,'..','uploads')));

    app.listen(3333);

    console.log("Express server has started on port 3000. Open http://localhost:3000 to see results");

}).catch(error => console.log(error));
