import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../middlewares/JWTAuth';

export async function checkToken(app: FastifyInstance) {
  app.get('/check-token', { onRequest: [verifyJwt] }, async (req, res) => {
    res.send({ valid: true });
  });
}
