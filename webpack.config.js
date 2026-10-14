const createExpoWebpackConfigAsync = require("@expo/webpack-config");

// Expo SDK 50 web build: expo-modules-core's uuid.web.js requires node's
// 'crypto', which webpack 5 no longer polyfills. Mapping it to false uses
// the browser's Web Crypto API instead and fixes "Module not found: crypto".
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    crypto: false,
  };
  return config;
};
