import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { registerTomador } from './routes/register-tomador';
import {
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod';
import { createImovel } from './routes/create-imovel';
import { sendXML } from './routes/send-xml';
import { getImovel } from './routes/get-imovel';
import { getTomador } from './routes/get-tomador';
import fastifyJwt from '@fastify/jwt';
import { registerUser } from './routes/register-user';
import { loginUser } from './routes/login-user';

const app = fastify();

app.register(fastifyCors, {
  origin: '*'
});

app.register(fastifyJwt, { secret: process.env.SECRET! });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(registerUser);
app.register(loginUser);
app.register(registerTomador);
app.register(createImovel);
app.register(sendXML);
app.register(getImovel);
app.register(getTomador);

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server runing!');
});
