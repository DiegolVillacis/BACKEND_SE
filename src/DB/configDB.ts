const database = {
    username: process.env.USERNAME_DB || 'postgres',
    password: process.env.PASSWORD_DB || "diego",
    database: process.env.DATABASE || "sistema4",
    host: process.env.HOST_DB || "localhost",
    port: 5432
}
export { database }