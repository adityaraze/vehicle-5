// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental:{
//     serverComponentsHmrCache:false, // default to true
//   },

//   images: {
//     remotePatterns:[
//     {
//       protocol:"https",
//       hostname:"sqgbwjytxzqgkckbelyt.supabase.co",
//     }
//     ]
//   },
//   async headers() {
//     return [
//       {
//         source: "/embed",
//         headers: [
//           {
//             key: "Content-Security-Policy",
//             value: "frame-src 'self' ",
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
  },

  eslint: {
    ignoreDuringBuilds: true, // 👈 add this
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sqgbwjytxzqgkckbelyt.supabase.co",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' ",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
