import { z } from "zod";
import { zfd } from "zod-form-data";

export const verifySchema = zfd.formData({
  id: zfd.text(z.string()),
  token: zfd.text(z.string()),
});
