import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams?: Promise<{ redirect?: string }>;
};

function normalizeRedirect(value?: string) {
  if (!value) {
    return "/admin";
  }
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }
  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolved = searchParams ? await searchParams : undefined;
  const redirectTo = normalizeRedirect(resolved?.redirect);
  return <LoginForm redirectTo={redirectTo} />;
}
