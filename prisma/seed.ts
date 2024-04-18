import { Type } from '@prisma/client';
import { prisma } from '../src/lib/prisma';
import { faker } from '@faker-js/faker';

async function seed() {
  for (let i = 0; i < 30; i++) {
    await prisma.tomador.create({
      data: {
        type: faker.helpers.enumValue(Type),
        cpf_cnpj: faker.string.uuid(),
        nome_razao_social: faker.person.fullName(),
        logradouro: faker.location.streetAddress(),
        bairro: faker.location.county(),
        cod_cidade: 8773,
        cep: faker.location.zipCode(),
        email: faker.internet.email()
      }
    });
  }

  for (let i = 0; i < 120; i++) {
    await prisma.imovel.create({
      data: {
        cod_loc: 8773,
        endereco: faker.location.streetAddress(),
        tomadorId: faker.number.int({ min: 1, max: 30 })
      }
    });
  }
}

seed().then(() => {
  console.log('Database seeded!');
  prisma.$disconnect();
});
