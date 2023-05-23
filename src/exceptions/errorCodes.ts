export enum ErrorEnum {
  // Validation
  VALIDATION_ERROR,

  // Auth
  UNAUTHORIZED,
  SESSION_NON_EXISTENT,
  USER_ALREADY_EXISTS,
  INVALID_VALIDATION_ID,
  INVALID_REFRESH_TOKEN,
  LINKEDIN_TOKEN_UNAUTHENTICATED,
  LINKEDIN_AUTH_FAILED,
  USER_NOT_FOUND,
  PROFILE_NOT_FOUND,
  PROFILE_ALREADY_EXISTS,
  USER_NO_PASSWORD,
  PASSWORD_MISMATCH,
  WORKEXPERIENCE_NOT_FOUND,
  SKILL_NOT_FOUND,

  // Waitlist
  ALREADY_IN_WAITLIST,

  // Models
  FAILED_TO_CREATE_USER,
  FAILED_TO_CREATE_PROFILE,
  AADHAR_NOT_FOUND,
  INVALID_USER_ID,
  EDUCATION_NOT_FOUND,
  OAUTH_PROVIDER_NOT_FOUND,
  OAUTH_FAILED,
}

export const ErrorCodes: Record<ErrorEnum, ErrorCodes> = {
  [ErrorEnum.VALIDATION_ERROR]: {
    code: 'GR0000',
    message: '%s',
    status: 400,
  },
  [ErrorEnum.UNAUTHORIZED]: {
    code: 'GR0001',
    message: 'Unauthorized',
    status: 401,
  },
  [ErrorEnum.SESSION_NON_EXISTENT]: {
    code: 'GR0002',
    message: 'Session does not exist',
    status: 400,
  },
  [ErrorEnum.USER_ALREADY_EXISTS]: {
    code: 'GR0003',
    message: 'User already exists',
    status: 409,
  },
  [ErrorEnum.INVALID_VALIDATION_ID]: {
    code: 'GR0004',
    message: 'Invalid validation ID',
    status: 400,
  },
  [ErrorEnum.INVALID_REFRESH_TOKEN]: {
    code: 'GR0005',
    message: 'Invalid refresh token',
    status: 400,
  },
  [ErrorEnum.LINKEDIN_TOKEN_UNAUTHENTICATED]: {
    code: 'GR0006',
    message: 'Failed to verify authenticity of token',
    status: 401,
  },
  [ErrorEnum.LINKEDIN_AUTH_FAILED]: {
    code: 'GR0007',
    message: 'LinkedIn auth failed, %s: %s',
    status: 401,
  },
  [ErrorEnum.USER_NOT_FOUND]: {
    code: 'GR0008',
    message: 'User not found',
    status: 404,
  },
  [ErrorEnum.PROFILE_NOT_FOUND]: {
    code: 'GR0009',
    message: 'Profile not found',
    status: 404,
  },
  [ErrorEnum.USER_NO_PASSWORD]: {
    code: 'GR0010',
    message: 'User does not have a password',
    status: 500,
  },
  [ErrorEnum.PASSWORD_MISMATCH]: {
    code: 'GR0011',
    message: 'Invalid user details',
    status: 401,
  },
  [ErrorEnum.ALREADY_IN_WAITLIST]: {
    code: 'GR0012',
    message: 'Email already in waitlist',
    status: 400,
  },
  [ErrorEnum.FAILED_TO_CREATE_USER]: {
    code: 'GR0013',
    message: 'Failed to create user',
    status: 500,
  },
  [ErrorEnum.FAILED_TO_CREATE_PROFILE]: {
    code: 'GR0014',
    message: 'Failed to create profile',
    status: 500,
  },
  [ErrorEnum.AADHAR_NOT_FOUND]: {
    code: 'GR0015',
    message: 'Aadhar not found',
    status: 404,
  },
  [ErrorEnum.INVALID_USER_ID]: {
    code: 'GR0016',
    message: 'Invalid user id',
    status: 403,
  },
  [ErrorEnum.EDUCATION_NOT_FOUND]: {
    code: 'GR0017',
    message: 'Education not found',
    status: 404,
  },
  [ErrorEnum.OAUTH_PROVIDER_NOT_FOUND]: {
    code: 'GR0018',
    message: 'OAuth provider not found',
    status: 404,
  },
  [ErrorEnum.OAUTH_FAILED]: {
    code: 'GR0019',
    message: 'OAuth failed',
    status: 500,
  },
  [ErrorEnum.PROFILE_ALREADY_EXISTS]: {
    code: 'GR0020',
    message: 'Profile already exists',
    status: 400,
  },
  [ErrorEnum.WORKEXPERIENCE_NOT_FOUND]: {
    code: 'GR0021',
    message: 'WorkExperience not found',
    status: 404,
  },
  [ErrorEnum.SKILL_NOT_FOUND]: {
    code: 'GR0022',
    message: 'skills not found',
    status: 404,
  },
};
