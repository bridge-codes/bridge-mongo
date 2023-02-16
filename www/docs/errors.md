# Error Handling

Error handling is an important aspect of any software development project, and bridge-mongo makes it easy to handle errors that occur while working with the database. Functions in bridge-mongo return an object that includes an error property. To check for errors, you can use the isError function, which checks if the error property is present in the result object.

For example, let's say you are using the Model.findOne(). If no document are found, the result object will include an error property. To handle this error, you can simply check for the error property using isError, and then take appropriate action based on the error.

Here's an example:

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
    const result = await DB.user.findOne({ name: 'Nab' }, { name: 1 });
    //     ^? 

    if (isError(result)) {
        console.error('An error occurred:', result.error);
        //                                          ^?
        // Handle the error appropriately
    } else {
        console.log('Document created successfully:', result);
        //                                              ^?
    }
}
```