import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';

export async function getTomador(app: FastifyInstance) {
  app.get('/tomador', async (req, rep) => {
    const tomadores = await prisma.tomador.findMany();

    return rep.send(tomadores);
  });
}
