import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export async function getImovel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/imovel',
    {
      schema: {
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default('0').transform(Number)
        })
      }
    },
    async (req, rep) => {
      const { query, pageIndex } = req.query;
      let filter = {};

      if (query) {
        filter = {
          tomador: {
            nome_razao_social: {
              contains: query.toLowerCase(),
              mode: 'insensitive'
            }
          }
        };
      }

      const [imoveis, total] = await Promise.all([
        prisma.imovel.findMany({
          where: filter,
          take: 10,
          skip: pageIndex * 10
        }),
        prisma.imovel.count({
          where: filter
        })
      ]);

      return rep.send({
        imoveis: imoveis.map((imovel) => {
          return {
            id: imovel.id,
            endereco: imovel.endereco,
            tomadorId: imovel.tomadorId
          };
        }),
        total
      });
    }
  );
}
