import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterBody) {
    validateRegisterBody(body);
    return this.authService.register({
      fullName: body.fullName,
      email: body.email,
      password: body.password,
    });
  }

  @Post('login')
  async login(@Body() body: LoginBody) {
    validateLoginBody(body);
    return this.authService.login({
      email: body.email,
      password: body.password,
    });
  }
}

interface RegisterBody {
  fullName: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

function validateRegisterBody(body: RegisterBody) {
  if (!body.fullName?.trim()) throw new BadRequestException('El nombre es obligatorio');
  validateLoginBody(body);
  if (!body.password || body.password.length < 6) {
    throw new BadRequestException('La contrasena debe tener al menos 6 caracteres');
  }
}

function validateLoginBody(body: LoginBody) {
  if (!body.email?.trim()) throw new BadRequestException('El correo es obligatorio');
  if (!body.password?.trim()) throw new BadRequestException('La contrasena es obligatoria');
}
