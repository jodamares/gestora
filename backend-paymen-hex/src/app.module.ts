import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CompanyEntity } from './infrastructure/company/typeOrm/company.entity';
import { CompanyModule } from './infrastructure/company/nestJs/company.module';
import { CompanyFolderEntity } from './infrastructure/company/typeOrm/company-folder.entity';
import { CompanyFileEntity } from './infrastructure/company/typeOrm/company-file.entity';
import { UserEntity } from './infrastructure/auth/typeOrm/user.entity';
import { AuthModule } from './infrastructure/auth/nestJs/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [
        CompanyEntity,
        CompanyFolderEntity,
        CompanyFileEntity,
        UserEntity,
      ],
      synchronize: true,
    }),
    AuthModule,
    CompanyModule,
  ],
})
export class AppModule {}
