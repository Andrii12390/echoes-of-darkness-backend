import express from 'express';
import cardRouter from './controllers/card-controller';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const apiPrefix = '/api/v1';

  const app = express();
  
  app.use(express.json());
  
  dotenv.config();
  
  app.use(`${apiPrefix}/card`, cardRouter);
  
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