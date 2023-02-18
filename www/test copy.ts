//

import { createDB, Schema, mongoose } from 'bridge-mongo';

const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, default: 18 },
  settings: { isActive: Boolean },
});

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Types.ObjectId, req: true },
  },
  { timestamps: true },
);

const { user } = createDB({
  User: userSchema,
  Post: postSchema,
});

async () => {
  // Retrieve all users with their first post
  const users = await user
    .aggregate()
    .project({ name: 1 })
    .lookup(
      { from: 'posts', let: { userId: '$_id' }, as: 'firstPost' },
      (post, { userId }) =>
        post
          .match({ $expr: { $eq: ['$userId', userId] } })
          .sort({ createdAt: 1 })
          .limit(1),
    )
    .unwind('$firstPost')
    .exec();
};
