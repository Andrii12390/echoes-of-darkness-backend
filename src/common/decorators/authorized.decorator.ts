import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";

export const Authorized = createParamDecorator((data: keyof User, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest() as Request

  const user = req.user

  return data ? user![data] : user
})