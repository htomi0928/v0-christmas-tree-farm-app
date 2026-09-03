// React dev mode needs eval() for its debugging features (never used in
// production), and Next's dev server needs a websocket for HMR — so the
// CSP is relaxed in development and stays strict in production.
const isDev = process.env.NODE_ENV !== "production"
const deployTarget = process.env.DEPLOY_TARGET

const contentSecurityPolicy = [
  "default-src 'self'",
  isDev ? `script-src 'self' 'unsafe-inline' 'unsafe-eval'` : `script-src 'self' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline'`,
  "img-src 'self' data: https:",
  `font-src 'self' data:`,
  isDev ? `connect-src 'self' ws: wss: wss://*.pusher.com` : `connect-src 'self' wss://*.pusher.com`,
  `frame-src https://www.google.com https://maps.google.com`,
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
  env: {
    // Client components receive this build-time value without requiring a
    // second, separately configured NEXT_PUBLIC environment variable.
    NEXT_PUBLIC_DEPLOY_TARGET: deployTarget ?? "",
  },
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
