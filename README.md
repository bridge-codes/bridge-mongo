# Bridge-Mongo

A fully typed mongodb ORM, based on mongoose. The project is under active development

<h2> <img src="/img/question2.svg" height="20" /> What is Bridge-Mongo? </h2>

Bridge-Mongo is meant to be a type-safe ORM built on top of Mongoose. The main focus is be to provide a synthax as close as possible to mongoose, while providing full type-safety and auto-completion throughout all operations.

<img src="/img/bridge-mongo-gif.gif" />

<h2> <img src="/img/development2.svg" height="20"/> Development </h2>

To follow the development or contribute, join [the Discord](https://discord.gg/yxjrwm7Bfr) server.

- [x] Models
- [x] CRUD
- [ ] Populate
- [ ] Aggregate

<h2> <img src="/img/contributing.svg" height="20" /> Contributing </h2>

If you want any guidance whatsoever with the contribution, don't hesitate to reach out [on Discord](https://discord.gg/yxjrwm7Bfr)!

<h2> <img src="/img/installation.svg" height="20" /> Installation </h2>

You can use your favorite package manager to install **Bridge-Mongo**.

```
npm i bridge-mongo
```

### Example

```ts
import { isError, Schema, mongoose, createDB } from 'bridge-mongo';

const user = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: Number,
    additionnalInformation: {
      likeAnimals: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

const DB = createDB({
  user,
});

async function create() {
  DB.user.create({
    email: 'dave@bridge.codes',
    name: 'Dave',
  });
}
```
