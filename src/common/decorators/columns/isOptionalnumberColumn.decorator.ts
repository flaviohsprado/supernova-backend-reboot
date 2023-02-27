import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Column, ColumnOptions } from 'typeorm';

export const IsOptionalNumberColumn = (props?: ColumnOptions) => {
  return applyDecorators(
    Column({
      type: 'decimal',
      transformer: {
        from(value: string) {
          return parseFloat(value);
        },
        to(value: number) {
          return value;
        },
      },
      nullable: true,
      ...props,
    }),
    ApiProperty({ type: 'number', nullable: true }),
  );
};
