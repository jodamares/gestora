import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../typeOrm/company.entity';
import { CompanyFileEntity } from '../typeOrm/company-file.entity';
import { CompanyFolderEntity } from '../typeOrm/company-folder.entity';

@Injectable()
export class CompanyDirectoryService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(CompanyFolderEntity)
    private readonly folderRepository: Repository<CompanyFolderEntity>,
    @InjectRepository(CompanyFileEntity)
    private readonly fileRepository: Repository<CompanyFileEntity>,
  ) {}

  async companyExistsForUser(companyId: number, userId: number): Promise<boolean> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId, user: { id: userId } },
    });
    return Boolean(company);
  }

  async createFolder(input: { companyId: number; name: string; parentFolderId?: number | null }) {
    const entity = this.folderRepository.create({
      companyId: input.companyId,
      name: input.name.trim(),
      parentFolderId: input.parentFolderId ?? null,
    });
    return this.folderRepository.save(entity);
  }

  async getFolders(companyId: number) {
    return this.folderRepository.find({
      where: { companyId },
      order: { createdAt: 'ASC' },
    });
  }

  async saveFile(input: {
    companyId: number;
    folderId?: number | null;
    originalName: string;
    content: Buffer;
    size: number;
    mimeType: string;
  }) {
    const entity = this.fileRepository.create({
      companyId: input.companyId,
      folderId: input.folderId ?? null,
      originalName: input.originalName,
      content: input.content,
      size: String(input.size),
      mimeType: input.mimeType,
    });
    return this.fileRepository.save(entity);
  }

  async getFiles(companyId: number, folderId: number) {
    return this.fileRepository.find({
      where: { companyId, folderId },
      order: { createdAt: 'DESC' },
    });
  }

  async getFileForDownload(companyId: number, fileId: number) {
    return this.fileRepository.findOne({
      where: { id: fileId, companyId },
      select: ['id', 'companyId', 'folderId', 'originalName', 'mimeType', 'size', 'content', 'createdAt'],
    });
  }

  async folderBelongsToCompany(folderId: number, companyId: number): Promise<boolean> {
    const folder = await this.folderRepository.findOne({ where: { id: folderId, companyId } });
    return Boolean(folder);
  }
}
