import serverlessMysql from 'serverless-mysql';
export declare const defaultDB: serverlessMysql.ServerlessMysql;
export declare const backupDB: serverlessMysql.ServerlessMysql;
export declare function queryDefault<T = any>(sql: string, values?: any[]): Promise<T>;
export declare function queryBackup<T = any>(sql: string, values?: any[]): Promise<T>;
