import faker from '@faker-js/faker';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { TicketWithType } from '@/protocols';

export async function createTicketType(isRemote?: boolean, includesHotel?: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote !== undefined ? isRemote : faker.datatype.boolean(),
      includesHotel: includesHotel !== undefined ? includesHotel : faker.datatype.boolean(),
    },
  });
}

export function randomTicketType(isRemote = faker.datatype.boolean(), includesHotel = faker.datatype.boolean()): TicketType {
  return {
    id: faker.datatype.number({ min: 1 }),
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote,
    includesHotel,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}

export function randomTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus): Ticket {
  return {
    id: faker.datatype.number({ min: 1 }),
    ticketTypeId,
    enrollmentId,
    status: status,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}
