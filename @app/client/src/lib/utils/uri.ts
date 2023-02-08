export function isSafe(nextUrl: string | null | undefined): nextUrl is string {
  // Prevent protocol-relative URLs - test for `//foo.bar`
  return (nextUrl && nextUrl[0] === "/" && nextUrl[1] !== "/") || false;
}
