"use client"

import { Analytics } from "@vercel/analytics/next"
import { useCookieConsent } from "@/contexts/cookie-consent-context"

export function ConsentAwareAnalytics() {
  const { consent } = useCookieConsent()
  if (consent !== "accepted") return null
  // Only load the real script in production — on localhost it has no clean
  // navigation-timing data to report on (causing a console error), and dev
  // testing shouldn't count as real traffic in the analytics dashboard.
  if (process.env.NODE_ENV !== "production") return null
  if (process.env.NEXT_PUBLIC_DEPLOY_TARGET !== "vercel") return null
  return <Analytics />
}
