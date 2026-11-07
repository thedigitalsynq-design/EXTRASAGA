import { describe, expect, it } from "vitest";
import { isAuthorized } from "@/lib/ingest/auth";

describe("isAuthorized", () => {
  it("accepts a bearer token and the header form", () => {
    expect(isAuthorized("Bearer secret-value", null, "secret-value")).toBe(true);
    expect(isAuthorized(null, "secret-value", "secret-value")).toBe(true);
  });

  it("rejects missing, wrong, and differently sized secrets", () => {
    expect(isAuthorized(null, null, "secret-value")).toBe(false);
    expect(isAuthorized("Bearer wrong", null, "secret-value")).toBe(false);
    expect(isAuthorized("Bearer short", null, "secret-value")).toBe(false);
    expect(isAuthorized("Bearer secret-value", null, null)).toBe(false);
  });
});
