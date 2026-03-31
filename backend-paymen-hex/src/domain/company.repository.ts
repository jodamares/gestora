import { Company } from './company';

export interface CompanyCreateInput {
  userId: number;
  name: string;
  nit: string;
  city: string;
  department: string;
  phoneNumber: string;
  email: string;
  description: string;
  documentOriginalName: string;
  documentStoredName: string;
}

export interface CompanyRepository {
  create(input: CompanyCreateInput): Promise<Company>;
  getAllByUserId(userId: number): Promise<Company[]>;
  getByIdForUser(id: number, userId: number): Promise<Company | null>;
  getById(id: number): Promise<Company | null>;
}
