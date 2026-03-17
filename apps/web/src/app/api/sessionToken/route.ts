import { cookies } from "next/headers";

export async function GET() {
  const cookieStore =await cookies();

  const token =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  if (!token) {
    return Response.json({ token: null });
  }

  return Response.json({ token });
}