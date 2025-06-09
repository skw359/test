import { a, defineData, ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Message: a
    .model({
      owner: a.string().required(),   
      receiver: a.string().required(),
      content: a.string().required(),
      timestamp: a.datetime().required(),
    })
    .authorization((allow) => [
      allow.authenticated(), // Allow any authenticated user to CRUD messages
    ])
    // Add indexes for efficient querying
    .secondaryIndexes((index) => [
      index('owner').sortKeys(['timestamp']),
      index('receiver').sortKeys(['timestamp']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
