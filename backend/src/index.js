import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import pool, { envDetection } from './db.js';

const __filename = fileURLToPath(import.meta.url);

// Import environment detection from db.js to ensure consistency
const envMode = envDetection.type;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Test kết nối database
app.get('/api/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        res.json({ 
            message: 'Database connected successfully!',
            time: result.rows[0].current_time 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Database connection failed',
            details: error.message 
        });
    }
});

// Khởi động server
(async function startServer() {
        try {
        // Test kết nối ban đầu
        const res = await pool.query('SELECT NOW()');
        console.log(`[${path.basename(__filename)}]: Database connected! Time:`, res.rows[0].now);
        
        // Khởi động HTTP server
        app.listen(PORT, () => {
            console.log('================================================');
            console.log(`Backend API: http://localhost:${PORT}`);
            console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
            console.log(`PgAdmin Web UI: http://localhost:8080`);
            console.log(`Database: PostgreSQL running on localhost:5432`);
            console.log(`Environment: ${envMode} mode`);
            console.log('================================================');
        });
        
    } catch (error) {
        console.error('Server start failed:', error);
    }
})();