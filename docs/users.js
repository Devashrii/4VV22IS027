/**

 * @swagger

 * tags:

 *   name: Users

 *   description: User authentication and management

 */


/**

 * @swagger

 * /api/users/register:

 *   post:

 *     summary: Register a new user

 *     description: Creates a new user account.

 *     tags: [Users]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               name:

 *                 type: string

 *                 example: "Ash Ketchum"

 *               email:

 *                 type: string

 *                 example: "ash@pokedex.com"

 *               password:

 *                 type: string

 *                 example: "pikachu123"

 *     responses:

 *       201:

 *         description: User registered successfully

 *       400:

 *         description: User already exists

 */


/**

 * @swagger

 * /api/users/login:

 *   post:

 *     summary: Login a user

 *     description: Authenticates a user and returns a JWT token.

 *     tags: [Users]

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               email:

 *                 type: string

 *                 example: "ash@pokedex.com"

 *               password:

 *                 type: string

 *                 example: "pikachu123"

 *     responses:

 *       200:

 *         description: User logged in successfully

 *       400:

 *         description: Invalid credentials

 *       404:

 *         description: User not found

 */