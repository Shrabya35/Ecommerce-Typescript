import { Metadata } from "next";

import RegisterForm from "./registerForm";

export const metadata: Metadata = {
  title: "Register | LynxLine",
  description: "Create a LynxLine account.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
