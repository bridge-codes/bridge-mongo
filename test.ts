import { createDB, Schema, mongoose } from './source';

const userSchema = new Schema(
  {
    name: String,
  },
  { timestamps: true },
);

const testSchema = new Schema(
  {
    sf: { type: Number, required: true },
    ahoui: [String],
    df: { type: Date, default: new Date(), unique: true },
    lolilo: String,
    buffer: Buffer,
    age: Boolean,
    oh: Object,
    normal: {
      vla: String,
    },
    test: {
      type: {
        ahoui: { type: Number },
      },
      //   required: true,
    },
  },
  { timestamps: true },
);

const DB = createDB({
  user: userSchema,
  test: testSchema,
});

async () => {
  const res = DB.test.modelInterface;

  const config = DB.test.configInterface;

  const test = DB.test.create({ sf: 78 });

  const user = DB.test.findOne({}, { age: 1 });

  type OJHK = typeof user;

  DB.user.mongooseModel.create({ name: 'df' });

  const dsf = await DB.test.findOne({ age: "'df" }, { ahoui: 1, age: 1 });

  // // type Plurial<T extends string> = T extends `${string}${'s' | 'sh' | 'ch' | 'x' | 'z'}`
  // //   ? `${T}es`
  // //   : `${T}s`;

  // // type Result = Plurial<'chevals'>; // 'a'

  const ess = DB.user.mongooseModel.create({ name: 'YO' }).then(async (res) => {
    res.name = 'NON';

    await res.save();
  });
};
