// Single source of truth for the business partners who split reservation
// revenue and expenses. To add a new partner: add their name here, and if
// they should get their own login auto-filled as `paidTo`, also add them to
// USERNAME_TO_PARTNER in lib/admin-users.ts. No other file needs to change.
export const PARTNERS = ["János", "Sanyi"] as const

export type Partner = (typeof PARTNERS)[number]

export function isPartner(value: unknown): value is Partner {
  return typeof value === "string" && (PARTNERS as readonly string[]).includes(value)
}
