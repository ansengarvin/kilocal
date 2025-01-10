import pg from 'pg'
import fs from 'fs'

const {Pool, types} = pg

/*
    By default, numerics are returned as strings by pg database.
    Our app doesn't need a high degree of precision, so we simply cast to float.
*/
types.setTypeParser(1700, function(val: string) {
    return parseFloat(val)
})

console.log("All env stuff:")
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)
console.log(process.env.DB_NAME)
console.log(process.env.CORS_URL)
console.log(process.env.DB_SSL)
console.log(process.env.CA_PATH)

const sslConfig = process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: true,
    ca: process.env.CA_PATH
} : false;

export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    idleTimeoutMillis: 0,
    ssl: sslConfig
})

