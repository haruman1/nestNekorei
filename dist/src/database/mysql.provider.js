"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupDB = exports.defaultDB = void 0;
exports.queryDefault = queryDefault;
exports.queryBackup = queryBackup;
const serverless_mysql_1 = __importDefault(require("serverless-mysql"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
exports.defaultDB = (0, serverless_mysql_1.default)({
    config: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: parseInt(process.env.DATABASE_PORT),
        connectionLimit: isVercel ? 1 : 5,
    },
});
exports.backupDB = (0, serverless_mysql_1.default)({
    config: {
        host: process.env.BACKUP_DATABASE_HOST,
        user: process.env.BACKUP_DATABASE_USERNAME,
        password: process.env.BACKUP_DATABASE_PASSWORD,
        database: process.env.BACKUP_DATABASE_NAME,
        port: parseInt(process.env.BACKUP_DATABASE_PORT),
        connectionLimit: isVercel ? 1 : 5,
    },
});
async function queryDefault(sql, values = []) {
    try {
        const results = await exports.defaultDB.query(sql, values);
        return results;
    }
    finally {
        if (isVercel) {
            await exports.defaultDB.end();
        }
    }
}
async function queryBackup(sql, values = []) {
    try {
        const results = await exports.backupDB.query(sql, values);
        return results;
    }
    finally {
        if (isVercel) {
            await exports.backupDB.end();
        }
    }
}
//# sourceMappingURL=mysql.provider.js.map