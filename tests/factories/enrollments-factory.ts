import faker from '@faker-js/faker';
import { generateCPF, getStates } from '@brazilian-utils/brazilian-utils';
import { User } from '@prisma/client';
import { createUser, randomUser } from './users-factory';
import { prisma } from '@/config';
import { EnrollmentWithAddress } from '@/protocols';

export async function createEnrollmentWithAddress(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.enrollment.create({
    data: {
      name: faker.name.findName(),
      cpf: generateCPF(),
      birthday: faker.date.past(),
      phone: faker.phone.phoneNumber('(##) 9####-####'),
      userId: incomingUser.id,
      Address: {
        create: {
          street: faker.address.streetName(),
          cep: faker.address.zipCode(),
          city: faker.address.city(),
          neighborhood: faker.address.city(),
          number: faker.datatype.number().toString(),
          state: faker.helpers.arrayElement(getStates()).name,
        },
      },
    },
    include: {
      Address: true,
    },
  });
}

export async function randomEnrollmentWithAddress(user?: User): Promise<EnrollmentWithAddress> {
  const incomingUser = user || (await randomUser());
  const enrollmentId = faker.datatype.number({ min: 1 });

  return {
    id: enrollmentId,
    name: faker.name.findName(),
    cpf: generateCPF(),
    birthday: faker.date.past(),
    phone: faker.phone.phoneNumber('(##) 9####-####'),
    userId: incomingUser.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    Address: [{
      id: faker.datatype.number({ min: 1 }),
      street: faker.address.streetName(),
      cep: faker.address.zipCode(),
      city: faker.address.city(),
      neighborhood: faker.address.city(),
      addressDetail: faker.lorem.sentence(),
      number: faker.datatype.number().toString(),
      state: faker.helpers.arrayElement(getStates()).name,
      enrollmentId,
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  };
}

export function createhAddressWithCEP() {
  return {
    logradouro: 'Avenida Brigadeiro Faria Lima',
    complemento: 'de 3252 ao fim - lado par',
    bairro: 'Itaim Bibi',
    cidade: 'São Paulo',
    uf: 'SP',
  };
}
