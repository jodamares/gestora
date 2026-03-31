import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { CompanyCreate } from 'src/application/company/companyCreate';
import { CompanyGetAll } from 'src/application/company/companyGetAll';
import { CompanyGetById } from 'src/application/company/companyGetById';
import { Company } from 'src/domain/company';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { CompanyDto } from './company.dto';
import { CREATE_COMPANY, GET_ALL_COMPANIES, GET_COMPANY_BY_ID } from './tokens';
import { CompanyDirectoryService } from './company-directory.service';
import { JwtAuthGuard } from 'src/infrastructure/auth/nestJs/jwt-auth.guard';
import { CurrentUserId } from 'src/infrastructure/auth/nestJs/current-user-id.decorator';

const COMPANY_DOCUMENTS_DIR = join(process.cwd(), 'uploads', 'companies');

@Controller('companies')
export class CompanyController {
  constructor(
    @Inject(CREATE_COMPANY) private readonly createCompany: CompanyCreate,
    @Inject(GET_ALL_COMPANIES) private readonly getAllCompanies: CompanyGetAll,
    @Inject(GET_COMPANY_BY_ID) private readonly getCompanyById: CompanyGetById,
    private readonly companyDirectoryService: CompanyDirectoryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          if (!existsSync(COMPANY_DOCUMENTS_DIR)) {
            mkdirSync(COMPANY_DOCUMENTS_DIR, { recursive: true });
          }
          callback(null, COMPANY_DOCUMENTS_DIR);
        },
        filename: (_req, file, callback) => {
          const safeExt = extname(file.originalname) || '.docx';
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, callback) => {
        const allowed = ['.doc', '.docx'];
        const extension = extname(file.originalname).toLowerCase();
        if (!allowed.includes(extension)) {
          return callback(new BadRequestException('Solo se permiten archivos Word (.doc, .docx)'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async create(
    @CurrentUserId() userId: number,
    @UploadedFile() file: { originalname: string; filename: string },
    @Body() body: CreateCompanyBody,
  ): Promise<CompanyDto> {
    if (!file) {
      throw new BadRequestException('El documento de la empresa es obligatorio');
    }

    validateCreateBody(body);
    const company = await this.createCompany.run({
      userId,
      name: body.name.trim(),
      nit: body.nit.trim(),
      city: body.city.trim(),
      department: body.department.trim(),
      phoneNumber: body.phoneNumber.trim(),
      email: body.email.trim().toLowerCase(),
      description: body.description.trim(),
      documentOriginalName: file.originalname,
      documentStoredName: file.filename,
    });

    return mapToDto(company);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@CurrentUserId() userId: number): Promise<CompanyDto[]> {
    const companies = await this.getAllCompanies.run(userId);
    return companies.map(mapToDto);
  }

  @Get(':id/document')
  async downloadDocument(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): Promise<void> {
    const company = await this.getCompanyById.runPublic(id);
    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const filePath = join(COMPANY_DOCUMENTS_DIR, company.documentStoredName);
    response.download(filePath, company.documentOriginalName);
  }

  @Post(':id/folders')
  @UseGuards(JwtAuthGuard)
  async createFolder(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) companyId: number,
    @Body() body: CreateFolderBody,
  ) {
    if (!body.name?.trim()) {
      throw new BadRequestException('El nombre de la carpeta es obligatorio');
    }

    const belongsCompany = await this.companyDirectoryService.companyExistsForUser(companyId, userId);
    if (!belongsCompany) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const parentFolderId = body.parentFolderId ?? null;
    if (parentFolderId !== null) {
      const belongs = await this.companyDirectoryService.folderBelongsToCompany(parentFolderId, companyId);
      if (!belongs) {
        throw new BadRequestException('La carpeta padre no pertenece a la empresa');
      }
    }

    const folder = await this.companyDirectoryService.createFolder({
      companyId,
      name: body.name,
      parentFolderId,
    });
    return {
      id: folder.id,
      companyId: folder.companyId,
      name: folder.name,
      parentFolderId: folder.parentFolderId,
      createdAt: folder.createdAt.toISOString(),
    };
  }

  @Get(':id/folders')
  @UseGuards(JwtAuthGuard)
  async getFolders(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) companyId: number) {
    const exists = await this.companyDirectoryService.companyExistsForUser(companyId, userId);
    if (!exists) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const folders = await this.companyDirectoryService.getFolders(companyId);
    return folders.map((folder) => ({
      id: folder.id,
      companyId: folder.companyId,
      name: folder.name,
      parentFolderId: folder.parentFolderId,
      createdAt: folder.createdAt.toISOString(),
    }));
  }

  @Post(':id/files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _file, callback) => {
          const companyId = Number(req.params.id);
          const companyDir = join(COMPANY_DOCUMENTS_DIR, String(companyId));
          if (!existsSync(companyDir)) {
            mkdirSync(companyDir, { recursive: true });
          }
          callback(null, companyDir);
        },
        filename: (_req, file, callback) => {
          const safeExt = extname(file.originalname);
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async uploadFile(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) companyId: number,
    @UploadedFile() file: { originalname: string; filename: string; size: number; mimetype: string },
    @Body() body: UploadFileBody,
  ) {
    if (!file) {
      throw new BadRequestException('Debes adjuntar un archivo');
    }

    const belongsCompany = await this.companyDirectoryService.companyExistsForUser(companyId, userId);
    if (!belongsCompany) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const rawFolderId = body.folderId;
    if (rawFolderId === undefined || rawFolderId === null || String(rawFolderId).trim() === '') {
      throw new BadRequestException('Debe seleccionar una carpeta para subir archivos');
    }
    const folderId = Number(rawFolderId);
    if (!Number.isFinite(folderId)) {
      throw new BadRequestException('Carpeta invalida');
    }
    const belongsFolder = await this.companyDirectoryService.folderBelongsToCompany(folderId, companyId);
    if (!belongsFolder) {
      throw new BadRequestException('La carpeta no pertenece a la empresa');
    }

    const savedFile = await this.companyDirectoryService.saveFile({
      companyId,
      folderId,
      originalName: file.originalname,
      storedName: file.filename,
      size: file.size,
      mimeType: file.mimetype || 'application/octet-stream',
    });

    return {
      id: savedFile.id,
      companyId: savedFile.companyId,
      folderId: savedFile.folderId,
      originalName: savedFile.originalName,
      size: Number(savedFile.size),
      mimeType: savedFile.mimeType,
      createdAt: savedFile.createdAt.toISOString(),
    };
  }

  @Get(':id/files')
  @UseGuards(JwtAuthGuard)
  async getFiles(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) companyId: number,
    @Query('folderId') folderId: string | undefined,
  ) {
    const exists = await this.companyDirectoryService.companyExistsForUser(companyId, userId);
    if (!exists) {
      throw new NotFoundException('Empresa no encontrada');
    }

    if (folderId === undefined || folderId === '' || String(folderId).trim() === '') {
      throw new BadRequestException('Debe indicar la carpeta (folderId)');
    }
    const parsedFolderId = Number(folderId);
    if (!Number.isFinite(parsedFolderId)) {
      throw new BadRequestException('Carpeta invalida');
    }
    const belongs = await this.companyDirectoryService.folderBelongsToCompany(parsedFolderId, companyId);
    if (!belongs) {
      throw new BadRequestException('La carpeta no pertenece a la empresa');
    }

    const files = await this.companyDirectoryService.getFiles(companyId, parsedFolderId);
    return files.map((file) => ({
      id: file.id,
      companyId: file.companyId,
      folderId: file.folderId,
      originalName: file.originalName,
      size: Number(file.size),
      mimeType: file.mimeType,
      createdAt: file.createdAt.toISOString(),
    }));
  }

  @Get(':companyId/files/:fileId/download')
  async downloadCompanyFile(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
    @Res() response: Response,
  ): Promise<void> {
    const file = await this.companyDirectoryService.getFileById(companyId, fileId);
    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const filePath = join(COMPANY_DOCUMENTS_DIR, String(companyId), file.storedName);
    response.download(filePath, file.originalName);
  }
}

interface CreateCompanyBody {
  name: string;
  nit: string;
  city: string;
  department: string;
  phoneNumber: string;
  email: string;
  description: string;
}

interface CreateFolderBody {
  name: string;
  parentFolderId?: number | null;
}

interface UploadFileBody {
  folderId?: string;
}

function validateCreateBody(body: CreateCompanyBody) {
  const requiredFields: Array<keyof CreateCompanyBody> = [
    'name',
    'nit',
    'city',
    'department',
    'phoneNumber',
    'email',
    'description',
  ];
  for (const field of requiredFields) {
    if (!body[field] || !String(body[field]).trim()) {
      throw new BadRequestException(`El campo ${field} es obligatorio`);
    }
  }
}

function mapToDto(company: Company): CompanyDto {
  return {
    id: company.id,
    name: company.name,
    nit: company.nit,
    city: company.city,
    department: company.department,
    phoneNumber: company.phoneNumber,
    email: company.email,
    description: company.description,
    documentOriginalName: company.documentOriginalName,
    createdAt: company.createdAt.toISOString(),
  };
}
