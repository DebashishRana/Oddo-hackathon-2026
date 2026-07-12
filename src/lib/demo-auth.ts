export const DEMO_AUTH_COOKIE = "assetflow_demo_session";

export const DEMO_LOGIN = {
  email: "demo@dectra.local",
  password: "Demo1234!",
  name: "Demo User",
  department: "Operations",
  role: "admin",
} as const;

export type DemoSessionUser = {
  email: string;
  name: string;
  role: string;
  department: string;
};

export const isDemoCredentials = (email: string, password: string) => {
  return email.trim().toLowerCase() === DEMO_LOGIN.email && password === DEMO_LOGIN.password;
};

export const buildDemoSessionUser = (email: string = DEMO_LOGIN.email): DemoSessionUser => {
  return {
    email: email.trim().toLowerCase(),
    name: DEMO_LOGIN.name,
    role: DEMO_LOGIN.role,
    department: DEMO_LOGIN.department,
  };
};

export const serializeDemoSession = (user: DemoSessionUser) => {
  return encodeURIComponent(JSON.stringify(user));
};

export const parseDemoSession = (value: string | undefined | null): DemoSessionUser | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<DemoSessionUser>;

    if (!parsed.email || !parsed.name || !parsed.role || !parsed.department) {
      return null;
    }

    return {
      email: parsed.email,
      name: parsed.name,
      role: parsed.role,
      department: parsed.department,
    };
  } catch {
    return null;
  }
};

export const createDemoSessionCookie = (user: DemoSessionUser) => {
  const secureFlag = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  return `${DEMO_AUTH_COOKIE}=${serializeDemoSession(user)}; Path=/; Max-Age=604800; SameSite=Lax${secureFlag}`;
};

export const clearDemoSessionCookie = () => {
  const secureFlag = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  return `${DEMO_AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secureFlag}`;
};
