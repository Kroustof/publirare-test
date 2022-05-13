/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  // env: {
  //   "MORALIS_SERVER_URL":"https://d5cvkzmvd0lt.usemoralis.com:2053/server",
  //   "MORALIS_APP_ID":"B9dYSr4Q9oj8DQah7jFqIz4uyhrXohKJQbirpzsU",
  //   "WEB3AUTH_CLIENT_ID":"BIeaJTx34Mb-zQCm1mxUNpbGUEI14xuHRQZt4hZnn_Q9JwEdhxBxSqxqGIcTDAF8VwreWOzldQhBLCR7BOfn7tc"
  // },
  i18n,
  webpack: (config) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      assert: require.resolve('assert'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      stream: require.resolve('stream-browserify'),
    };
    return config;
  },
}

module.exports = nextConfig
