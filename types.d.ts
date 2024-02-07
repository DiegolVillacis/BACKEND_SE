declare namespace Express {
    export interface Request {
        userId: number,
        userRol: number,
        menu: Menu[]
        votacion: Votacion[]
        files:any
    }
}