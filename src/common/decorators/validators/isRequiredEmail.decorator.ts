import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export const IsRequiredEmail = () => {
  return applyDecorators(IsString(), IsEmail(), IsNotEmpty(), ApiProperty({}));
};
