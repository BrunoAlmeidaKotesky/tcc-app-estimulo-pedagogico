import React from "react";
import { useFormContext } from "react-hook-form";

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
}) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Se o tipo do input for "number", converte a string para um número.
    const parsedValue = type === "number" ? parseInt(inputValue, 10) : inputValue;
    // Usa o setValue para atualizar o valor no useFormContext.
    setValue(name, parsedValue);
  };

  return (
    <div className="">
      <label htmlFor={name} className="block text-ct-blue-600 mb-3">
        {label}
      </label>
      <input
        type={type}
        placeholder=" "
        className="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
        {...register(name)}
        onChange={handleInputChange}
      />
      {errors[name] && (
        <span className="text-red-500 text-xs pt-1 block">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
