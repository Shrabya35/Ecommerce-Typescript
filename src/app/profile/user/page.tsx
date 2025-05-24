import { Metadata } from "next";
import UserComponent from "./userComponent";

export const metadata: Metadata = {
  title: "User Profile | LynxLine",
  description:
    "Manage your account details and track your orders securely. Shop your favorite styles with confidence at LynxLine.",
};

export default function User() {
  return <UserComponent />;
}
