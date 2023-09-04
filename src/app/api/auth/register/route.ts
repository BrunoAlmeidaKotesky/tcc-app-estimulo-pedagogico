import 'reflect-metadata';
import { getErrorResponse } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { Child } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { Catch, DefaultCatch } from "bakutils-catcher";

type CreateChildParams = {
  age: number;
  name: string;
  parent: {
      connect: {
          id: string;
      };
  }
}

class RegisterUserHandler {
  /**Função auxiliar para criar um código de acesso único para a criança.*/
  static createCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  static async createChildWithUniqueCode(data: CreateChildParams, originalCode: string): Promise<[Child, string]> {
    const hashedCode = await hash(originalCode, 12);
    try {
      const child = await prisma.child.create({
        data: {
          ...data,
          accessCode: hashedCode,
        },
      });
      return [child, originalCode];
    } catch (error: any) {
      if (error.code === "P2002" && error.meta?.target.includes('accessCode')) {
        return await this.createChildWithUniqueCode(data, this.createCode());
      } else {
        throw error;
      }
    }
  }


  //Ordem dos decorators é de baixo para cima, ou seja, ZodError é o primeiro a ser executado.
  @DefaultCatch(error => {
    if (error.code === "P2002" && error.meta.target.includes('email'))
      return getErrorResponse(409, "Usuário com este email já existe");
    return getErrorResponse(500, error.message);
  })
  @Catch(ZodError, (err) => getErrorResponse(400, "Validação falhou", err))
  static async post(req: NextRequest): Promise<NextResponse | undefined> {
    const body = (await req.json()) as RegisterUserInput;
    const data = RegisterUserSchema.parse(body);

    const hashedPassword = await hash(data.password, 12);
    const parentUser = await prisma.parent.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
    const childAccessCodes: { name: string; accessCode: string }[] = [];
    for await (const child of data.childs) {
      const originalCode = this.createCode();
      const [childRes, returnedCode] = await this.createChildWithUniqueCode({
        ...child,
        parent: { connect: { id: parentUser.id } }
      }, originalCode);
      childAccessCodes.push({ name: childRes.name, accessCode: returnedCode });
    }

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: {
          user: { ...parentUser, password: undefined },
          childAccessCodes
        },
      }), 
      { status: 201, headers: { "Content-Type": "application/json" }}
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse | undefined> {
  return await RegisterUserHandler.post(req);
}
