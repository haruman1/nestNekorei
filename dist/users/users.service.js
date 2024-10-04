"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const CryptoJS = require("crypto-js");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    generateRandomCode() {
        const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
        const randomCode = `NK${randomNumber}`;
        return randomCode;
    }
    async create(createUserDto) {
        const { email, userId, name, password, role } = createUserDto;
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
            return this.usersRepository.save(user);
        }
        catch (err) {
            throw new common_1.BadRequestException('Error creating user: ' + err.message);
        }
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