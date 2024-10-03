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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./jwt/jwt.strategy");
let AuthService = class AuthService {
    constructor(usersService, jwtService, jwtStrategy) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.jwtStrategy = jwtStrategy;
    }
    async validateUser(email, pass) {
        console.log('Validating user:', email, pass);
        const payload = { email, pass };
        const user = await this.jwtStrategy.validate(payload);
        if (!user) {
            console.log('User not found');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (isPasswordValid) {
            const { password, ...result } = user;
            return result;
        }
        console.log('Invalid password');
        throw new common_1.UnauthorizedException('Invalid credentials');
    }
    async login(email, password) {
        if (!email || !password) {
            throw new common_1.BadRequestException('Email and password must be provided');
        }
        const user = await this.validateUser(email, password);
        console.log('user', user);
        if (!user) {
            throw new common_1.BadRequestException('Invalid email or password 1');
        }
        const payload = { userId: user.userId, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        jwt_strategy_1.JwtStrategy])
], AuthService);
//# sourceMappingURL=auth.service.js.map