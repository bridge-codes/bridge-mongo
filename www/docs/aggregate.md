# Aggregate Function

The aggregate function allows you to perform advanced data processing on the data in your MongoDB collections. With bridge-mongo, you can use the same syntax as you would with mongoose to build your pipeline of aggregation stages, which can include matching, sorting, grouping, and more. The result of your aggregation is lean by default, just like the result of your find functions, and you can manipulate the output of your pipeline using various built-in functions like project, lookup, unwind, and more. If you need to process your data in complex ways, the aggregate function is a powerful tool at your disposal. 

<details>
  <summary>Schemas Definition</summary>

```ts
import { createDB, Schema, mongoose } from 'bridge-mongo';

// Defining a User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  age: { type: Number, default: 18 },
  job: { type: String, enum: ['developer', 'designer']  },
  settings: {
    isActive: Boolean,
  },
});

// Defining a Post Schema
const postSchema = new Schema(
  {
    text: { type: String, required: true, unique: true },
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

</details> 


## Project

The project function in the aggregate pipeline allows you to select a subset of fields from the documents in the input stream. It takes an object as argument, with keys being the fields to include and values being 1. A value of 1 indicates that the field should be included.

**Example:**
```ts twoslash
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
// ---cut---
async () => {
  const users = await DB.user
    .aggregate()
    .project({ name: 1, settings: { isActive: 1 } })
    .exec();

  console.log(users);
  //            ^?
}
```

## Unset

The unset function of bridge-mongo removes a field from the document that is returned by the pipeline. It takes one or more arguments, each representing the name of the field to remove.

**Example:**
```ts twoslash
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
// ---cut---
async () => {
  const users = await DB.user
    .aggregate()
    .unset('name')
    .unset('settings')
    .exec();

  console.log(users);
  //            ^?

  // OR

  const users2 = await DB.user
    .aggregate()
    .unset(['name', 'job', 'age', 'settings'])
    .exec();

  console.log(users2);
  //            ^?
}
```

## Match

The match function takes an object argument representing the matching criteria, and returns the Aggregation instance to allow for further method chaining.

The parameters for the match function are fully typed, providing the user with type safety and guidance when constructing their query.

If no documents match the specified criteria, an empty array will be returned.

```ts twoslash
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
// ---cut---
async () => {
  const users = await DB.user
    .aggregate()
    .match({ $or: [ { name: 'Nab' }, { age: { $gt: 21 } } ] })
    .exec();
}
```

## Lookup

It is a function that can be used to perform a left outer join between two collections. In bridge-mongo, you can use 'lookup' by providing the name of the collection to join with, as well as the `localField` and `foreignField` options to specify which fields to match. The result is an array of documents that includes fields from both collections. 

The lookup function also supports more advanced options, such as `let` and `pipeline`, which can be used to create more complex join conditions. In Bridge-mongo, you can use lookup with both simple and advanced options, depending on your use case.


**Example with foreignField**
```ts twoslash
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
// ---cut---
async () => {
  const blogers = await DB.user
    .aggregate()
    .project({ name: 1 })
    .lookup({ from: 'posts', localField: '_id', foreignField: 'userId' })
    .exec();

  console.log(blogers);
  //            ^?
}
```

**Example with subPipeline**
```ts twoslash
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
// ---cut---
async () => {
  const posts = await DB.post
    .aggregate()
    .project({ userId: 1 })
    .lookup({ from: 'users', let: { userId: '$userId' }, as: 'user' }, (user, { userId }) =>
      user
        .match({ $expr: { $eq: ['$_id', userId] }, age: { $gte: 21 } })
        .project({ name: 1 })
    )
    .exec();

  console.log(posts);
  //            ^?
}
```

## Unwind

It is used to create a new document for each element in an array. This is particularly useful when working with an array of subdocuments or when you want to perform some aggregation on a field that contains an array.

The unwind function can take either a string parameter or an object parameter. 

```ts
Model.aggregate().unwind(string)
// or
Model.aggregate().unwind({
    path: string;
    preserveNullAndEmptyArrays?: true;
    includeArrayIndex?: string;
})
```

**Example**

```ts twoslash
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
// ---cut---
async () => {
  const posts = await DB.post
    .aggregate()
    .project({ userId: 1 })
    .lookup({ from: 'users', let: { userId: '$userId' }, as: 'user' }, (user, { userId }) =>
      user
        .match({ $expr: { $eq: ['$_id', userId] }, age: { $gte: 21 } })
        .project({ name: 1 })
    )
    .unwind('$user')
    .exec();

  console.log(posts);
  //            ^?

  // OR 

  const posts2 = await DB.post
    .aggregate()
    .project({ userId: 1 })
    .lookup({ from: 'users', let: { userId: '$userId' }, as: 'user' }, (user, { userId }) =>
      user
        .match({ $expr: { $eq: ['$_id', userId] }, age: { $gte: 21 } })
        .project({ name: 1 })
    )
    .unwind({ path: '$user', preserveNullAndEmptyArrays: true, includeArrayIndex: 'index' })
    .exec();

  console.log(posts2);
  //            ^?
}
```

## Limit

The limit function is used to specify the maximum number of documents to be included in the output after a pipeline stage. It takes a numeric argument that represents the maximum number of documents to include. It can be used after other pipeline stages such as match and sort to restrict the output to a specific number of documents.

**Example**
```ts twoslash
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
// ---cut---
async () => {
  const posts = await DB.post
    .aggregate()
    .limit(10)
    .exec();
}
```


## Sort

The sort function is used to sort the documents that result from an aggregation pipeline. It takes an object as parameter, where each key represents the field to sort by and its value indicates whether the field should be sorted in ascending or descending order.

**Example**
```ts twoslash
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
// ---cut---
async () => {
  const users = await DB.user
    .aggregate()
    .sort({ name: 1, age: -1 })
    .exec();
}
```

## Exec

Executes the pipeline that has been built using the aggregate framework. This method returns a Promise that resolves to an array of documents that satisfy the query.

**Example:**
```ts twoslash
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
// ---cut---
async () => {
  const users = await DB.user
    .aggregate()
    .match({ name: 'Nab' })
    .exec();

  console.log(users);
  //            ^?
}
```

## Paginate

The paginate function is a special feature of Bridge-mongo that simplifies pagination. It takes two parameters: skip and limit, which correspond to the number of documents to skip and the number of documents to return per page.

Behind the scenes, paginate uses $facet to execute two separate pipelines in a single query. The first pipeline, metadata, returns the total count of documents that match the specified criteria. The second pipeline, data, applies the skip and limit parameters to return the subset of documents to be displayed on the current page.

**Example:**
```ts twoslash
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
// ---cut---
async () => {
  const users = await DB.user
    .aggregate()
    .project({ name: 1 })
    .paginate(0, 10)

  console.log(users);
  //            ^?
}
```

## Coming soon

- Group function
- AddFields function
- ... ?

:::info
Bridge-mongo is constantly evolving and adding new features to provide a fully typed, robust, and easy-to-use interface for interacting with MongoDB. While many essential functions are already implemented, there are still many more features that can be added to meet specific use cases. If you are interested in contributing or discussing features that you'd like to see implemented, you can join the [Bridge-mongo Discord server](https://discord.com/invite/yxjrwm7Bfr) and be a part of the community.
:::

