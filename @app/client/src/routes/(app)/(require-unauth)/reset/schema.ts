import { z } from "zod";
import { zfd } from "zod-form-data";
import zxcvbn from "zxcvbn";

import { ZXCVBN_SCORE_REQUIREMENT } from "$lib/components/PasswordStrength.svelte";

const passwordSchema = z
  .object({
    password: zfd
      .text(z.string({ required_error: "Please input your passphrase." }))
      .refine((val) => zxcvbn(val).score >= ZXCVBN_SCORE_REQUIREMENT, {
        message: "Please choose a stronger passphrase.",
      }),
    confirm: zfd.text(
      z.string({ required_error: "Please confirm your passphrase." })
    ),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Make sure your passphrase is the same in both passphrase boxes.",
    path: ["confirm"],
  });

export const resetSchema = zfd.formData(passwordSchema);

export const resetServerSchema = zfd.formData(
  passwordSchema.and(
    z.object({
      userId: zfd.text(z.string()),
      token: zfd.text(z.string()),
    })
  )
);
