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
        host: '8pwsg0.h.filess.io',
        user: 'Utama_promisedat',
        password: '0c5b6938573de6c660ff96edd1433f071704023b',
        database: 'Utama_promisedat',
        port: parseInt('61002'),
    },
});
exports.backupDB = (0, serverless_mysql_1.default)({
    config: {
        host: '38bv0z.h.filess.io',
        user: 'backup_lookfound',
        password: 'b657728869218a17e63b2bbf8641cf6068fc4b13',
        database: 'backup_lookfound',
        port: parseInt('61002'),
    },
});
async function queryDefault(sql, values = []) {
    try {
        const results = await exports.defaultDB.query(sql, values);
        return results;
    }
    finally {
        exports.defaultDB.quit();
    }
}
async function queryBackup(sql, values = []) {
    try {
        const results = await exports.backupDB.query(sql, values);
        return results;
    }
    finally {
        exports.backupDB.quit();
    }
}
//# sourceMappingURL=mysql.provider.js.map