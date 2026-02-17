import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Roles = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    return data;
  },
);