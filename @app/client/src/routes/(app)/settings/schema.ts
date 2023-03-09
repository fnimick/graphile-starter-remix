import { z } from "zod";
import { zfd } from "zod-form-data";

export const profileSchema = zfd.formData({
  name: zfd.text(z.string({ required_error: "Please input your name." })),
  username: zfd.text(
    z
      .string({ required_error: "Please input your username." })
      .min(2, "Username must be at least 2 characters long.")
      .max(24, "Username must be no more than 24 characters long.")
      .regex(/^([a-zA-Z]|$)/, "Username must start with a letter.")
      .regex(
        /^([^_]|_[^_]|_$)*$/,
        "Username must not contain two underscores next to each other."
      )
      .regex(
        /^[a-zA-Z0-9_]*$/,
        "Username must contain only alphanumeric characters and underscores."
      )
  ),
});
