const express = require('express');
const user = require('../controllers/authController')
const validate = require('../middleware/validator');
const regiseterSchema = require('../validations/userValidations')
const router = express.Router();
router.post('/register', validate(regiseterSchema), user.register);
/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: User login
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                format: email
 *                example: user@example.com
 *              password:
 *                type: string
 *                format: password
 *                example: Password123!
 *    responses:
 *      200:
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                token:
 *                  type: string
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                user:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    email:
 *                      type: string
 *                    name:
 *                      type: string
 *      400:
 *        description: Invalid credentials
 *      401:
 *        description: Unauthorized
 */
router.post('/login', user.login)

module.exports = router
