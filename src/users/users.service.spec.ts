// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import {
//   BadRequestException,
//   ConflictException,
//   NotFoundException,
// } from '@nestjs/common';
// import * as bcrypt from 'bcryptjs';

// // Mock untuk serverless-mysql
// const mockDefaultDb = {
//   query: jest.fn(),
// };
// const mockBackupDb = {
//   query: jest.fn(),
// };

// // Mock queryDefault (import langsung dari provider)
// jest.mock('src/database/mysql.provider', () => ({
//   queryDefault: jest.fn(),
// }));

// import { queryDefault } from 'src/database/mysql.provider';

// describe('UsersService', () => {
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         { provide: 'DEFAULT_DB', useValue: mockDefaultDb },
//         { provide: 'BACKUP_DB', useValue: mockBackupDb },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   // ======================
//   // CREATE USER
//   // ======================
//   describe('create', () => {
//     it('should create user and insert history', async () => {
//       mockDefaultDb.query.mockResolvedValueOnce({ insertId: 1 });
//       mockBackupDb.query.mockResolvedValueOnce({ insertId: 1 });
//       jest.spyOn(service, 'findOneByIdUser').mockResolvedValueOnce({
//         userId: 'A512',
//         email: 'john.doe@example.com',
//         name: 'John Doe',
//       } as any);

//       const dto = {
//         userId: 'A512',
//         email: 'john.doe@example.com',
//         password: 'securepassword123',
//         name: 'John Doe',
//         role: 'customer',
//       };

//       const result = await service.create(dto);

//       expect(mockDefaultDb.query).toHaveBeenCalledWith(
//         'INSERT INTO user (userId, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
//         [dto.userId, dto.email, dto.password, dto.name, dto.role],
//       );
//       expect(mockBackupDb.query).toHaveBeenCalled();
//       expect(result).toEqual({
//         userId: 'A512',
//         email: 'john.doe@example.com',
//         name: 'John Doe',
//       });
//     });

//     it('should throw ConflictException if duplicate entry', async () => {
//       const error: any = new Error();
//       error.code = 'ER_DUP_ENTRY';
//       mockDefaultDb.query.mockRejectedValueOnce(error);

//       await expect(
//         service.create({
//           userId: 'A512',
//           email: 'dup@example.com',
//           password: '123456',
//           name: 'Dup User',
//           role: 'customer',
//         }),
//       ).rejects.toThrow(ConflictException);
//     });
//   });

//   // ======================
//   // UPDATE USER
//   // ======================
//   describe('update', () => {
//     it('should update user successfully', async () => {
//       const mockUser = {
//         userId: 'A512',
//         password: 'oldpass',
//         profile: '',
//         name: 'Old',
//       };
//       (queryDefault as jest.Mock).mockResolvedValueOnce([mockUser]); // SELECT
//       (queryDefault as jest.Mock).mockResolvedValueOnce({}); // UPDATE

//       jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as any);
//       jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedpass' as any);

//       const result = await service.update('A512', {
//         userId: 'A512',
//         password: 'newpass',
//         profile: 'pic.jpg',
//         name: 'New',
//       });

//       expect(result).toEqual({
//         status: 200,
//         message: 'User Updated A512 Successfully',
//       });
//     });

//     it('should throw if user not found', async () => {
//       (queryDefault as jest.Mock).mockResolvedValueOnce([undefined]);

//       await expect(
//         service.update('missing', { password: 'new' }),
//       ).rejects.toThrow(NotFoundException);
//     });
//   });

//   // ======================
//   // REMOVE USER
//   // ======================
//   describe('remove', () => {
//     it('should delete user and history', async () => {
//       (queryDefault as jest.Mock).mockResolvedValueOnce([{ userId: 'A512' }]); // findOne
//       (queryDefault as jest.Mock).mockResolvedValue({}); // deletes

//       const result = await service.remove('A512');

//       expect(result).toEqual({
//         status: 200,
//         message: 'User Deleted A512 Successfully',
//       });
//     });
//   });

//   // ======================
//   // FIND ONE BY EMAIL
//   // ======================
//   describe('findOneByEmail', () => {
//     it('should throw if email is empty', async () => {
//       await expect(service.findOneByEmail('')).rejects.toThrow(
//         BadRequestException,
//       );
//     });

//     it('should return user if found', async () => {
//       const mockUser = {
//         userId: 'A512',
//         email: 'found@example.com',
//         name: 'Found User',
//         password: 'pass',
//       };
//       (queryDefault as jest.Mock).mockResolvedValueOnce([mockUser]);

//       const result = await service.findOneByEmail('found@example.com');

//       expect(result).toEqual({
//         status: 200,
//         data: 'User found',
//         dataUser: {
//           id: 'A512',
//           email: 'found@example.com',
//           name: 'Found User',
//           password: 'pass',
//         },
//       });
//     });

//     it('should throw NotFoundException if user not found', async () => {
//       (queryDefault as jest.Mock).mockResolvedValueOnce([undefined]);

//       await expect(
//         service.findOneByEmail('missing@example.com'),
//       ).rejects.toThrow(NotFoundException);
//     });
//   });

//   // ======================
//   // FIND ONE BY ID
//   // ======================
//   describe('findOneById', () => {
//     it('should return user by id', async () => {
//       const mockUser = { id: 1, userId: 'A512' };
//       (queryDefault as jest.Mock).mockResolvedValueOnce([mockUser]);

//       const result = await service.findOneById(1);
//       expect(result).toEqual(mockUser);
//     });

//     it('should throw if not found', async () => {
//       (queryDefault as jest.Mock).mockResolvedValueOnce([undefined]);

//       await expect(service.findOneById(99)).rejects.toThrow(NotFoundException);
//     });
//   });

//   // ======================
//   // FIND ONE BY ID USER
//   // ======================
//   describe('findOneByIdUser', () => {
//     it('should return user by userId', async () => {
//       const mockUser = { userId: 'A512', email: 'test@example.com' };
//       (queryDefault as jest.Mock).mockResolvedValueOnce([mockUser]);

//       const result = await service.findOneByIdUser('A512');
//       expect(result).toEqual(mockUser);
//     });
//   });

//   // ======================
//   // FOTO
//   // ======================
//   describe('foto', () => {
//     it('should return profile photo', async () => {
//       mockDefaultDb.query.mockResolvedValueOnce([{ profile: 'pic.jpg' }]);

//       const result = await service.foto('A512');
//       expect(result).toEqual({ status: 200, message: 'pic.jpg' });
//     });

//     it('should throw if user not found', async () => {
//       mockDefaultDb.query.mockResolvedValueOnce([undefined]);

//       await expect(service.foto('missing')).rejects.toThrow(NotFoundException);
//     });
//   });

//   // ======================
//   // FORGOT PASSWORD
//   // ======================
//   describe('forgotPassword', () => {
//     it('should return message if user exists', async () => {
//       jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce({
//         userId: 'A512',
//         email: 'reset@example.com',
//       } as any);

//       const result = await service.forgotPassword('reset@example.com');
//       expect(result).toEqual({
//         message: 'If that email is registered, you will receive a reset link',
//       });
//     });

//     it('should throw if user not found', async () => {
//       jest
//         .spyOn(service, 'findOneByEmail')
//         .mockRejectedValueOnce(new NotFoundException());

//       await expect(
//         service.forgotPassword('missing@example.com'),
//       ).rejects.toThrow(NotFoundException);
//     });
//   });
// });
