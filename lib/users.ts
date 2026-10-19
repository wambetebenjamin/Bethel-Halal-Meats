import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type MemoryStore = {
  users: Map<string, StoredUser>;
};

const globalStore = globalThis as typeof globalThis & {
  __bethelUsers?: MemoryStore;
};

function memory(): MemoryStore {
  if (!globalStore.__bethelUsers) {
    globalStore.__bethelUsers = { users: new Map() };
  }
  return globalStore.__bethelUsers;
}

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kv() {
  const mod = await import("@vercel/kv");
  return mod.kv;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  const [scheme, salt, digest] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !digest) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(digest, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}

function demoUser(): StoredUser {
  return {
    id: "demo-customer",
    name: "Demo Customer",
    email: "demo@bethelhalalmeats.co.ke",
    passwordHash: hashPassword("BethelDemo1"),
    createdAt: new Date("2025-01-15T09:00:00.000Z").toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const key = email.trim().toLowerCase();

  if (kvConfigured()) {
    const store = await kv();
    const user = await store.get<StoredUser>(`bethel:user:${key}`);
    return user ?? null;
  }

  const store = memory();
  if (store.users.size === 0) {
    const seed = demoUser();
    store.users.set(seed.email, seed);
  }
  return store.users.get(key) ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const user: StoredUser = {
    id: `usr_${randomBytes(8).toString("hex")}`,
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  if (kvConfigured()) {
    const store = await kv();
    await store.set(`bethel:user:${email}`, user);
    return { ok: true, user };
  }

  memory().users.set(email, user);
  return { ok: true, user };
}
