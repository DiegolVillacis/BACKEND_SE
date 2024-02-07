
import dotenv from 'dotenv';
dotenv.config()

import app from "./routes/routesGeneral";

import {sequelize} from './DB/conexionDB';

function main() {
    app.listen(app.get('port'), () => {
        sequelize.authenticate().then(() => {
            console.log("Conexion DB");
        }).catch(error => {
            console.log('Se ha producido un error', error);
        })
    });
    console.log('Puerto:', app.get('port'));
}

main();