import type { Handler } from 'aws-lambda';

export const handler: Handler = async (event, context) => {
  // your function code goes here
  const featureFlagsOnly: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('ENABLE_') && value) {
      featureFlagsOnly[key] = value;
    }
  }

  return JSON.stringify(featureFlagsOnly);
};