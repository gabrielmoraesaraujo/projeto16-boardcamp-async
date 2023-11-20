import { Router } from 'express';
import { getGames, createGame } from '../Controllers/controller.games.js';
import { validateSchema } from '../Middlewares/vlidateSchema.js';
import { gameSchema } from '../Schemas/gamesSchema.js';



const gamesRouter = Router()



gamesRouter.get("/games", getGames)
gamesRouter.post("/games", validateSchema(gameSchema), createGame)

export default gamesRouter
