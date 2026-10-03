const path = require("path");
const mysql = require("mysql2/promise");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const connection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "node_project",
    port: Number(process.env.DB_PORT || 3306),
    connectionLimit: 10,
    connectTimeout: 10000
});

const waitForDatabase = async () => {
    const maxAttempts = 20;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            const dbConnection = await connection.getConnection();
            dbConnection.release();
            console.log("Connected to MySQL successfully!");
            return;
        } catch (err) {
            console.error(`MySQL connection attempt ${attempt}/${maxAttempts} failed:`, err.message);
            if (attempt === maxAttempts) {
                throw err;
            }
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
};

waitForDatabase().catch((err) => {
    console.error("MySQL connection failed after retries:", err.message);
});

module.exports = connection;