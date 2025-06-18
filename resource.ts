import { a, defineData, ClientSchema } from '@aws-amplify/backend';
import { timeStamp } from 'console';

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
    // Add indexes for efficient querying
    .secondaryIndexes((index) => [
      index('owner').sortKeys(['timestamp']),
      index('receiver').sortKeys(['timestamp']),
    ]),

  Chat: a //tables stores the unique chat id for each chat. Also stores the name of chat and when the initial chat was created
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
      timestamp: a.string().required(),
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
        timestamp: a.string().required(),
        messageType: a.string().default('text'),
      })
      .authorization((allow) => [
      allow.authenticated(),  
    ]),

    // calendar/meeting related tables
    MeetingInvitation: a
      .model({
        // remove invitationid because dynamodb already has a unique key, it's auto generated
        chatId: a.string().required(),
        createdBy: a.string().required(),
        title: a.string().required(),
        description: a.string(),
        dateTime: a.datetime().required(),
        location: a.string(),
        status: a.string().required().default('pending'), // it can be ppending, accepted, declined, cancelled (response can update this)
        createdAt: a.datetime().required(),
        updatedAt: a.datetime(),
        invited: a.string().required(),
      })
      .authorization((allow) => [
        allow.authenticated(),
      ])
      .secondaryIndexes((index) => [
        index('chatId').sortKeys(['dateTime']),
        index('createdBy').sortKeys(['createdAt']),
      
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

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws.gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
