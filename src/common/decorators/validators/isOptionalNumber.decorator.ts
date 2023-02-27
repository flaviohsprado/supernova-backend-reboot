import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export const IsOptionalNumber = () => {
  return applyDecorators(IsNumber({}), ApiProperty({}));
};
