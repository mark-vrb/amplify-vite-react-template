import type { Handler } from 'aws-lambda';
import { env } from '$amplify/env/get-feature-flags'; // the import is '$amplify/env/<function-name>'

export const handler: Handler = async () => {
  const features: string[] = env.ENABLE_FEATURES?.split(',');

  return JSON.stringify(features);
};