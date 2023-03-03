import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiPagination = (
  options: Record<string, any> = {},
): MethodDecorator & ClassDecorator => {
  const defaults = {
    page: { required: false, type: Number },
    limit: { required: false, type: Number },
  };

  const properties = {
    ...defaults,
    ...options,
  };

  return applyDecorators(
    ApiQuery({ name: 'page', ...properties.page }),
    ApiQuery({ name: 'limit', ...properties.limit }),
  );
};
