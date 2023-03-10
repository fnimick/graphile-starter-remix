import { z } from "zod";
import { zfd } from "zod-form-data";
import zxcvbn from "zxcvbn";

import { ZXCVBN_SCORE_REQUIREMENT } from "$lib/components/PasswordStrength.svelte";

export const securitySchema = zfd.formData(
  z
    .object({
      oldPassword: zfd.text(
        z.string({ required_error: "Please input your passphrase." })
      ),
      newPassword: zfd
        .text(z.string({ required_error: "Please input a new passphrase." }))
        .refine((val) => zxcvbn(val).score >= ZXCVBN_SCORE_REQUIREMENT, {
          message: "Please choose a stronger passphrase.",
        }),
      confirm: zfd.text(
        z.string({ required_error: "Please confirm your new passphrase." })
      ),
    })
    .refine(({ newPassword, confirm }) => newPassword === confirm, {
      message:
        "Make sure your passphrase is the same in both passphrase boxes.",
      path: ["confirm"],
    })
);
