import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { BadRequest } from './routes/_erros/bad-request';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, req, rep) => {
  if (error instanceof ZodError) {
    return rep.status(400).send({
      message: 'Erro de validação!',
      errors: error.flatten().fieldErrors
    });
  }

  if (error instanceof BadRequest) {
    return rep.status(400).send({ message: error.message });
  }

  return rep.status(500).send({ message: 'Erro interno no servidor!' });
};
