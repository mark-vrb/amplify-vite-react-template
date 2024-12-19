import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import {sayHello} from "../functions/say-hello/resource";

const schema = a.schema({
  sayHello: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(sayHello)),

  Todo: a
    .model({
      content: a.string(),
    }),

  EnabledFeatures:
    a.model({
      features: a.json(),
      accounts: a.json(),
      effective: a.datetime()
    })
    // .authorization((allow) => [allow.publicApiKey()]),
}).authorization(allow => [
  allow.publicApiKey()
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
