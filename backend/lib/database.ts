import sql from "mssql";

console.log("All env stuff:");
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_NAME);
console.log(process.env.CORS_URL);
console.log(process.env.DB_SSL);
console.log(process.env.CA_PATH);

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
  },
};

export const pool = new sql.ConnectionPool(sqlConfig);
