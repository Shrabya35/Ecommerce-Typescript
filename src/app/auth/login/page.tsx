import type { Metadata } from "next";

import LoginForm from "./loginForm";

export const metadata: Metadata = {
  title: "Login | LynxLine",
  description: "Sign in to your LynxLine account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
