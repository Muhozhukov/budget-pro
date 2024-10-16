import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninDto } from './dto/signin-dto';
import { SignUpDto } from './dto/signup-dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotFoundError } from 'rxjs';
import { Request, Response } from 'express';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signinDto: SigninDto, response: Response): Promise<void> {
    const { email, password: pass } = signinDto;

    if (!email || !pass) {
      throw new BadRequestException('Bad request');
    }
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundError(`User with email ${email} is not register`);
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Wrong email or password!');
    }

    const payload = { id: user.id, email: user.email, name: user.name };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 3600000,
    });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const dataToReturn = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    response.status(200).json(dataToReturn);
  }

  async signUp(signUpDto: SignUpDto): Promise<Partial<User>> {
    const { email, name, password } = signUpDto;
    if (!email || !name || !password) {
      throw new BadRequestException('Bad request!');
    }

    const salt = await bcrypt.genSalt();

    const passwordHash = await bcrypt.hash(password, salt);

    return await this.usersService.create({
      name,
      email,
      password: passwordHash,
    });
  }

  async refreshTokens(request: Request, response: Response): Promise<void> {
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });

      const user = await this.usersService.findOne(payload.id);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token!');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { id: payload.id, email: payload.email, name: payload.name },
        { expiresIn: '1h' },
      );

      const tokenExpiry = this.jwtService.decode(refreshToken)['exp'];
      const currentTime = Math.floor(Date.now() / 1000);
      const timeRemaining = tokenExpiry - currentTime;

      let newRefreshToken = refreshToken;

      if (timeRemaining < 24 * 60 * 60) {
        // Меньше 24 часов
        newRefreshToken = await this.jwtService.signAsync(
          { id: user.id, email: user.email, name: user.name },
          { expiresIn: '7d' },
        );
        response.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
        });
      }

      response.cookie('access_token', newAccessToken, {
        httpOnly: true,
        maxAge: 3600000,
      });

      response.status(200).send({ message: 'success' });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
