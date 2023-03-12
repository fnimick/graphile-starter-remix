import { z } from "zod";
import { zfd } from "zod-form-data";

export const loginSchema = zfd.formData({
  username: zfd.text(
    z.string({ required_error: "Please input your username or e-mail" })
  ),
  password: zfd.text(
    z.string({ required_error: "Please input your passphrase" })
  ),
  next: zfd.text(z.string().optional()),
});
