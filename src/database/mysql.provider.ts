// src/database/mysql.provider.ts
import serverlessMysql from 'serverless-mysql';

// koneksi ke database utama
export const defaultDB = serverlessMysql({
  config: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT) || 3306,
  },
});

// koneksi ke database backup
export const backupDB = serverlessMysql({
  config: {
    host: process.env.BACKUP_DATABASE_HOST,
    user: process.env.BACKUP_DATABASE_USERNAME,
    password: process.env.BACKUP_DATABASE_PASSWORD,
    database: process.env.BACKUP_DATABASE_NAME,
    port: Number(process.env.BACKUP_DATABASE_PORT) || 3306,
  },
});

// helper untuk query db utama
export async function queryDefault<T = any>(sql: string, values: any[] = []) {
  try {
    const results = await defaultDB.query<T>(sql, values);
    return results;
  } finally {
    await defaultDB.end();
  }
}

// helper untuk query db backup
export async function queryBackup<T = any>(sql: string, values: any[] = []) {
  try {
    const results = await backupDB.query<T>(sql, values);
    return results;
  } finally {
    await backupDB.end();
  }
}
