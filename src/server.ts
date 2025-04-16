import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { PrismaClient } from '@prisma/client';

import { errorHandler } from './middlewares/error-handler';

import cardRouter from './controllers/card-controller';
import authRouter from './controllers/auth-controller';
import userRouter from './controllers/user-controller';

const prisma = new PrismaClient();

async function main() {
  const apiPrefix = '/api/v1';

  const app = express();

  const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());

  dotenv.config();

  app.use(`${apiPrefix}/card`, cardRouter);
  app.use(`${apiPrefix}/auth`, authRouter);
  app.use(`${apiPrefix}/user`, userRouter);

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
