"use client";

import {
  RegisterUserInput,
  RegisterUserSchema,
} from "@/lib/validations/user.schema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import ApiClient from "@/lib/ApiClient";
import FormInput from "@/components/FormInput";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";
import useStore, {useAppStore} from "@/store";
import { handleApiError } from "@/lib/helpers";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChildInput } from "@/components/ChildInput";
import { AccessCodeToast } from "@/components/AccessCodeToast";

export default function RegisterForm() {
  const store = useStore(useAppStore, s => s);
  const router = useRouter();
  const methods = useForm<RegisterUserInput>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  async function registerUser(credentials: RegisterUserInput) {
    store?.setRequestLoading(true);
    const response = await ApiClient.registerUser(JSON.stringify(credentials));
    if (response.isErr()) {
      handleApiError(response.error);
      toast.error(response?.error?.message);
      return store?.setRequestLoading(false);
    }
    const resData = response.unwrap();
    const user = resData.data;
    store?.setParentUser(user);
    toast(({id}) => <AccessCodeToast codes={user.childAccessCodes} onClose={() => toast.dismiss(id)}/>, {duration: Infinity});
    store?.setRequestLoading(false);
    store?.setUserType(resData.userType);
    return router.push("/login");
  }

  const onSubmitHandler: SubmitHandler<RegisterUserInput> = (values) => registerUser(values);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
      >
        <FormInput label="Nome Completo" name="name" />
        <FormInput label="Email" name="email" type="email" />
        <FormInput label="Senha" name="password" type="password" />
        <FormInput
          label="Confirme sua Senha"
          name="passwordConfirm"
          type="password"
        />
        <ChildInput />
        <span className="block">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-ct-blue-600">
            Faça o login aqui
          </Link>
        </span>
        <LoadingButton loading={store?.requestLoading || false} textColor="text-ct-blue-600">
          Cadastrar
        </LoadingButton>
      </form>
    </FormProvider>
  );
}
