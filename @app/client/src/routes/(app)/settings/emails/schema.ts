import { z } from "zod";
import { zfd } from "zod-form-data";

export const emaildIdSchema = zfd.formData(
  z.object({
    emailId: z.string().min(1),
  })
);

export const addEmailSchema = zfd.formData(
  z.object({
    email: zfd.text(
      z
        .string({ required_error: "Please input your e-mail." })
        .email("The input is not valid E-mail.")
    ),
  })
);
