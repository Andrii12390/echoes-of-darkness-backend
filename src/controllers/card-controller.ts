import { NextFunction, Request, Response, Router } from 'express';
import CardService from '../services/card-service';

const cardRouter = Router();
const cardService = new CardService();

cardRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await cardService.getCards();
    res.json(cards).status(200);
  } catch (e) {
    next(e);
  }
});

cardRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageUrl, name, type, lane, strength, description } = req.body;

      if (!imageUrl || !name || !type || !lane || !strength || !description) {
        res.status(400).send('Missing parameters');
      }

      const card = await cardService.addCard(
        imageUrl,
        name,
        type,
        lane,
        description,
        strength
      );

      if (!card) {
        res.status(400).send('Card: error creating card');
      }

      res.json(card).status(200);
    } catch (e) {
      next(e);
    }
  }
);

export default cardRouter;
