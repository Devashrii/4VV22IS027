/**

 * @swagger

 * tags:

 *   name: Pokemon

 *   description: Operations related to Pokémon

 */


/**

 * @swagger

 * /api/pokemon:

 *   get:

 *     summary: Get all Pokémon

 *     description: Retrieve a list of all Pokémon in the game.

 *     tags: [Pokemon]

 *     responses:

 *       200:

 *         description: A list of Pokémon

 */


/**

 * @swagger

 * /api/pokemon/{id}:

 *   get:

 *     summary: Get a Pokémon by ID

 *     description: Retrieve details of a Pokémon by its ID.

 *     tags: [Pokemon]

 *     parameters:

 *       - in: path

 *         name: id

 *         required: true

 *         schema:

 *           type: integer

 *         example: 1

 *     responses:

 *       200:

 *         description: Pokémon details

 *       404:

 *         description: Pokémon not found

 */
