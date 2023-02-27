import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ColumnOptions, CreateDateColumn } from 'typeorm';

export const IsRequiredCreateDateColumn = (props?: ColumnOptions) => {
  return applyDecorators(
    IsNotEmpty({
      message: '$property must not be empty',
    }),
    IsString({
      message: '$property must be a string',
    }),
    CreateDateColumn({ nullable: false, ...props }),
    ApiProperty({
      required: true,
    }),
  );
};
