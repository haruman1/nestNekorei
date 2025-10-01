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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const CryptoJS = __importStar(require("crypto-js"));
const bcrypt = __importStar(require("bcryptjs"));
const signed_uploads_1 = require("@uploadcare/signed-uploads");
const imagekit_1 = __importDefault(require("imagekit"));
const mysql_provider_1 = require("../database/mysql.provider");
let UsersService = class UsersService {
    constructor() {
        this.imagekit = new imagekit_1.default({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        });
    }
    generateRandomCode() {
        const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
        return `NK${randomNumber}`;
    }
    async create(createUserDto) {
        try {
            const { v4: uuidv4 } = await Promise.resolve().then(() => __importStar(require('uuid')));
            const userId = uuidv4();
            await (0, mysql_provider_1.queryDefault)('INSERT INTO user (userId, email, password, name, role) VALUES (?, ?, ?, ?, ?)', [
                userId,
                createUserDto.email,
                createUserDto.password,
                createUserDto.name,
                createUserDto.role,
            ]);
            await (0, mysql_provider_1.queryBackup)('INSERT INTO user_history (pesan, userId, createdAt) VALUES (?, ?, ?)', [
                `User created with ID: ${userId} and Name: ${createUserDto.name}`,
                userId,
                new Date(),
            ]);
            return await this.findOneByIdUser(userId);
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_1.ConflictException('User ID or Email already exists');
            }
            throw error;
        }
    }
    async update(userId, updateUserDto) {
        const [user] = await (0, mysql_provider_1.queryDefault)('SELECT * FROM user WHERE userId = ?', [userId]);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        let newPassword = user.password;
        if (updateUserDto.password &&
            !(await bcrypt.compare(updateUserDto.password, user.password))) {
            newPassword = await bcrypt.hash(updateUserDto.password, 16);
        }
        await (0, mysql_provider_1.queryDefault)('UPDATE user SET password = ?, profile = ?, name = ? WHERE userId = ?', [
            newPassword,
            updateUserDto.profile || user.profile,
            updateUserDto.name || user.name,
            userId,
        ]);
        return { status: 200, message: `User Updated ${userId} Successfully` };
    }
    async remove(id_user) {
        await this.findOneByIdUser(id_user);
        await (0, mysql_provider_1.queryDefault)('DELETE FROM user WHERE userId = ?', [id_user]);
        await (0, mysql_provider_1.queryDefault)('DELETE FROM user_history WHERE userId = ?', [id_user]);
        return { status: 200, message: `User Deleted ${id_user} Successfully` };
    }
    async ImageKitAuth() {
        return this.imagekit.getAuthenticationParameters();
    }
    async UploadcareSignatureCreate() {
        const { secureSignature, secureExpire } = (0, signed_uploads_1.generateSecureSignature)(process.env.UPLOADCARE_SECRET_KEYS, { expire: new Date('2025-01-01') });
        return { secureSignature, secureExpire };
    }
    async foto(userId) {
        const [user] = await (0, mysql_provider_1.queryDefault)('SELECT profile FROM user WHERE userId = ?', [userId]);
        if (!user) {
            throw new common_1.NotFoundException('Sedang error, silahkan coba lagi');
        }
        return { status: 200, message: user.profile };
    }
    async findOneByEmail(email) {
        if (!email) {
            throw new common_1.BadRequestException('Email must be provided');
        }
        const [user] = await (0, mysql_provider_1.queryDefault)('SELECT * FROM user WHERE email = ?', [email]);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            status: 200,
            data: 'User found',
            dataUser: {
                id: user.userId,
                email: user.email,
                name: user.name,
                password: user.password,
            },
        };
    }
    async findOneById(id) {
        const [user] = await (0, mysql_provider_1.queryDefault)('SELECT * FROM user WHERE id = ?', [
            id,
        ]);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findOneByIdUser(id) {
        const [user] = await (0, mysql_provider_1.queryDefault)('SELECT * FROM user WHERE userId = ?', [id]);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async forgotPassword(email) {
        const user = await this.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            message: 'If that email is registered, you will receive a reset link',
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UsersService);
//# sourceMappingURL=users.service.js.map