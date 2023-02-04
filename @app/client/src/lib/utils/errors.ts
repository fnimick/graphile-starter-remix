import type { GraphQLError } from "graphql";

export interface GraphqlQueryErrorResult {
  message?: string | null;
  code?: string | null;
  error: true;
}

export function getExceptionFromError(
  error: null | Error | GraphQLError
): Error | null {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const exception = error.extensions && error.extensions.exception;
  return exception || error;
}

export function getCodeFromError(
  error: null | Error | GraphQLError | Array<Error | GraphQLError>
): null | string {
  const err = Array.isArray(error) ? error[0] : error;
  if (err == null) return null;
  const exception = getExceptionFromError(err);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (exception && (exception as any)["code"]) || null;
}
