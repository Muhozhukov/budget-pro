import {
  Controller,
  Get,
  Post,
  Body,
  // UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin-dto';
import { User } from 'src/users/entities/user.entity';
// import { AuthGuard } from './auth.guard';
import { Public } from 'src/shared/Public';
import { SignUpDto } from './dto/signup-dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(
    @Body() signinDto: SigninDto,
    @Res() res: Response,
  ): Promise<void> {
    return this.authService.signIn(signinDto, res);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() signupDto: SignUpDto): Promise<Partial<User>> {
    return this.authService.signUp(signupDto);
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    return this.authService.refreshTokens(req, res);
  }

  @Get('profile')
  async getProfile(@Req() req: any): Promise<User> {
    return req.user;
  }
}
