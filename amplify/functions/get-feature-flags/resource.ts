import { defineFunction } from '@aws-amplify/backend';

export const getFeatureFlags = defineFunction({
  environment: {
    ENABLE_FEATURES: process.env.ENABLE_FEATURES || ''
  }
});