import { PermissionService } from './index.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './index.controller';
import { PermissionRepository } from './index.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionRepository])
  ],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
