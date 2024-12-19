import { defineFunction } from '@aws-amplify/backend';

export const sayHello = defineFunction({
  environment: {
    ENABLE_FEATURES: process.env.ENABLE_FEATURES || ''
  }
});