import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  weightGrams: z.number().int().min(100).max(20000),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Enter the full name for delivery").max(80),
  phone: z
    .string()
    .trim()
    .min(9, "Enter a phone number we can reach you on")
    .max(20)
    .regex(/^(\+?254|0)[17]\d{8}$/, "Use a Kenyan number such as 0712 345 678"),
  address: z.string().trim().min(8, "Add the building, street and house number").max(240),
  zone: z.string().trim().min(2, "Choose your delivery zone"),
  deliveryDate: z.string().trim().min(4, "Choose a delivery date"),
  instructions: z.string().trim().max(600).optional().or(z.literal("")),
  paymentMethod: z.enum(["mpesa", "cash"]),
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
  recaptchaToken: z.string().optional(),
  captchaV2Token: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  orderType: z.enum(["bulk", "wedding", "event", "corporate", "general"]),
  message: z.string().trim().min(10, "Tell us a little about your order").max(1200),
  recaptchaToken: z.string().optional(),
  captchaV2Token: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(80),
    email: z.string().trim().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .max(72, "Use 72 characters or fewer")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/\d/, "Include at least one number"),
    confirmPassword: z.string(),
    recaptchaToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
  recaptchaToken: z.string().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const recaptchaVerifySchema = z.object({
  token: z.string().min(1, "Token is required"),
  action: z.string().optional(),
});
