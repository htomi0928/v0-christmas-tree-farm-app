// React dev mode needs eval() for its debugging features (never used in
// production), and Next's dev server needs a websocket for HMR — so the
// CSP is relaxed in development and stays strict in production.
const isDev = process.env.NODE_ENV !== "production"

// Vercel's preview-deployment live-feedback toolbar (vercel.live) injects its
// own script/iframe/websocket — allowed everywhere since it's inert on
// production URLs anyway (Vercel only activates it on preview deployments).
const contentSecurityPolicy = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com"
    : "script-src 'self' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  isDev
    ? "connect-src 'self' ws: wss: https://vitals.vercel-insights.com https://va.vercel-scripts.com https://vercel.live wss://*.pusher.com"
    : "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://vercel.live wss://*.pusher.com",
  "frame-src https://www.google.com https://maps.google.com https://vercel.live",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
