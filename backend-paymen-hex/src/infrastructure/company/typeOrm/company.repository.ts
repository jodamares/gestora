import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/domain/company';
import { CompanyCreateInput, CompanyRepository } from 'src/domain/company.repository';
import { Repository } from 'typeorm';
import { CompanyEntity } from './company.entity';

@Injectable()
export class CompanyTypeOrmRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyEntityRepository: Repository<CompanyEntity>,
  ) {}

  async create(input: CompanyCreateInput): Promise<Company> {
    const { userId, ...fields } = input;
    const entity = this.companyEntityRepository.create({
      ...fields,
      user: { id: userId },
    });
    const saved = await this.companyEntityRepository.save(entity);
    const reloaded = await this.companyEntityRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
    return mapEntity(reloaded!);
  }

  async getAllByUserId(userId: number): Promise<Company[]> {
    const entities = await this.companyEntityRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
    return entities.map(mapEntity);
  }

  async getByIdForUser(id: number, userId: number): Promise<Company | null> {
    const entity = await this.companyEntityRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    return entity ? mapEntity(entity) : null;
  }

  async getById(id: number): Promise<Company | null> {
    const entity = await this.companyEntityRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return entity ? mapEntity(entity) : null;
  }

  async getDocumentForDownload(id: number): Promise<{ originalName: string; buffer: Buffer } | null> {
    const entity = await this.companyEntityRepository.findOne({
      where: { id },
      select: ['id', 'documentOriginalName', 'documentContent'],
    });
    if (!entity?.documentContent?.length) {
      return null;
    }
    return { originalName: entity.documentOriginalName, buffer: entity.documentContent };
  }
}

function mapEntity(entity: CompanyEntity): Company {
  return {
    id: entity.id,
    userId: entity.user?.id ?? entity.userId,
    name: entity.name,
    nit: entity.nit,
    city: entity.city,
    department: entity.department,
    phoneNumber: entity.phoneNumber,
    email: entity.email,
    description: entity.description,
    documentOriginalName: entity.documentOriginalName,
    createdAt: entity.createdAt,
  };
}
