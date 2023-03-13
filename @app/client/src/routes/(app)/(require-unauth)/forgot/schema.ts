import { z } from "zod";
import { zfd } from "zod-form-data";

export const forgotSchema = zfd.formData({
  email: zfd.text(
    z
      .string({ required_error: "Please input your e-mail." })
      .email("The input is not valid E-mail.")
  ),
});
