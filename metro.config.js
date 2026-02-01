const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
// expo-router needs this for web/static assets in some setups
config.resolver.sourceExts.push('cjs');
module.exports = config;
