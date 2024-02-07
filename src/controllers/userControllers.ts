import { Request, Response } from "express";
import { pool } from "../DB/conexionDB";
import jwt from "jsonwebtoken";
import { User, UsuarioAtributos } from '../models/userModels';
import { Votacion } from '../models/votacionesModelsInterface';
import { verMenuRol, getParametros, secuencia } from "../security/securityBlock";
import { Usuario } from "../models/userModelsnterface";
import { log } from "console";

import { Menu } from 'models/userModels';



/**
 * Login del sistema
 * @param req Request de la peticion del frontend
 * @param res Response que se envia al frontend
 * @returns usuario, menu logeado
 */
export const login = async (req: Request, res: Response) => {

    const { correo_usuario, pass_usuario } = req.body;

    try {

        // busca usuario activo.
        let user = await pool.query(`SELECT (u.nombre_usuario || \' \' || u.apellido_usuario) as fullname, 
                                    u.*, r.habilitado_rol, r.duracion_rol, r.nombre_rol as nrol  
                                    FROM usuario u inner join rol r on r.id_rol = u.rol_usuario 
                                    WHERE u.correo_usuario = $1 AND u.pass_usuario = $2 AND u.matriculado = true`, 
                                    [correo_usuario, pass_usuario])
            .then(result => {
                return result.rows[0]
            }) as User;

        if (user) {
            if (user.habilitado_rol === true) {
                if (user.uservoto === true) return res.status(200).jsonp({ cod: "ERROR", message: "Usuario ya sufrago." });
            } 
            
            let votacion = await pool.query('SELECT * FROM votacion WHERE estado_votacion = true ORDER BY fecha_votacion DESC LIMIT 1')
                .then(result => { return result.rows }) as Votacion[];
            // aqui una funcion para comparar la hora del sistema.

            user.pass_usuario = '';
            let menu = await verMenuRol(user.rol_usuario);

            user.iniciales = (user.nombre_usuario !== "") ? user.nombre_usuario.slice(0, 1) : '';
            user.iniciales = (user.apellido_usuario !== "") ? user.iniciales + user.apellido_usuario.slice(0, 1) : '';
            
            let token = jwt.sign({ _id: user.id_usuario, rol: user.rol_usuario, votacion, menu, user }, process.env.TOKEN_SECRET || 'tokentest', { expiresIn: user.duracion_rol }); 

            return res.status(200).jsonp({ cod: "OK", message: "Ingreso Exitoso", user: user, menu, authorization: token });
        }

        return res.status(200).jsonp({ cod: "ERROR", message: "Correo o contraseña incorrectos" });
    } catch (error) {
        log(error)
        return res.status(500).jsonp({ message: "Error al ingresar" });
    }

};



export const getMenuItems = async (req: Request, res: Response) => {
    try {
        const rol = req.userRol;
        const q = `SELECT * FROM menu WHERE id_rol = ${rol} order by id_recursivo`;

        const menu = await pool.query(q).then(result => result.rows);

        let menunode: Menu[] = [];
        if (menu.length > 0) {
            const menupadres = menu.filter((o: Menu) => o.direccion_menu == null && o.id_recursivo == null);
            menupadres.forEach((o: Menu) => {
                o.hijos = menu.filter((m: Menu) => o.id_menu == m.id_recursivo);
                menunode.push(o);
            });
        }

        return res.status(200).jsonp({
            cod: "OK",
            message: "",
            menu: menunode,
        });
    } catch (error) {
        return res.status(500).jsonp({
            message: "Error al ingresar",
        });
    }
};


// export const getMenuItems = async (req: Request, res: Response) => {

//     try {
//         let menu = await verMenuRol(req.userRol);

//         return res.status(200).jsonp({ 
//             cod: "OK", 
//             message: "", 
//             menu 
//         });

//     } catch (error) {
        
//         return res.status(500).jsonp({ 
//             message: "Error al ingresar" 
//         });
//     }
// }




