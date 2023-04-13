import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import "./styles/global.css";
import { Form } from "./components/Form";

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty("O nome é obrigatório")
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => word[0].toLocaleUpperCase().concat(word.substring(1)))
        .join(" ");
    }),
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email("Formato de email inválido")
    .toLowerCase()
    .refine(
      (email) => email.endsWith("@gmail.com"),
      "O Email precisa ser da sua conta do Google"
    ),
  password: z.string().min(6, "A senha precisa ser no mínimo 6 caracteres"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("O nome da tecnologia é obrigatoria"),
        experience: z.coerce
          .number()
          .min(1, "No mínimo deve ter 1 ano de experiencia")
          .max(15),
      })
    )
    .min(2, "Insira pelo menos duas tecnologias")
    .refine((techs) => {
      const techsName = techs.map((tech) => tech.title);
      return new Set(techsName).size === techsName.length;
    }, "Voce inseriu duas ou mais tecnologias com o mesmo nome, altere!")
    .refine((techs) => {
      return techs.some((tech) => tech.experience > 1);
    }, "Voce está aprendendo"),
});

//Determina essa tipagem (infer) com base no meu tipo do createUserFormSchema
type createUserFormData = z.infer<typeof createUserFormSchema>;

export function App() {
  const [output, setOutput] = useState("");

  const createUserForm = useForm<createUserFormData>({
    //O formulário será validado de acordo com as regras de validação definidas no createUserFormSchema
    resolver: zodResolver(createUserFormSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
  } = createUserForm;

  //Estamos associando o useFieldArray ao useForm e permitindo que a manipulação do array de campos de entrada seja integrada com a validação do formulário realizada pelo useForm.
  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  function createUser(data: createUserFormData) {
    setOutput(JSON.stringify(data, null, 2));
    console.log(data);
    trigger();
  }

  function addNewTech() {
    append({ title: "", experience: 1 });
  }

  return (
    <div className="w-screen h-screen bg-zinc-900 flex justify-evenly items-center">
      <FormProvider {...createUserForm}>
        <form
          onSubmit={handleSubmit(createUser)}
          action=""
          className="flex flex-col gap-5 w-full max-w-xs bg-zinc-50 opacity-80 rounded-lg p-5"
        >
          <Form.Field>
            <Form.Label htmlFor="nome">Nome</Form.Label>
            <Form.Input name="name" />
            <Form.ErrorMessage field="name" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Input name="email" />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">Senha</Form.Label>
            <Form.Input name="password" />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </Form.Field>

          <Form.Field>
            <label htmlFor="" className="flex items-center justify-between">
              Tecnlogias
              <button
                type="button"
                onClick={addNewTech}
                className="text-indigo-500 text-sx"
              >
                Adicionar
              </button>
            </label>

            {fields.map((field, index) => {
              const fieldName = `techs.${index}.title`;
              const fieldeExperience = `techs.${index}.experience`;

              return (
                <Form.Field key={field.id}>
                  <div className="flex gap-2 items-center">
                    <Form.Input type={fieldName} name={fieldName} />
                    <Form.Input type="number" name={fieldeExperience} w="w-10" />

                    {errors.techs?.[index]?.title && (
                      <span className="flex flex-col text-red-500 text-xs">
                        {errors.techs?.[index]?.title?.message}
                      </span>
                    )}
                  </div>
                </Form.Field>
              );
            })}
            {errors.techs && (
              <span className="text-red-500">{errors.techs.message}</span>
            )}
          </Form.Field>

          <button
            type="submit"
            className="h-10 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition-colors"
          >
            Cadastrar
          </button>
        </form>

        {!output ? (
          false
        ) : (
          <div className="flex p-5 border border-zinc-50 text-zinc-200">
            <pre>{output}</pre>
          </div>
        )}
      </FormProvider>
    </div>
  );
}
