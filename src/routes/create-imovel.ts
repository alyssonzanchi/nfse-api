import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyJwt } from '../middlewares/JWTAuth';

export async function createImovel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/imovel',
    {
      onRequest: [verifyJwt],
      schema: {
        body: z.object({
          cod_loc: z.number().int(),
          endereco: z.string(),
          tomadorId: z.number().int()
        })
      }
    },
    async (req, rep) => {
      const { cod_loc, endereco, tomadorId } = req.body as {
        cod_loc: number;
        endereco: string;
        tomadorId: number;
      };

      const imovel = await prisma.imovel.create({
        data: {
          cod_loc,
          endereco,
          tomadorId
        }
      });

      return rep.status(201).send({ imovel });
    }
  );
}
