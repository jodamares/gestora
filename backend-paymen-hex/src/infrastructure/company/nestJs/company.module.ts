import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyCreate } from 'src/application/company/companyCreate';
import { CompanyGetAll } from 'src/application/company/companyGetAll';
import { CompanyGetById } from 'src/application/company/companyGetById';
import { CompanyController } from './company.controller';
import { CompanyEntity } from '../typeOrm/company.entity';
import { CompanyTypeOrmRepository } from '../typeOrm/company.repository';
import { COMPANY_REPOSITORY, CREATE_COMPANY, GET_ALL_COMPANIES, GET_COMPANY_BY_ID } from './tokens';
import { CompanyFolderEntity } from '../typeOrm/company-folder.entity';
import { CompanyFileEntity } from '../typeOrm/company-file.entity';
import { CompanyDirectoryService } from './company-directory.service';
import { AuthModule } from 'src/infrastructure/auth/nestJs/auth.module';
import { UserEntity } from 'src/infrastructure/auth/typeOrm/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity, CompanyFolderEntity, CompanyFileEntity, UserEntity]),
    AuthModule,
  ],
  controllers: [CompanyController],
  providers: [
    {
      provide: COMPANY_REPOSITORY,
      useClass: CompanyTypeOrmRepository,
    },
    {
      provide: CREATE_COMPANY,
      useFactory: (repository: CompanyTypeOrmRepository) => new CompanyCreate(repository),
      inject: [COMPANY_REPOSITORY],
    },
    {
      provide: GET_ALL_COMPANIES,
      useFactory: (repository: CompanyTypeOrmRepository) => new CompanyGetAll(repository),
      inject: [COMPANY_REPOSITORY],
    },
    {
      provide: GET_COMPANY_BY_ID,
      useFactory: (repository: CompanyTypeOrmRepository) => new CompanyGetById(repository),
      inject: [COMPANY_REPOSITORY],
    },
    CompanyDirectoryService,
  ],
})
export class CompanyModule {}
