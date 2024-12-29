import pg from 'pg'

const {Pool, types} = pg

types.setTypeParser(1700, function(val) {
    return parseFloat(val)
})

export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    idleTimeoutMillis: 0
})

