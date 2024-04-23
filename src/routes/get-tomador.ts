import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { verifyJwt } from '../middlewares/JWTAuth';

export async function getTomador(app: FastifyInstance) {
  app.get('/tomador', { onRequest: [verifyJwt] }, async (req, rep) => {
    const tomadores = await prisma.tomador.findMany();

    return rep.send(tomadores);
  });
}
