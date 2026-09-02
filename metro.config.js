const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Metro's default `unstable_conditionNames` is empty, so packages that key
// their exports on a "react-native" condition (like @firebase/auth's
// AsyncStorage-backed persistence) silently resolve to their web build
// instead. Firebase Auth then throws "Component auth has not been
// registered yet" because initializeAuth() never got the real RN entry.
config.resolver.unstable_conditionNames = ['react-native', 'require', 'default'];

module.exports = config;
