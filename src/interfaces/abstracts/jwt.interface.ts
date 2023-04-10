import { IJwtAuthPayload } from '../authJwtPayload.interface';

export interface IJwtService {
  checkToken?<T>(token: string): Promise<T>;
  createToken?(payload: IJwtAuthPayload): string;
}
