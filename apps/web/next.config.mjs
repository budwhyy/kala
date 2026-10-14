import path from "node:path";

// next-intl needs one thing from its Next plugin: an alias that points `next-intl/config` at our
// request config. We set it here directly instead of importing `next-intl/plugin`, because that
// plugin pulls in a native SWC addon (for message extraction, which KĀLA does not use) that fails to
// start on some Windows setups. See docs/DECISIONS.md.
const REQUEST_CONFIG = "./i18n/request.ts";

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Workspace packages ship TypeScript source; Next compiles them.
  transpilePackages: ["@kala/schema"],
  reactStrictMode: true,
  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["next-intl/config"] = path.resolve(config.context, REQUEST_CONFIG);
    return config;
  },
  turbopack: {
    resolveAlias: { "next-intl/config": REQUEST_CONFIG },
  },
};

export default nextConfig;
