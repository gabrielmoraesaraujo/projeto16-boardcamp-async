import { Router } from "express"
import { createRental, deleteRental, getRentals, finishRental } from "../Controllers/controller.rentals.js"
import validateSchema from "../Middlewares/vlidateSchema.js"
import { rentalSchema } from "../Schemas/RentalSchema.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateSchema(rentalSchema), createRental)
rentalsRouter.post("/rentals/:id/return", finishRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter