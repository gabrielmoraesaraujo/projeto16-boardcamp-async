import { Router } from "express"
import boardRouter from "./routesGames.js"

const router = Router()

router.use(boardRouter)

export default router