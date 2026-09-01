/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    // TypeScript 6's CLI can close its wrapper before Next receives the
    // complete --showConfig output. The compiler API avoids that transport
    // issue while preserving the same type-checking rules.
    useTypeScriptCli: false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
