// src/database/mysql.provider.ts
import serverlessMysql from 'serverless-mysql';
import * as dotenv from 'dotenv';

dotenv.config();

// flag untuk cek environment
const isVercel =
  process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

// koneksi ke database utama
export const defaultDB = serverlessMysql({
  config: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT),
    connectionLimit: isVercel ? 1 : 5, // pool kecil kalau bukan vercel
  },
});

// koneksi ke database backup
export const backupDB = serverlessMysql({
  config: {
    host: process.env.BACKUP_DATABASE_HOST,
    user: process.env.BACKUP_DATABASE_USERNAME,
    password: process.env.BACKUP_DATABASE_PASSWORD,
    database: process.env.BACKUP_DATABASE_NAME,
    port: parseInt(process.env.BACKUP_DATABASE_PORT),
    connectionLimit: isVercel ? 1 : 5,
  },
});

// helper untuk query db utama
export async function queryDefault<T = any>(sql: string, values: any[] = []) {
  try {
    const results = await defaultDB.query<T>(sql, values);
    return results;
  } finally {
    if (isVercel) {
      await defaultDB.end(); // close tiap query kalau di Vercel
    }
  }
}

// helper untuk query db backup
export async function queryBackup<T = any>(sql: string, values: any[] = []) {
  try {
    const results = await backupDB.query<T>(sql, values);
    return results;
  } finally {
    if (isVercel) {
      await backupDB.end(); // close tiap query kalau di Vercel
    }
  }
}
