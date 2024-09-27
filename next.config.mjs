/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns : [
        {
          protocol : 'https',
          hostname : "astrix.blob.core.windows.net"
        },
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com"
        },
        {
          protocol: 'https',
          hostname: 'imgs.search.brave.com',
          port: '',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          port: '',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: '*',
          port: '',
          pathname: '**',
        },
      ]
    },
  };
  
  export default nextConfig;
  