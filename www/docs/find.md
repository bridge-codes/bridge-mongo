# Find Functions

The `filter` object is the same as in Mongoose, so you can write complex filters and benefit from type safety throughout the process.

By default, all the find functions in Bridge-mongo return **lean results**. This means that the documents are plain JavaScript objects instead of full Mongoose documents, resulting in faster queries and less memory usage.

## Model.find()

Model.find() is used to fetch an array of documents from the database that match the given filter. 

```ts
Model.find(filter)
// or
Model.find(filter, projection)
// or
Model.find(filter, projection | undefined, options)
```


### Options

```ts
{
    limit?: number;
    skip?: number;
    sort?: Record<keyof Model, -1 | 1 | 'asc' | 'desc'>;
    session?: ClientSession; // from await conn.startSession()
}
``` 

### Example

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


```ts twoslash
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
// ---cut---
async () => {
    const users = await DB.user.find({ name: 'Nab' });
    //     ^? 
    const posts = await DB.post.find({ likes: { $gt: 10 } }, { likes: 1 });
    //      ^?
}
```

## Model.findOne()

Model.findOne() is used to find the first document that match a specified filter.

```ts
Model.findOne(filter)
// or
Model.findOne(filter, projection)
// or
Model.findOne(filter, projection | undefined, options)
```

### Options

```ts
{
    session?: ClientSession; // from await conn.startSession()
}
``` 

### Example

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

```ts twoslash
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
// ---cut---
async () => {
    const post = await DB.post.findOne({ likes: { $gt: 10 } }, { likes: 1 });
    //      ^?
}
```

## Model.findById()

Model.findById() is used to find the first document that match the objectId given.

```ts
Model.findById(ObjectId)
// or
Model.findById(ObjectId, projection)
// or
Model.findById(ObjectId, projection | undefined, options)
```

### Options

```ts
{
    session?: ClientSession; // from await conn.startSession()
}
``` 

### Example

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

```ts twoslash
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
// ---cut---
import { isError } from 'bridge-mongo';

async () => {
    const user = await DB.user.findOne({});
    if (isError(user)) return

    const post = await DB.post.findById(user._id, { likes: 1 });
    //     ^?
}
```

