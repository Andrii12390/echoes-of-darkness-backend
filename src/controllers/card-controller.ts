import { Request, Response, Router } from 'express';
import CardService from '../services/card-service';

const cardRouter = Router();
const cardService = new CardService();

cardRouter.get('/', async (req: Request, res: Response) => {
  try {
    const cards = await cardService.getCards();
    res.json(cards).status(200);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

cardRouter.post('/', async (req: Request, res: Response) => {
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
      res.status(400).send('Error creating card');
    }

    res.json(card).status(200);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

export default cardRouter;
