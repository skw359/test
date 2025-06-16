

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
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
      allow.authenticated(), // Allow any authenticated user to CRUD messages
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
      allow.authenticated(), // Allow any authenticated user to CRUD messages
    ]),

  ChatUser: a // the join table between the chat table and the users in cognito. (what users are a part of what chats?)
    .model({
      username: a.string().required(),
      chatId: a.string().required(),
      timestamp: a.string().required()
    })
    .authorization((allow) => [
      allow.authenticated(), // Allow any authenticated user to CRUD messages
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
      })
      .authorization((allow) => [
      allow.authenticated(), // Allow any authenticated user to CRUD messages
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
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
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
