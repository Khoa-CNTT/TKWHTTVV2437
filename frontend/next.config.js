/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
  env: {
    URL_SERVER_API: "http://localhost:5000/api",
  },
  experimental: {
    // Bỏ qua lỗi prerendering
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
    // Tắt prerendering cho các trang cụ thể
    ppr: false,
    // Tắt static optimization
    serverActions: {
      bodySizeLimit: "2mb",
    },
    // Tắt Server Components
    serverComponents: false,
    // Tắt Server Components External Packages
    serverComponentsExternalPackages: [],
  },
  // Bỏ qua lỗi useSearchParams
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Bỏ qua lỗi TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  // Bỏ qua lỗi ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Tắt prerendering cho các trang cụ thể
  output: "standalone",
  // Thêm các trang cần bỏ qua prerendering
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  // Tắt static optimization
  staticPageGenerationTimeout: 1000,
  // Tắt automatic static optimization
  reactStrictMode: false,
  // Tắt automatic static optimization cho các trang cụ thể
  unstable_runtimeJS: true,
  // Tắt automatic static optimization cho các trang cụ thể
  unstable_JsPreload: false,
  // Tắt prerendering cho các trang cụ thể
  async headers() {
    return [
      {
        source: "/homestay/information",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/homestay/dashboard",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/checkout",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/admin/Properties/Room",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/admin/Verification/Properties",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/homestay/payment-info",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  // Tắt prerendering cho các trang cụ thể
  async rewrites() {
    return [
      {
        source: "/homestay/information",
        destination: "/homestay/information",
        has: [
          {
            type: "query",
            key: "skip-prerender",
            value: "true",
          },
        ],
      },
      {
        source: "/homestay/dashboard",
        destination: "/homestay/dashboard",
        has: [
          {
            type: "query",
            key: "skip-prerender",
            value: "true",
          },
        ],
      },
      {
        source: "/checkout",
        destination: "/checkout",
        has: [
          {
            type: "query",
            key: "skip-prerender",
            value: "true",
          },
        ],
      },
      {
        source: "/admin/Properties/Room",
        destination: "/admin/Properties/Room",
        has: [
          {
            type: "query",
            key: "skip-prerender",
            value: "true",
          },
        ],
      },
      {
        source: "/admin/Verification/Properties",
        destination: "/admin/Verification/Properties",
        has: [
          {
            type: "query",
            key: "skip-prerender",
            value: "true",
          },
        ],
      },
      {
        source: "/homestay/payment-info",
        destination: "/homestay/payment-info",
        has: [
          {
            type: "query",
            key: "skip-prerender",
            value: "true",
          },
        ],
      },
    ];
  },
  // Tắt static optimization cho các trang cụ thể
  async getStaticProps() {
    return {
      props: {},
      revalidate: false,
    };
  },
  // Tắt static optimization cho các trang cụ thể
  async getStaticPaths() {
    return {
      paths: [],
      fallback: "blocking",
    };
  },
  // Tắt prerendering cho các trang cụ thể
  async generateStaticParams() {
    return {
      exclude: [
        "/homestay/payment-info",
        "/homestay/information",
        "/homestay/dashboard",
      ],
    };
  },
};

module.exports = nextConfig;
