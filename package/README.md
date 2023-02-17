<div align="center">
  <a href="https://bridge.codes">
      <img src="https://mongo.bridge.codes/img/bridge-mongo.svg" height="80" />
  </a>
</div>
  
<div align="center">

 <a href="https://twitter.com/bridge_codes">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40bridge_codes&style=social&url=https%3A%2F%2Ftwitter.com%2Falexdotjs" />
  </a>
  <a href="https://discord.gg/yxjrwm7Bfr"> 
    <img alt="Discord" src="https://img.shields.io/discord/1050622016673288282?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
  <a href="https://github.com/trpc/trpc/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/trpc/trpc" />
  </a>
</div>

# Bridge Mongo

Bridge-mongo is a typed framework built on top of Mongoose, the popular MongoDB object-document mapping (ODM) library. It provides a type-safe approach to querying MongoDB databases that makes it almost impossible to write poorly constructed queries, all while using the same syntax as Mongoose.

[Try it live](https://stackblitz.com/edit/bridge-mongo?file=index.ts&view=editor)

**👉 See more informations on [mongo.bridge.codes](https://mongo.bridge.codes) 👈**

## Documentation

Full documentation for `bridge-mongo` can be found [here](https://mongo.bridge.codes).

## Installation

```bash
# npm
npm install bridge-mongo
# Yarn
yarn add bridge-mongo
# pnpm
pnpm add bridge-mongo
```

## Quickstart

### Define your Schemas

Defining your schemas in bridge-mongo is just as easy as it is with Mongoose. You can define your schemas using Mongoose's schema syntax, and then use the createDB function to create your models.

When you use `createDB`, bridge-mongo will automatically create and register each model with Mongoose using the keys from your schema object as the model names. This means you can define all of your schemas in one place and have them automatically created and registered as models for you.

```ts twoslash title='index.ts'
import { createDB, Schema, mongoose } from 'bridge-mongo';

// Defining a User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  age: { type: Number, default: 18 },
  job: { type: String, enum: ['developer', 'designer'] },
  settings: {
    isActive: Boolean,
  },
});

// Defining a Post Schema
const postSchema = new Schema(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, req: true },
    likes: Number,
  },
  { timestamps: true },
);

// The keys correspond to the model Name
const DB = createDB({
  User: userSchema,
  Post: postSchema,
});
```

### Connect to MongoDB

Connecting to your MongoDB database using bridge-mongo is just as easy as it is with Mongoose. In fact, you can import `mongoose` directly from bridge-mongo and use its connect function to connect to your database.

```ts twoslash title='index.ts'
import { mongoose } from 'bridge-mongo';

const launch = async () => {
    await mongoose.connect('Your MongoDB URL here');

    console.log('Connected!')
}

launch();
```


### Start enjoying type safety

You can enjoy the benefits of **total type safety** and guidance through TypeScript. The fully typed query results and error handling provided by bridge-mongo make it easy to write correct, efficient queries with confidence.

 Read the documentation to get started or get a look to the examples below.

**Some Queries examples:**

```ts
import { isError } from 'bridge-mongo';

async () => {
  const user = await DB.user.create({ name: 'Nab' });

  const post = await DB.post.findOne({ userId: user._id }, {text: 1});

  if (!isError(post)) console.log(post)


  const posts = await DB.post.find({ likes: { $gt: 10 }});

  const res = await DB.user.findByIdAndUpdate(user._id, { name: 'Neo' }, { projection: { name: 1 } })
}
```

**Some Aggregate examples:**

```ts twoslash title='index.ts'
async () => {
  
  // Fetching all users that have created post with their posts
  const blogers = await DB.user
    .aggregate()
    .project({ name: 1 })
    .lookup({ from: 'posts', localField: '_id', foreignField: 'userId' })
    .match({ 'posts.0': { $exists: true } })
    .exec();

  // Fetching all posts from the last 24 hours with their author only if he's >= 21 years old

  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

  const posts = await DB.post
    .aggregate()
    .project({ text: 1, createdAt: 1, userId: 1 })
    .match({ createdAt: { $gt: yesterday } })
    .lookup({ from: 'users', let: { userId: '$userId' }, as: 'user' }, (user, { userId }) =>
      user
        .match({ $expr: { $eq: ['$_id', userId] }, age: { $gte: 21 } })
        .project({ name: 1 })
        .limit(1),
    )
    .unwind('$user')
    .unset('userId')
    .exec();
}
```


Bridge-mongo is constantly evolving and adding new features to provide a fully typed, robust, and easy-to-use interface for interacting with MongoDB. While many essential functions are already implemented, there are still many more features that can be added to meet specific use cases. If you are interested in contributing or discussing features that you'd like to see implemented, you can join the [Bridge-mongo Discord server](https://discord.com/invite/yxjrwm7Bfr) and be a part of the community.
