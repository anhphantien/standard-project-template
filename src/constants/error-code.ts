export enum ERROR_CODE {
  DISABLED_USER = 'The account has been disabled',
  EXPIRED_TOKEN = 'The token has expired',
  INVALID_EMAIL_ADDRESS = 'Invalid email address',
  INVALID_OTP = 'Invalid OTP',
  INVALID_PASSWORD = 'Invalid password',
  INVALID_PAYLOAD = 'Invalid payload',
  INVALID_REFRESH_TOKEN = 'Invalid refresh token',
  NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_CURRENT_PASSWORD = 'The new password must be different from the current password',
  PASSWORD_HASH_NOT_FOUND = 'Hashed password not found',
  PERMISSION_DENIED = 'Permission denied',
  TEMPLATE_NOT_FOUND = 'Template not found',
  TOO_MANY_REQUESTS_TO_RECEIVE_OTP = 'Too many requests to receive OTP',
  USER_NOT_ACTIVATED = 'User not activated',
  USER_NOT_FOUND = 'User not found',
}