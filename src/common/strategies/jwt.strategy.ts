import { ERROR_CODE, USER } from '@/constants';
import { UserRepository } from '@/repositories';
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUser } from '../interfaces';

require('dotenv').config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: IUser) {
    if (payload.exp * 1000 < Date.now()) {
      throw new UnauthorizedException(ERROR_CODE.EXPIRED_TOKEN);
    }
    const user = await this.userRepository.findOne({ id: payload.id });
    if (!user) {
      throw new NotFoundException(ERROR_CODE.USER_NOT_FOUND);
    }
    if (user.status === USER.STATUS.DISABLED_USER) {
      throw new ForbiddenException(ERROR_CODE.DISABLED_USER);
    }
    return payload;
  }
}
