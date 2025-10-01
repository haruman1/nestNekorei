import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { backupDB, defaultDB } from './database/mysql.provider';

@Injectable()
@Injectable()
export class AppService implements OnModuleDestroy {
  async onModuleDestroy() {
    await defaultDB.end();
    await backupDB.end();
  }
}
