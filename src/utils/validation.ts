import { ExceptHRQuestionFieldsDTO, HRQuestionFieldsDTO } from '@/dtos/request/peer.dto';
import { ErrorEnum } from '@/exceptions/errorCodes';
import { HttpException } from '@/exceptions/httpException';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationArguments, ValidationError, ValidatorConstraint, ValidatorConstraintInterface, validate, validateOrReject } from 'class-validator';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export function ValidateDto(
  type: ClassConstructor<unknown>,
  field: 'body' | 'query',
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false,
) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        const dto = plainToInstance<unknown, object>(type, args[0][field] ?? {});
        await validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted });
      } catch (errors) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        throw new HttpException(ErrorEnum.VALIDATION_ERROR, message);
      }
      return originalMethod.apply(this, args);
    };
  };
}

export function validateRoute(route: string) {
  const replaced = route.replaceAll(/\/+/g, '/');
  if (replaced.endsWith('/')) return replaced.substring(0, replaced.length - 1);
  return replaced;
}

export function sanitizeMobileNumber(mobileNumber: string) {
  let mobNo = mobileNumber;
  if (mobNo.startsWith('91') && mobNo.length === 12) {
    mobNo = `+${mobNo}`;
  }

  if (!mobileNumber.startsWith('+91')) {
    mobNo = `+91${mobNo}`;
  }

  return mobNo.slice(-13);
}

@ValidatorConstraint({ name: 'isValidNestedQuestion', async: false })
export class IsValidNestedQuestion implements ValidatorConstraintInterface {
  async validate(otherQuestions: unknown, args: ValidationArguments) {
    let valid = false;
    const tryOne = plainToInstance<unknown, unknown>(HRQuestionFieldsDTO, otherQuestions);
    await validate(tryOne as object, { whitelist: true, forbidNonWhitelisted: true }).then((errors) => {
      if (errors.length === 0) valid = true;
    });
    if (valid) return true;
    const tryTwo = plainToInstance<unknown, unknown>(ExceptHRQuestionFieldsDTO, otherQuestions);
    await validate(tryTwo as object, { whitelist: true, forbidNonWhitelisted: true }).then((errors) => {
      if (errors.length === 0) valid = true;
    });
    if (valid) return true;
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `'otherQuestions' must be either HRQuestionFieldsDTO or ExceptHRQuestionFieldsDTO`;
  }
}
