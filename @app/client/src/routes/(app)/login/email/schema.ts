import { z } from "zod";
import { zfd } from "zod-form-data";

export const loginSchema = zfd.formData({
  email: zfd.text(z.string().email().min(1)),
  password: zfd.text(z.string().min(1)),
});
