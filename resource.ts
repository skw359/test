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

  Chat: a // tables stores the unique chat id for each chat. Also stores the name of chat and when the initial chat was created
    .model({
      createdAt: a.datetime().required(), 
      name: a.string()
    })
    .authorization((allow) => [
      allow.authenticated(), 
    ]),

  ChatUser: a // the join table between the chat table and the users in cognito. (what users are a part of what chats?)
    .model({
      username: a.string().required(),
      chatId: a.string().required(),
      timestamp: a.datetime().required() 
    })
    .authorization((allow) => [
      allow.authenticated(), 
    ])
    .secondaryIndexes((index) => [
      index('username'),
      index('chatId'),
    ]),

  ChatMessages: a // this table stores chats sent by users. It knows what chat room the message is from, when it was sent and who sent it 
    .model({
      chatId: a.string().required(),
      sendername: a.string().required(),
      content: a.string().required(),
      timestamp: a.datetime().required(), 
    })
    .authorization((allow) => [
      allow.authenticated(), 
    ])
    .secondaryIndexes((index) => [
      index('chatId').sortKeys(['timestamp']), 
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
