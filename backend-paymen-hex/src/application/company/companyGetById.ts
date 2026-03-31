import { CompanyRepository } from 'src/domain/company.repository';

export class CompanyGetById {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async run(id: number, userId: number) {
    return this.companyRepository.getByIdForUser(id, userId);
  }

  async runPublic(id: number) {
    return this.companyRepository.getById(id);
  }
}
