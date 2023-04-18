import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtService } from '../../interfaces/abstracts/jwt.interface';
import { IJwtAuthPayload } from '../../interfaces/authJwtPayload.interface';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  public async checkToken<T>(token: string): Promise<T> {
    return (await this.jwtService.verifyAsync(token)) as T;
  }

  public createToken(payload: IJwtAuthPayload): string {
    return this.jwtService.sign(payload);
  }
}
