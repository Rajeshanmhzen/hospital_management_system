import Joi from "joi"

export const registerValidation = Joi.object({
    fullname:Joi.string().min(3).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    role:Joi.string().valid("admin", "doctor", "user").default("user"),
    specialization:Joi.string().allow(""),
});

export const loginValidation = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
});
