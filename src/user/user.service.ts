import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class UserService {
  private jwtSecrete: string;

  constructor(private env: ConfigService) {
    this.jwtSecrete = this.env.get<string>('JWT_SECRETE') as string;
  }

  signToken(payload: PayloadDto): string {
    return jwt.sign(payload, this.jwtSecrete);
  }

  /// Willl throw for use an error if token provide is invalid
  verifyToken(token: string): PayloadDto {
    try {
      return jwt.verify(token, this.jwtSecrete) as PayloadDto;
    } catch (error) {
      throw new UnauthorizedException(
        'Incorrect Token, Please loggin again to continue',
      );
    }
  }

  static hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  static verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
