const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

import authRouter from './routes/authRouter';
import productsRouter from './routes/productsRouter';

const PORT = process.env.port || 5000;
const app = new express();

const corsOptions = {
  /* TODO: enter your frontend host */
  origin: 'http://localhost:63342',
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/auth', authRouter);
app.use('/products', productsRouter);

const start = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://<username>:<password>@cluster0.ksjww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    );
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
