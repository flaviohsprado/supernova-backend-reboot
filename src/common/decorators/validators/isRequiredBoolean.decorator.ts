import { applyDecorators } from '@nestjs/common';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export const IsRequiredBoolean = () => {
  return applyDecorators(IsBoolean(), IsNotEmpty());
};
