import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'company_files' })
export class CompanyFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  companyId: number;

  @Column({ type: 'int', nullable: true })
  folderId: number | null;

  @Column({ type: 'varchar', length: 255 })
  originalName: string;

  @Column({ type: 'bytea', select: false, nullable: true })
  content: Buffer | null;

  @Column({ type: 'bigint' })
  size: string;

  @Column({ type: 'varchar', length: 120 })
  mimeType: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
