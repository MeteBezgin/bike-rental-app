import { object, string, ref } from "yup";

export const createUserSchema = object({
  body: object({
    name: string().required(),
    role: string().required(),
    email: string().email().required(),
    password: string().required(),
    passwordConfirm: string()
      .oneOf([ref("password"), null], "Passwords must match")
      .required(),
  }),
});
