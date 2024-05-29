import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({
      message: "Email is required",
    }),
    password: z.string().min(8, {
      message: "Password should at least be 8 characters length",
    }),
});