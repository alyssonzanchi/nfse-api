import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { verifyJwt } from '../middlewares/JWTAuth';
import { Type } from '@prisma/client';

export async function registerTomador(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/tomador',
    {
      onRequest: [verifyJwt],
      schema: {
        body: z.object({
          type: z.enum(['F', 'J']),
          cpf_cnpj: z.string(),
          nome_razao_social: z.string(),
          logradouro: z.string(),
          bairro: z.string(),
          cod_cidade: z.number().int(),
          cep: z.string(),
          email: z.string().email().nullish()
        })
      }
    },
    async (req, rep) => {
      const {
        type,
        cpf_cnpj,
        nome_razao_social,
        logradouro,
        bairro,
        cod_cidade,
        cep,
        email
      } = req.body as {
        type: Type;
        cpf_cnpj: string;
        nome_razao_social: string;
        logradouro: string;
        bairro: string;
        cod_cidade: number;
        cep: string;
        email: string;
      };

      const tomador = await prisma.tomador.create({
        data: {
          type,
          cpf_cnpj,
          nome_razao_social,
          logradouro,
          bairro,
          cod_cidade,
          cep,
          email
        }
      });

      return rep.status(201).send({ tomador });
    }
  );
}
