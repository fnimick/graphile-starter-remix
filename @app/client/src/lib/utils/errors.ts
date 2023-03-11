import z from "zod";

const errorSchema = z.object({
  message: z.string(),
  locations: z.array(z.object({ line: z.number(), column: z.number() })),
  path: z.array(z.string()),
  extensions: z.object({
    exception: z.object({
      code: z.string(),
    }),
  }),
});

type PostgraphileErrorResponse = z.infer<typeof errorSchema>;

export function isPostgraphileError(
  error: unknown
): error is PostgraphileErrorResponse {
  return errorSchema.safeParse(error).success;
}

export function getCodeFromError(error: PostgraphileErrorResponse): string {
  if (error.extensions?.exception?.code) {
    return error.extensions.exception.code;
  }
  return "UNKNOWN";
}
