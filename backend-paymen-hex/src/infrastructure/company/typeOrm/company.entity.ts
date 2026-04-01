import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { UserEntity } from 'src/infrastructure/auth/typeOrm/user.entity';

@Entity({ name: 'companies' })
@Unique(['user', 'nit'])
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @RelationId((company: CompanyEntity) => company.user)
  userId: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 80 })
  nit: string;

  @Column({ type: 'varchar', length: 80 })
  city: string;

  @Column({ type: 'varchar', length: 80 })
  department: string;

  @Column({ type: 'varchar', length: 30 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  documentOriginalName: string;

  @Column({ type: 'bytea', select: false, nullable: true })
  documentContent: Buffer | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
