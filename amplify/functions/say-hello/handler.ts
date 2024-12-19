import type { Handler } from 'aws-lambda';
import { env } from '$amplify/env/say-hello'; // the import is '$amplify/env/<function-name>'

export const handler: Handler = async () => {
  // const featureFlagsOnly: { [key: string]: string } = { "SOME_PREDEFINED_FLAG": 'true' };

  const features: string[] = env.ENABLE_FEATURES?.split(',');
  // for (const [key, value] of Object.entries(process.env)) {
  //   if (key.startsWith('ENABLE_') && value !== undefined) {
  //     featureFlagsOnly[key] = value.toString();
  //   }
  // }

  return features;
};