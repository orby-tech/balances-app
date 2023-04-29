import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { sha256 } from 'js-sha256';
import { UsersService } from 'src/db/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user || user?.password_hash !== sha256(pass)) {
      throw new UnauthorizedException();
    }
    const { password_hash, ...result } = user;
    const payload = { username: user.email, sub: user.user_id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
