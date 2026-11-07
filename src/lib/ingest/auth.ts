import { timingSafeEqual } from "node:crypto";

export function isAuthorized(
  authorization: string | null,
  secretHeader: string | null,
  ingestSecret: string | null,
): boolean {
  if (!ingestSecret) return false;
  const provided =
    secretHeader ??
    (authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : null);
  if (!provided) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(ingestSecret);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
}
