import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12" />}>
      <LoginForm />
    </Suspense>
  );
}
