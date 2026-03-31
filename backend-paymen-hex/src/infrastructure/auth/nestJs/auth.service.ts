import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../typeOrm/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: { fullName: string; email: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) {
      throw new BadRequestException('Ya existe un usuario con este correo');
    }

    const passwordHash = await hash(input.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({
        fullName: input.fullName.trim(),
        email,
        passwordHash,
      }),
    );
    return this.buildSession(user);
  }

  async login(input: { email: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const valid = await compare(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    return this.buildSession(user);
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  private buildSession(user: UserEntity) {
    const payload = { sub: user.id, email: user.email, fullName: user.fullName };
    const token = this.jwtService.sign(payload);
    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
}
