"use client";

import { ParentLoginInput, ParentUserSchema } from "@/lib/validations/user.schema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import ApiClient from "@/lib/ApiClient";
import FormInput from "@/components/FormInput";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";
import useStore from "@/store";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const {requestLoading, setRequestLoading, storeReset} = useStore(s => ({
    requestLoading: s.requestLoading,
    setRequestLoading: s.setRequestLoading,
    storeReset: s.reset,
  }));
  const router = useRouter();

  const methods = useForm<ParentLoginInput>({
    resolver: zodResolver(ParentUserSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      storeReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loginUser(credentials: ParentLoginInput) {
    setRequestLoading(true);
    const res = await ApiClient.loginParentUser(JSON.stringify(credentials));
    if (res.isErr()) {
      console.log(res.error);
      setRequestLoading(false);
      return toast.error(res.error.message);
    }
    toast.success("Login realizado com sucesso!");
    setRequestLoading(false);
    return router.push("/perfil");
  }

  const onSubmitHandler: SubmitHandler<ParentLoginInput> = (values) => loginUser(values);
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
      >
        <FormInput label="Email" name="email" type="email" />
        <FormInput label="Senha" name="password" type="password" />
        <LoadingButton
          loading={requestLoading}
          textColor="text-ct-blue-600">
          Entrar
        </LoadingButton>
        <span className="block">
          Não possui uma conta?{" "}
          <Link href="/cadastro" className="text-ct-blue-600">
            Cadastre-se aqui!
          </Link>
        </span>
      </form>
    </FormProvider>
  );
}