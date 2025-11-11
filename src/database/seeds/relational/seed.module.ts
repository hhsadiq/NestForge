import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import appConfig from '@src/config/app.config';
import databaseConfig from '@src/database/config/database.config';
import { TypeOrmConfigService } from '@src/database/typeorm-config.service';

import { ActionSeedModule } from './action/action-seed.module';
import { PermissionSeedModule } from './permission/permission-seed.module';
import { RoleSeedModule } from './role/role-seed.module';
import { RolePermissionSeedModule } from './role-permission/role-permission-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { SubjectSeedModule } from './subject/subject-seed.module';
import { UserSeedModule } from './user/user-seed.module';

@Module({
  imports: [
    StatusSeedModule,
    RoleSeedModule,
    ActionSeedModule,
    SubjectSeedModule,
    PermissionSeedModule,
    RolePermissionSeedModule,
    UserSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
