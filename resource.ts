// amplify/data/resource.ts

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
      allow.authenticated(), 
    ])
    .secondaryIndexes((index) => [
      index('owner').sortKeys(['timestamp']),
      index('receiver').sortKeys(['timestamp']),
    ]),

  Chat: a
    .model({
      createdAt: a.datetime().required(),
      name: a.string()
    })
    .authorization((allow) => [
      allow.authenticated(), 
    ]),

  ChatUser: a
    .model({
      username: a.string().required(),
      chatId: a.string().required(),
      timestamp: a.string().required(),
    })
    .authorization((allow) => [
      allow.authenticated(), 
    ])
    .secondaryIndexes((index) => [
      index('username'),
      index('chatId'),
    ]),

  ChatMessages: a
    .model({
      chatId: a.string().required(),
      sendername: a.string().required(),
      content: a.string().required(),
      timestamp: a.string().required(),
      messageType: a.string().default('text'),
    })
    .authorization((allow) => [
      allow.authenticated(),  
    ]),

  MeetingInvitation: a
    .model({
      chatId: a.string().required(),
      createdBy: a.string().required(),
      title: a.string().required(),
      description: a.string(),
      dateTime: a.datetime().required(),
      location: a.string(),
      status: a.string().required().default('pending'),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime(),
      invited: a.string().required(),
    })
    .authorization((allow) => [
      allow.authenticated(),
    ])
    .secondaryIndexes((index) => [
      index('chatId').sortKeys(['dateTime']),
      index('createdBy').sortKeys(['dateTime']),
      index('invited').sortKeys(['dateTime']), 
    ]),

  UserProfile: a
    .model({
      userId: a.string().required(),
      prefUser: a.string().required(),
    })
    .authorization((allow)=> [
      allow.authenticated(),
    ])
    .secondaryIndexes((index) => [
      index('userId')
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
