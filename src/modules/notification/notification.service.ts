import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TemplateRepository } from '../../repositories';
import { NodemailerService } from '../../global_modules/nodemailer/nodemailer.service';
import { TEMPLATE, ERROR_CODE } from '../../constants';

@Injectable()
export class NotificationService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly nodemailerService: NodemailerService,
  ) { }

  async otpNotification(email: string, otp: string) {
    const template = await this.templateRepository.findOne({ templateCode: TEMPLATE.CODE.TWO_FACTOR_AUTHENTICATION });
    if (!template) {
      throw new NotFoundException(ERROR_CODE.TEMPLATE_NOT_FOUND);
    }
    try {
      await this.nodemailerService.send(email, {
        subject: template.subject,
        html: template.content
          .replace(TEMPLATE.KEYWORDS.TWO_FACTOR_AUTHENTICATION.OTP, otp)
          .replace(TEMPLATE.KEYWORDS.TWO_FACTOR_AUTHENTICATION.OTP_TTL, (Number(process.env.OTP_TTL) / 60).toString()),
      });
    } catch (error) {
      if (error.message.includes('No recipients defined')) {
        throw new BadRequestException(ERROR_CODE.INVALID_EMAIL_ADDRESS);
      }
      // if (error.message.includes('not a valid phone number')) {
      //   throw new BadRequestException(ERROR_CODE.INVALID_PHONE_NUMBER);
      // }
    }
  }

  async newPasswordNotification(email: string, newPassword: string) {
    const template = await this.templateRepository.findOne({ templateCode: TEMPLATE.CODE.FORGOT_PASSWORD });
    if (!template) {
      throw new NotFoundException(ERROR_CODE.TEMPLATE_NOT_FOUND);
    }
    try {
      await this.nodemailerService.send(email, {
        subject: template.subject,
        html: template.content.replace(TEMPLATE.KEYWORDS.FORGOT_PASSWORD.NEW_PASSWORD, newPassword),
      });
    } catch (error) {
      if (error.message.includes('No recipients defined')) {
        throw new BadRequestException(ERROR_CODE.INVALID_EMAIL_ADDRESS);
      }
      // if (error.message.includes('not a valid phone number')) {
      //   throw new BadRequestException(ERROR_CODE.INVALID_PHONE_NUMBER);
      // }
    }
  }
}
