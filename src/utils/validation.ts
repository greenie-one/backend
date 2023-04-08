import { HttpException } from '@/exceptions/httpException';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError, validateOrReject } from 'class-validator';

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

    console.log(target);

    descriptor.value = async function (...args: unknown[]) {
      try {
        const dto = plainToInstance<unknown, object>(type, args[0][field] ?? {});
        await validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted });
      } catch (errors) {
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
        throw new HttpException(message, 400);
      }
      return originalMethod.apply(this, args);
    };
  };
}
