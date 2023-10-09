import { prisma } from "@/config";
import { Booking } from "@prisma/client";

function create(roomId: number, userId: number): Promise<Booking> {
    return prisma.booking.create({
        data: { roomId, userId }
    });
}

function findByRoomId(roomId: number): Promise<Booking | null> {
    return prisma.booking.findFirst({
        where: { roomId }
    });
}

function findByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId },
        select: { id: true, Room: true }
    });
}

function update(roomId: number, userId: number) {
    return prisma.booking.update({
        where: { userId },
        data: { roomId }
    });
}

function count(roomId: number) {
    // return prisma.booking.groupBy({=
    //     by: ["roomId"],
    //     _count: { _all: true },
    //     having: { roomId }
    // })

    return prisma.booking.aggregate({
        where: { roomId },
        _count: { _all: true }
    });

    // return prisma.booking.findMany({
    //     where: { roomId },
    //     select: {
    //         id: true,
    //         Room: { select: { capacity: true } }
    //     }
    // });
}

export const bookingRepository = {
    create, findByRoomId, findByUserId, update,
    count
};
