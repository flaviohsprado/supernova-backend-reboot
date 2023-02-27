import { applyDecorators } from '@nestjs/common';
import { IsBoolean, IsOptional } from 'class-validator';

export const IsOptionalBoolean = () => {
  return applyDecorators(IsOptional(), IsBoolean());
};
