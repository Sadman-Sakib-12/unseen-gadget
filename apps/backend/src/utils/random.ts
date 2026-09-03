import { randomBytes, randomUUID } from "crypto";

export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function generateId(): string {
  return randomUUID();
}

export const Random = { token: generateToken, id: generateId };

export default Random;