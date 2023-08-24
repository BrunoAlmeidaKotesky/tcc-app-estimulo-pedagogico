'use client'

import FormInput from "@/components/FormInput"
import ApiClient from "@/lib/ApiClient";
import { ChildLoginInput, ChildUserSchema } from "@/lib/validations/user.schema";
import useStore, { useAppStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast";
import { LoadingButton } from "@/components/LoadingButton";

export function ChildLogin() {
    const store = useStore(useAppStore, s => s);
    const router = useRouter();

    const methods = useForm<ChildLoginInput>({
        resolver: zodResolver(ChildUserSchema),
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitSuccessful },
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            store?.reset(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loginUser({accessCode, name}: ChildLoginInput) {
        store?.setRequestLoading(true);
        const res = await ApiClient.loginChildUser(accessCode, name);
        if (res.isErr()) {
            console.log(res.error);
            store?.setRequestLoading(false);
            return toast.error(res.error.message);
        }
        toast.success("Login realizado com sucesso!");
        store?.setRequestLoading(false);
        store?.setUserType(res.unwrap().userType);
        return router.push("/questionario");
    }

    const onSubmitHandler: SubmitHandler<ChildLoginInput> = (values) => loginUser(values);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmitHandler)}
                className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5">
                <FormInput type="text" name="name" label="Nome" />
                <FormInput type="text" name="accessCode" label="Código de Acesso"/>
                <LoadingButton loading={store?.requestLoading || false} textColor="text-ct-blue-600">
                    Entrar
                </LoadingButton>
            </form>
        </FormProvider>
    )
}