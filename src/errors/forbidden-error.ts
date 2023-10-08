import { ApplicationError } from '@/protocols';

export function forbiddenError(message = 'forbidden.'): ApplicationError {
  return {
    name: 'forbiddenError',
    message,
  };
}
