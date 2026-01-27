"use client";

import { signIn, useSession } from "next-auth/react";

export default function TestAuth() {
  const { data: session, status } = useSession();

  const handleGoogleLogin = async () => {
    const result = await signIn("google", {
      redirect: false,
    });

    if (result?.error) {
      console.error("Login failed:", result.error);
    } else {
      console.log("Login success:", result);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>

      <hr />

      <h3>Session status: {status}</h3>

      <pre>
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
