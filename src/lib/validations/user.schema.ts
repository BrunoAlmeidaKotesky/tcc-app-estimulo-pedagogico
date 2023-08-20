import { z } from "zod";

export const RegisterUserSchema = z
  .object({
    name: z
      .string({
        required_error: "Nome é obrigatório",
      })
      .min(1, "Nome completo é obrigatório"),
    email: z
      .string({
        required_error: "Email é obrigatório",
      })
      .min(1, "Email é obrigatório")
      .email("Email é inválido"),
    password: z
      .string({
        required_error: "Senha é obrigatória",
      })
      .min(1, "Senha é obrigatória")
      .min(4, "Senha deve ter pelo menos 4 caracteres"),
    passwordConfirm: z
      .string({
        required_error: "Confirme sua senha",
      })
      .min(1, "Confirme sua senha"),
    childs: z.array(z.object({
      name: z.string({
        required_error: "Nome é obrigatório",
      }).min(1, "Nome é obrigatório"),
      age: z.coerce.number({
        required_error: "Idade é obrigatória",
      })
    })).min(1, "É obrigatório adicionar pelo menos um filho")
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "As senhas não coincidem",
  }).refine((data) => data.childs.length > 0, {
    path: ["childs"],
    message: "É obrigatório adicionar pelo menos um filho",
  });

export const LoginUserSchema = z.object({
  email: z
    .string({
      required_error: "Email é obrigatório",
    })
    .min(1, "Email é obrigatório")
    .email("Email é inválido"),
  password: z
    .string({
      required_error: "Senha é obrigatória",
    })
    .min(1, "Senha é obrigatória")
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;