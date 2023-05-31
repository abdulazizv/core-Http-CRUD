const fs = require('fs');
const path = require('path');
const pool = require('../database/connect');

async function runMigrations() {
    try {
        //
        const migrationDir = path.resolve(__dirname,'../','../', 'migrations');
        const migrationFiles = fs.readdirSync(migrationDir);

        for (const migrationFile of migrationFiles) {
            const filePath = path.join(migrationDir, migrationFile);
            const sqlQuery = fs.readFileSync(filePath, 'utf8');

            await new Promise((resolve, reject) => {
                pool.query(sqlQuery, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });

            console.log(`Migration successful: ${migrationFile}`);
        }

        console.log('All migrations completed.');
    } catch (error) {
        console.error('Migration failed.');
        console.error(error);
    }
}

runMigrations();
