const COOKIE_NAME = "admin_session";
const SESSION_VERSION = 1;
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 8;

type AdminSessionPayload = {
  v: number;
  u: string;
  iat: number;
  exp: number;
  jti: string;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

let cachedKeyPromise: Promise<CryptoKey> | null = null;

function getSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.SESSION_SECRET;
  if (secret) {
    return secret;
  }
  console.warn(
    "ADMIN_SESSION_SECRET is not set; using an ephemeral secret. Sessions will reset on restart."
  );
  const random = crypto.getRandomValues(new Uint8Array(32));
  return base64UrlEncodeBytes(random);
}

function base64UrlEncodeBytes(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecodeBytes(input: string) {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlEncodeText(text: string) {
  return base64UrlEncodeBytes(encoder.encode(text));
}

function base64UrlDecodeText(input: string) {
  return decoder.decode(base64UrlDecodeBytes(input));
}

async function getSigningKey() {
  if (!cachedKeyPromise) {
    const secretBytes = encoder.encode(getSessionSecret());
    cachedKeyPromise = crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  }
  return cachedKeyPromise;
}

async function signPayload(payload: string) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

async function verifySignature(payload: string, signature: string) {
  const key = await getSigningKey();
  return crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecodeBytes(signature),
    encoder.encode(payload)
  );
}

export function getAdminSessionCookieName() {
  return COOKIE_NAME;
}

export async function createAdminSession(
  username: string,
  maxAgeSeconds = DEFAULT_MAX_AGE_SECONDS
) {
  const now = Date.now();
  const payload: AdminSessionPayload = {
    v: SESSION_VERSION,
    u: username,
    iat: now,
    exp: now + maxAgeSeconds * 1000,
    jti: crypto.randomUUID(),
  };
  const encodedPayload = base64UrlEncodeText(JSON.stringify(payload));
  const signature = await signPayload(encodedPayload);
  return {
    token: `${encodedPayload}.${signature}`,
    expiresAt: payload.exp,
  };
}

export async function verifyAdminSession(token: string) {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }
  const valid = await verifySignature(encodedPayload, signature);
  if (!valid) {
    return null;
  }
  const decoded = base64UrlDecodeText(encodedPayload);
  let payload: AdminSessionPayload;
  try {
    payload = JSON.parse(decoded) as AdminSessionPayload;
  } catch {
    return null;
  }
  if (payload.v !== SESSION_VERSION || payload.exp <= Date.now()) {
    return null;
  }
  return payload;
}

export async function getAdminSessionFromRequest(req: {
  headers: Headers;
  cookies?: { get: (name: string) => { value?: string } | undefined };
}) {
  const cookieValue =
    req.cookies?.get(COOKIE_NAME)?.value ?? parseCookieHeader(req.headers);
  if (!cookieValue) {
    return null;
  }
  return verifyAdminSession(cookieValue);
}

function parseCookieHeader(headers: Headers) {
  const raw = headers.get("cookie");
  if (!raw) {
    return null;
  }
  const parts = raw.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (!part.startsWith(`${COOKIE_NAME}=`)) {
      continue;
    }
    return decodeURIComponent(part.slice(COOKIE_NAME.length + 1));
  }
  return null;
}
