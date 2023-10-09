import { prisma } from '@/config';
import faker from '@faker-js/faker';
import { Booking } from '@prisma/client';

export function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data: { userId, roomId }
    });
}

export function randomBooking(userId?: number, roomId?: number): Booking {
    return {
        id: faker.datatype.number({ min: 1 }),
        userId: userId || faker.datatype.number({ min: 1 }),
        roomId: roomId || faker.datatype.number({ min: 1 }),
        createdAt: new Date(),
        updatedAt: new Date()
    };
}