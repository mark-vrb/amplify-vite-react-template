import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

import { getFeatureFlags } from './functions/get-feature-flags/resource';

defineBackend({
  auth,
  data,
  getFeatureFlags,
});
