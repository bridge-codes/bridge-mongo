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

async () => {
  const user = await DB.user.create({ name: 'Salut', job: 'developer' });
};
