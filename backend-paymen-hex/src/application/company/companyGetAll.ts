import { CompanyRepository } from 'src/domain/company.repository';

export class CompanyGetAll {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async run(userId: number) {
    return this.companyRepository.getAllByUserId(userId);
  }
}
