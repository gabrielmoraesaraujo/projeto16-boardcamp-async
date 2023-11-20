import joi from "joi"

const joi = joiBase.extend(joiDate)

export const customerSchema = joi.object({
  name: joi.string().trim().required(),
  phone: joi.string().trim().regex(/^\d{10,11}$/).required(),
  cpf: joi.string().trim().length(11).pattern(/^\d+$/).required(),
  birthday: joi.date().iso().required(),
});



