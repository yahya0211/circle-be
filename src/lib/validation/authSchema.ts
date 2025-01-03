import Joi from "joi";

/**
 * @opensapi
 * components:
 * schema: Login
 *    LoginUser:
 *        type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *              email:
 *               type: string
 *               format: email
 *              password:
 *                type: string
 *                format: password
 *           example:
 *             email: 4bM4f@example.com
 *             password: password
 *    RegisterUser:
 *         type: object
 *         required:
 *          - username
 *          - fullname
 *          - email
 *          - password
 *         properties:
 *          username:
 *            type: string
 *          fullname:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *            format: password
 *          example:
 *            username: username
 *            fullname: fullname
 *            email: 4bM4f@example.com
 *            password: password
 */

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});

const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username is required.",
  }),
  fullname: Joi.string().required().messages({
    "any.required": "Fullname is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        '^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}$'
      )
    )
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long, contain at least one symbol, and only unique characters.",
      "any.required": "Password is required.",
    }),
});

export default { loginSchema, registerSchema };
