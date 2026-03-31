import { CompanyRepository } from 'src/domain/company.repository';

export class CompanyCreate {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async run(input: {
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
  }) {
    return this.companyRepository.create(input);
  }
}
