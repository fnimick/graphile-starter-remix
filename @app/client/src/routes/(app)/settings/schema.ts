import { z } from "zod";
import { zfd } from "zod-form-data";

export const profileSchema = zfd.formData({
  name: zfd.text(z.string({ required_error: "Please input your name." })),
});
