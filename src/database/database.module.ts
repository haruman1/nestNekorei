// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { defaultDB, backupDB } from './mysql.provider';

@Module({
  providers: [
    {
      provide: 'DEFAULT_DB',
      useValue: defaultDB, // injeksi defaultDB
    },
    {
      provide: 'BACKUP_DB',
      useValue: backupDB, // injeksi backupDB
    },
  ],
  exports: ['DEFAULT_DB', 'BACKUP_DB'], // penting supaya bisa dipakai module lain
})
export class DatabaseModule {}
