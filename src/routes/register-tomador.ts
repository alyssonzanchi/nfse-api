import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function registerTomador(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/tomador',
    {
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
      } = req.body;

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
