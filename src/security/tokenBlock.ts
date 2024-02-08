import { Request, Response, NextFunction } from 'express';
import {pool} from '../DB/conexionDB'
import { Votacion } from '../models/votacionesModelsInterface';
import { Menu, User } from '../models/userModels';


import jwt from 'jsonwebtoken';

interface IPayload {
    _id: number,
    rol: number,
    menu: Menu[],
    iat: number,
    exp: number,
    votacion: Votacion[],
    user: User
}

interface current {
    current_date: Date,
    current_time: string
}


export const tokenGenerate = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const auth: any = req.header('authorization')
        const token = auth.split(' ')[1];
    
        if (!token) return res.status(401).jsonp({ message: 'Acceso denegado' });

        const payload = jwt.verify(token, process.env.TOKEN_SECRET || 'tokentest') as IPayload;

        if (!payload) return res.status(401).jsonp({ message: 'Token invalido' });
        
        req.userId = payload._id;
        req.userRol = payload.rol;
        req.menu = payload.menu;
        
        if (payload.votacion !== undefined) {
            req.votacion = payload.votacion;
        }

        next()
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') return res.status(401).jsonp({ message: "El tiempo de votación de usuario expiro." });
        if (error.name === 'JsonWebTokenError') return res.status(401).jsonp({ message: "Token no valido." });
        return res.status(500).jsonp({ message: "Error en Base de datos." });
    }
}

