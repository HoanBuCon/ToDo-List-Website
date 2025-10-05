import pg from 'pg';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);

const envDetection = (() => {
    const localEnvPath = path.join(process.cwd(), '.env.local');
    const backendEnvPath = path.join(process.cwd(), '.env');
    const productionEnvPath = path.join(process.cwd(), '.env.production');
    
    // Kiểm tra biến môi trường để ép chế độ
    const forceMode = process.env.TODO_ENV_MODE || process.env.NODE_ENV;
    
    if (forceMode === 'production') {
        // Production mode
        if (existsSync(productionEnvPath)) {
            dotenv.config({ path: productionEnvPath });
            return { type: 'Production', source: '.env.production (forced)' };
        }
    } else if (forceMode === 'docker') {
        // Force Docker mode
        if (existsSync(backendEnvPath)) {
            dotenv.config({ path: backendEnvPath });
            return { type: 'Docker', source: '.env (forced)' };
        }
    } else if (forceMode === 'local') {
        // Force Local mode
        if (existsSync(localEnvPath)) {
            dotenv.config({ path: localEnvPath });
            return { type: 'Local', source: '.env.local (forced)' };
        }
    }
    
    // Tự động phát hiện chế độ
    // Ưu tiên: .env.production > .env.local > .env > hệ thống
    if (process.env.NODE_ENV === 'production' && existsSync(productionEnvPath)) {
        dotenv.config({ path: productionEnvPath });
        return { type: 'Production', source: '.env.production (auto)' };
    } else if (existsSync(localEnvPath)) {
        dotenv.config({ path: localEnvPath });
        return { type: 'Local', source: '.env.local (auto)' };
    } else if (existsSync(backendEnvPath)) {
        dotenv.config({ path: backendEnvPath });
        return { type: 'Docker', source: '.env (auto)' };
    } else {
        dotenv.config();
        return { type: 'System', source: 'system env (fallback)' };
    }
})();

const isBackendInContainer = process.env.DOCKER_CONTAINER === 'true';

// Backend chạy ngoài container -> luôn dùng localhost
// Backend chạy trong container -> dùng 'db' (container name)
const dbHost = isBackendInContainer ? 'db' : 'localhost';

console.log('================================================');
console.log(`[${path.basename(__filename)}]: Database connection: ${dbHost}:${process.env.DB_PORT} (${envDetection.type} mode)`);
console.log(`[${path.basename(__filename)}]: Config source: ${envDetection.source}`);

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: dbHost,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

export default pool;
export { envDetection };