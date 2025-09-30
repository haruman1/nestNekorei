"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupDB = exports.defaultDB = void 0;
exports.queryDefault = queryDefault;
exports.queryBackup = queryBackup;
const serverless_mysql_1 = __importDefault(require("serverless-mysql"));
exports.defaultDB = (0, serverless_mysql_1.default)({
    config: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: Number(process.env.DATABASE_PORT) || 3306,
    },
});
exports.backupDB = (0, serverless_mysql_1.default)({
    config: {
        host: process.env.BACKUP_DATABASE_HOST,
        user: process.env.BACKUP_DATABASE_USERNAME,
        password: process.env.BACKUP_DATABASE_PASSWORD,
        database: process.env.BACKUP_DATABASE_NAME,
        port: Number(process.env.BACKUP_DATABASE_PORT) || 3306,
    },
});
async function queryDefault(sql, values = []) {
    try {
        const results = await exports.defaultDB.query(sql, values);
        return results;
    }
    finally {
        await exports.defaultDB.end();
    }
}
async function queryBackup(sql, values = []) {
    try {
        const results = await exports.backupDB.query(sql, values);
        return results;
    }
    finally {
        await exports.backupDB.end();
    }
}
//# sourceMappingURL=mysql.provider.js.map