# Quickstart

## Installation

Install `bridge-mongo` in your typescript project:

```bash title='terminal'
npm install bridge-mongo
# or
yarn add bridge-mongo
# or
pnpm add bridge-mongo
```

## Define your Schemas

Defining your schemas in bridge-mongo is just as easy as it is with Mongoose. You can define your schemas using Mongoose's schema syntax, and then use the createDB function to create your models.

When you use `createDB`, bridge-mongo will automatically create and register each model with Mongoose using the keys from your schema object as the model names. This means you can define all of your schemas in one place and have them automatically created and registered as models for you.

```ts twoslash title='index.ts'
import { createDB, Schema, mongoose } from 'bridge-mongo';

// Defining a User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  age: { type: Number, default: 18 },
  job: { type: String, enum: ['developer', 'designer'] as const },
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

## Connect to MongoDB

Connecting to your MongoDB database using bridge-mongo is just as easy as it is with Mongoose. In fact, you can import `mongoose` directly from bridge-mongo and use its connect function to connect to your database.

```ts twoslash title='index.ts'
import { mongoose } from 'bridge-mongo';

const launch = async () => {
    await mongoose.connect('Your MongoDB URL here');

    console.log('Connected!')
}

launch();
```


## Start enjoying type safety

You can enjoy the benefits of **total type safety** and guidance through TypeScript. The fully typed query results and error handling provided by bridge-mongo make it easy to write correct, efficient queries with confidence.

 Read the documentation to get started or get a look to the examples below.

**Some Queries examples:**

```ts twoslash title='index.ts'
import { createDB, Schema, mongoose } from 'bridge-mongo';

// Defining a User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  age: { type: Number, default: 18 },
  job: { type: String, enum: ['developer', 'designer'] as const },
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
// ---cut---
import { isError } from 'bridge-mongo';

async () => {
  const user = await DB.user.create({ name: 'Nab' });
  //     ^?
  const post = await DB.post.findOne({ userId: user._id }, {text: 1});
  //      ^?
  if (!isError(post)) console.log(post)
  //                               ^?

  const posts = await DB.post.find({ likes: { $gt: 10 }});
  //      ^?

  const res = await DB.user.findByIdAndUpdate(user._id, { name: 'Neo' }, { projection: { name: 1 } })
  //     ^?
}
```

**Some Aggregate examples:**

```ts twoslash title='index.ts'
import { createDB, Schema, mongoose } from 'bridge-mongo';

// Defining a User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  age: { type: Number, default: 18 },
  job: { type: String, enum: ['developer', 'designer'] as const },
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
// ---cut---
async () => {
  
  // Fetching all users that have created post with their posts
  const creators = await DB.user
    .aggregate()
    .project({ name: 1 })
    .lookup({ from: 'posts', localField: '_id', foreignField: 'userId' })
    .match({ 'posts.0': { $exists: true } })
    .exec();

  console.log(creators);
  //            ^?


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

  console.log(posts);
  //            ^?

}

```