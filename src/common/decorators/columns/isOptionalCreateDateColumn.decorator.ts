import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ColumnOptions, CreateDateColumn } from 'typeorm';

export const IsOptionalCreateDateColumn = (props?: ColumnOptions) => {
  return applyDecorators(
    IsOptional(),
    IsString({
      message: '$property must be a string',
    }),
    CreateDateColumn({ nullable: true, ...props }),
    ApiProperty({
      required: false,
    }),
  );
};
