import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export const IsRequiredDate = () => {
  return applyDecorators(IsDate(), IsNotEmpty(), ApiProperty({}));
};
