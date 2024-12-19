import type { Handler } from 'aws-lambda';

export const handler: Handler = async (event, context) => {
  const featureFlagsOnly: { [key: string]: string } = { "SOME_PREDEFINED_FLAG": 'true' };

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('ENABLE_') && value !== undefined) {
      featureFlagsOnly[key] = value.toString();
    }
  }

  return JSON.stringify(featureFlagsOnly);
};