const { Router } = require("express");
const cacheController = require("../controllers/cacheController");

const router = Router();

/**
 * @swagger
 * /cache/stats:
 *   get:
 *     summary: Get cache statistics
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: Cache statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     activeKeys:
 *                       type: number
 *                       example: 5
 *                     expiredKeys:
 *                       type: number
 *                       example: 2
 *                     totalKeys:
 *                       type: number
 *                       example: 7
 */
router.get("/stats", cacheController.getCacheStats);

/**
 * @swagger
 * /cache/flush:
 *   delete:
 *     summary: Clear all cached data
 *     tags: [Cache]
 *     responses:
 *       200:
 *         description: Cache cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cache cleared successfully.
 */
router.delete("/flush", cacheController.flushCache);

module.exports = router;
