import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Room } from '@prisma/client';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 3,
      hotelId: hotelId,
    },
  });
}

export function randomRoom(): Room {
  return {
    id: faker.datatype.number({ min: 1 }),
    name: faker.name.findName(),
    capacity: faker.datatype.number({ min: 1, max: 20 }),
    hotelId: faker.datatype.number({ min: 1 }),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}