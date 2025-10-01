// src/database/mysql.provider.ts
import serverlessMysql from 'serverless-mysql';

// koneksi ke database utama
export const defaultDB = serverlessMysql({
  config: {
    host: '8pwsg0.h.filess.io',
    user: 'Utama_promisedat',
    password: '0c5b6938573de6c660ff96edd1433f071704023b',
    database: 'Utama_promisedat',
    port: parseInt('61002'),
  },
});

// koneksi ke database backup
export const backupDB = serverlessMysql({
  config: {
    host: '38bv0z.h.filess.io',
    user: 'backup_lookfound',
    password: 'b657728869218a17e63b2bbf8641cf6068fc4b13',
    database: 'backup_lookfound',
    port: parseInt('61002'),
  },
});
// export database nya

// helper untuk query db utama
export async function queryDefault<T = any>(sql: string, values: any[] = []) {
  try {
    const results = await defaultDB.query<T>(sql, values);
    return results;
  } finally {
    defaultDB.quit();
  }
}

// helper untuk query db backup
export async function queryBackup<T = any>(sql: string, values: any[] = []) {
  try {
    const results = await backupDB.query<T>(sql, values);
    return results;
  } finally {
    backupDB.quit();
  }
}
