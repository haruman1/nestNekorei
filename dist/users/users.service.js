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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const CryptoJS = __importStar(require("crypto-js"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = __importStar(require("bcryptjs"));
const imagekit_1 = __importDefault(require("imagekit"));
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        const imageKit = new imagekit_1.default({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        });
        this.imagekit = imageKit;
    }
    generateRandomCode() {
        const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
        const randomCode = `NK${randomNumber}`;
        return randomCode;
    }
    async create(createUserDto) {
        const { email, name, password, role } = createUserDto;
        console.log('Data yang diterima:', createUserDto);
        if (!email || !password || !role) {
            throw new common_1.BadRequestException('Maaf, data ada yang kosong. Silahkan lengkapi kembali.');
        }
        const existingUserByEmail = await this.usersRepository.findOne({
            where: { email },
        });
        if (existingUserByEmail) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const saltRounds = 10;
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const UserID = this.generateRandomCode();
            const user = this.usersRepository.create({
                userId: UserID,
                email,
                name,
                password: hashedPassword,
                role,
            });
            await this.usersRepository.save(user);
            const response = {
                status: 200,
                data: 'User created successfully',
                dataUser: {
                    id: user.userId,
                    email: user.email,
                    name: user.name,
                },
            };
            return response;
        }
        catch (err) {
            throw new common_1.BadRequestException('Error creating user: ' + err.message);
        }
    }
    async ImageKitAuth() {
        return this.imagekit.getAuthenticationParameters();
    }
    async konyol(userId) {
        const user = await this.usersRepository.findOne({
            where: { userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            message: 'yah, konyol',
        };
    }
    async findOneByEmail(email) {
        if (!email) {
            throw new common_1.BadRequestException('Email must be provided222');
        }
        const user = await this.usersRepository.findOne({
            where: { email },
        });
        if (!user) {
            console.log('User tidak ditemukan');
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async update(userId, updateUserDto) {
        const { password, profile } = updateUserDto;
        const hashedPassword = password
            ? await bcrypt.hash(password, 10)
            : undefined;
        await this.usersRepository.update(userId, {
            ...(password && { password: hashedPassword }),
            ...(profile && { profile }),
        });
    }
    async findOneById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findOneByIdUser(id) {
        const user = await this.usersRepository.findOne({
            where: { userId: id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async remove(id) {
        await this.usersRepository.delete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map