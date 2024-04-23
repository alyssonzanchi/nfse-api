import { FastifyRequest } from 'fastify';
import { BadRequest } from '../routes/_erros/bad-request';

export async function verifyJwt(req: FastifyRequest) {
  try {
    await req.jwtVerify();
  } catch (err) {
    throw new BadRequest('Informe o token de acesso!');
  }
}
