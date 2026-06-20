import { z } from "zod"

const pkPhone = z
  .string()
  .regex(/^(\+92|0)[0-9]{10}$/, "Enter a valid Pakistani phone number (e.g. 03001234567)")

export const registerSchema = z.object({
  name:            z.string().min(2, "Name must be at least 2 characters"),
  email:           z.email("Enter a valid email address"),
  password:        z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path:    ["confirmPassword"],
})

export const loginSchema = z.object({
  email:    z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
})

export const resetPasswordSchema = z.object({
  token:           z.string().min(1),
  password:        z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path:    ["confirmPassword"],
})

export const addressSchema = z.object({
  fullName:    z.string().min(2, "Full name is required"),
  phone:       pkPhone,
  addressLine1:z.string().min(5, "Address line 1 is required"),
  addressLine2:z.string().optional(),
  city:        z.string().min(2, "City is required"),
  province:    z.string().min(2, "Province is required"),
  postalCode:  z.string().regex(/^\d{5}$/, "Postal code must be 5 digits"),
})

export const productSchema = z.object({
  name:         z.string().min(2, "Product name is required"),
  slug:         z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  description:  z.string().optional(),
  price:        z.number().int().positive("Price must be a positive number"),
  comparePrice: z.number().int().positive().optional().nullable(),
  categoryId:   z.string().min(1, "Category is required"),
  isFeatured:   z.boolean().default(false),
  isActive:     z.boolean().default(true),
})

export const orderSchema = z.object({
  paymentMethod: z.enum(["COD", "EASYPAISA", "NAYAPAY", "BANK_TRANSFER"]),
  txnId:         z.string().optional(),
  fullName:      z.string().min(2),
  phone:         pkPhone,
  addressLine1:  z.string().min(5),
  addressLine2:  z.string().optional(),
  city:          z.string().min(2),
  province:      z.string().min(2),
  postalCode:    z.string().regex(/^\d{5}$/),
  items:         z.array(z.object({
    productId:   z.string(),
    variantId:   z.string().optional(),
    productName: z.string(),
    qty:         z.number().int().positive(),
    unitPrice:   z.number().int().positive(),
  })).min(1, "Cart is empty"),
})

export type RegisterInput      = z.infer<typeof registerSchema>
export type LoginInput         = z.infer<typeof loginSchema>
export type AddressInput       = z.infer<typeof addressSchema>
export type ProductInput       = z.infer<typeof productSchema>
export type OrderInput         = z.infer<typeof orderSchema>
