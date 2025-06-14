import sql from "mssql";

// If a local database isn't being used, these environment variables must be set.
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    driver: process.env.DB_DRIVER,
    options: {
        encrypt: true,
        trustServerCertificate: process.env.LOCAL_DB == "true",
        connectionTimeout: 30000, // 30 seconds
    },
};

// Retry configuration
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000; // 3 seconds

async function connectWithRetry(retryCount = 0) {
    try {
        const pool = new sql.ConnectionPool(sqlConfig);
        await pool.connect();
        console.log("Connected to MSSQL successfully");
        return pool;
    } catch (err) {
        if (retryCount < MAX_RETRIES) {
            console.log(`Connection attempt ${retryCount + 1} failed. Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
            console.error("Error details:", err.message);

            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));

            // Recursive retry with incremented counter
            return connectWithRetry(retryCount + 1);
        } else {
            console.error(`Failed to connect after ${MAX_RETRIES} attempts:`, err);
            throw err;
        }
    }
}

export async function getPool() {
    return poolPromise;
}

// Export a promise that resolves to the connected pool
export const poolPromise = connectWithRetry();
