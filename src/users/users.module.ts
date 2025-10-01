import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [forwardRef(() => AuthModule), DatabaseModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
