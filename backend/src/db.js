import pg from 'pg';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);

// Tự động detect và load file env local hoặc docker
const envType = (() => {
    const rootDir = path.resolve(process.cwd(), '..');
    const localEnvPath = path.join(rootDir, '.env.local');
    const backendEnvPath = path.join(process.cwd(), '.env');
    
    // Ưu tiên .env.local (cho development)
    if (existsSync(localEnvPath)) {
        dotenv.config({ path: localEnvPath });
        return 'Local';
    }
    // Fallback về .env trong backend (cho production/docker)
    else if (existsSync(backendEnvPath)) {
        dotenv.config({ path: backendEnvPath });
        return 'Backend';
    }
    else {
        dotenv.config();
        return 'System';
    }
})();

// Tự động phát hiện môi trường và cấu hình host phù hợp
const isInsideContainer = process.env.DOCKER_CONTAINER === 'true';
const isLocalDev = envType === 'local' || process.env.DB_HOST === 'localhost';
const dbHost = isInsideContainer ? 'db' : (isLocalDev ? 'localhost' : (process.env.DB_HOST || 'localhost'));

console.log(`[${path.basename(__filename)}]: Database connection: ${dbHost}:${process.env.DB_PORT} (${envType} mode)`);

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: dbHost,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

export default pool;