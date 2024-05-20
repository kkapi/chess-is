import {z} from 'zod'

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Пожалуйства введите коректный email"
  }),
  login: z.string().min(3, {
    message: "Минимальная длина 3"
  }).max(20, {
    message: "Максимальная длина 20"
  }),
  password: z.string().min(6, {
    message: "Пароль должен быть как минимум 6 символов в длину"
  }),
  confirmPassword: z.string().min(6, {
    message: "Пароль должен быть как минимум 6 символов в длину"
  })
})