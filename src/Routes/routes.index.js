import { Router } from "express"
import gamesRouter from "./routesGames.js"
import rentalsRouter from "./routes.retals.js"
import customersRouter from "./routes.customers.js"

const router = Router()

router.use(gamesRouter)
router.use(rentalsRouter)
router.use(customersRouter)

export default router