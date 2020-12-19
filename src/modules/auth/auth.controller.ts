import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordBody, LoginBody, RefreshTokenBody, ResetPasswordBody, VerifyOtpBody } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() body: LoginBody) {
    const { usernameOrEmail, password } = body;
    return this.authService.login(usernameOrEmail, password);
  }

  @Post('verifyOtp')
  async verifyOtp(@Body() body: VerifyOtpBody) {
    const { usernameOrEmail, otp } = body;
    return this.authService.verifyOtp(usernameOrEmail, otp);
  }

  @Post('refreshToken')
  async refreshToken(@Body() body: RefreshTokenBody) {
    const { refreshToken } = body;
    return this.authService.refreshToken(refreshToken);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() body: ForgotPasswordBody) {
    const { email } = body;
    return this.authService.forgotPassword(email);
  }

  @Post('resetPassword')
  async resetPassword(@Body() body: ResetPasswordBody) {
    const { usernameOrEmail, currentPassword, newPassword } = body;
    return this.authService.resetPassword(usernameOrEmail, currentPassword, newPassword);
  }
}