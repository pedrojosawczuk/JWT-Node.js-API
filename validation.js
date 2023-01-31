// Validation
const Joi = require('@hapi/joi')

const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    })
    return schema.validate(data)
}

const loginValitation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValitation = loginValitation