export const getListasEstudiante = async (req: Request, res: Response) => {
    try {

        const users: User[] = await pool.query('SELECT (nombre_usuario || \' \' || apellido_usuario) as fullname, apellido_usuario, cedula_usuario, correo_usuario, nombre_usuario, userestudiante, id_usuario, rol_usuario, uservoto, matriculado FROM usuario ORDER BY id_usuario').then(result => { return result.rows })

        return res.status(200).jsonp({ cod: "OK", message: "", users});
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};

export const getListasEstudiantenovoto = async (req: Request, res: Response) => {
    try {

        const users: User[] = await pool.query('SELECT (nombre_usuario || \' \' || apellido_usuario) as fullname, apellido_usuario, cedula_usuario, correo_usuario, nombre_usuario, userestudiante, id_usuario, rol_usuario, uservoto, matriculado FROM usuario WHERE uservoto = false AND rol_usuario != 3 AND rol_usuario != 1 AND matriculado = true ORDER BY id_usuario').then(result => { return result.rows })

        return res.status(200).jsonp({ cod: "OK", message: "", users});
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};


export const getListasEstudiantevota = async (req: Request, res: Response) => {
    try {

        const users: User[] = await pool.query('SELECT (nombre_usuario || \' \' || apellido_usuario) as fullname, apellido_usuario, cedula_usuario, correo_usuario, nombre_usuario, userestudiante, id_usuario, rol_usuario, uservoto, matriculado FROM usuario WHERE rol_usuario = 2 OR rol_usuario = 4 ORDER BY id_usuario').then(result => { return result.rows })

        return res.status(200).jsonp({ cod: "OK", message: "", users});
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};





export const createEstudiante = async (req: Request, res: Response) => {
    try {
        let usuario: UsuarioAtributos= req.body;
        let sec: number = await secuencia('usuario','id_usuario')
        sec = sec + 1;
        usuario.id_usuario = sec;
        usuario.createdat = new Date();

        await Usuario.create(usuario,{ returning: false});

        return res.status(200).jsonp({ cod: "OK", message: "Estudiante registrado" });
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
};






 export const updateEstudiante = async (req: Request, res: Response) => {
    try {

        let usuario: UsuarioAtributos= req.body;
        
        if (usuario == null) {
            return res.status(200).jsonp({ cod: "ERROR", message: "Usuario no encontrado" });
        }
        usuario.updatedat = new Date();
        await Usuario.update(usuario, { where: { id_usuario: usuario.id_usuario } });

        return res.status(200).jsonp({ cod: "OK", message: "Estudiante actualizado" });
    } catch (error) {
        return res.status(500).jsonp({ message: "Falla de la BDD" });
    }
}











//////////////////////

export const getMenuItemss = async (req: Request, res: Response) => {
    try {
        const rol = req.userRol;

        const query = `
            SELECT * 
            FROM menu 
            WHERE id_rol = $1 
            ORDER BY id_recursivo
        `;

        const { rows: menu }: { rows: Menu[] } = await pool.query(query, [rol]);

        return res.status(200).jsonp({ cod: 'OK', message: '', menu });

    } catch (error) {
        console.error('Error al obtener el menú:', error);
        return res.status(500).jsonp({ message: 'Error interno del servidor' });
    }
};











import excel from 'xlsx';
const SHA256 = require('crypto-js/sha256');


export const updateArchivo = async (req: Request, res: Response) => {
    try {
        
        let file: any = req['files'];
        const { metodo } = req.query;
        const workbook = excel.readFile(file.file.tempFilePath);
        const sheet_name_list = workbook.SheetNames;
        const DATA_EXCEL:any[] = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        
        let exito = true;
        let lerror: any[] = [];
        switch (metodo) {
            case 'estudiantes':
                const data: UsuarioAtributos[] = DATA_EXCEL;
                lerror = await archivoUsuario(data)
                break;
            default:
                exito = false;
                break;
        }
        if (exito) {
            if (lerror.length === 0) {
                return res.status(200).jsonp({ cod: "OK", message: "Archivo subido" });
            } else {
                return res.status(200).jsonp({ cod: "ERROR", message: "Archivo procesado con campos erroneos", lerror });
            }
        } else {
            return res.status(200).jsonp({ cod: "ERROR", message: "Metodo no reconocido para el archivo" });
        }
    } catch (error) {
        console.error('Error al procesar archivo:', error);
        return res.status(500).jsonp({ message: "Error al ingresar" });
    }

};

const ROL_ESTUDIANTE: number = 2;
const ACTIVO: boolean = true;
const ESTUDIANTE: boolean = true;
const SUFRAGO: boolean = false;


const archivoUsuario = async (data: UsuarioAtributos[]) => {
    const lusuarios = await Usuario.findAll();
    let lerror: any[] = [];
    try {
        let sec: number = await secuencia('usuario','id_usuario')
        for (let usuario of data) {
            sec = sec + 1;
            const existe = lusuarios.filter(o => { return o.cedula_usuario === usuario.cedula_usuario.toString()});
            const contrasenia = SHA256( usuario.pass_usuario ).toString();
            usuario.rol_usuario = ROL_ESTUDIANTE;
            usuario.matriculado = ACTIVO;
            usuario.userestudiante = ESTUDIANTE;
            usuario.uservoto = SUFRAGO;
            usuario.pass_usuario = contrasenia;
            if (existe.length === 0) {
                usuario.id_usuario = sec;
                usuario.createdat = new Date();
                await Usuario.create(usuario,{ returning: false}).catch(err => {
                    lerror.push(usuario);
                });
            } else {
                usuario.updatedat = new Date();
                await Usuario.update(usuario, { where: { cedula_usuario: usuario.cedula_usuario } }).catch(err => {
                    lerror.push(usuario);
                });
            }
        }
        return lerror
    } catch (error) {
        throw new Error("ERROR EN LA EJECUCION DEL ARCHIVO");
    }
}