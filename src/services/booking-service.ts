import { Booking, TicketStatus } from "@prisma/client";
import { conflictError, forbiddenError, notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories/booking-repository";
import {
    enrollmentRepository,
    hotelRepository,
    ticketsRepository
} from "@/repositories";
import { OutputBooking } from "@/protocols";


type BookingId = {
    bookingId: number
};

async function create(roomId: number, userId: number): Promise<BookingId> {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (enrollment == null) throw forbiddenError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (ticket == null) throw forbiddenError("Ticket not found");
    if (ticket.TicketType.isRemote) throw forbiddenError("Ticket type is remote");
    if (!ticket.TicketType.includesHotel) throw forbiddenError("Ticket type is not includes hotel");
    if (ticket.status !== TicketStatus.PAID) throw forbiddenError("Ticket is not paid yet");

    const room = await hotelRepository.findRoomById(roomId);
    if (room == null) throw notFoundError();

    const result = await bookingRepository.count(roomId);
    if (result._count._all >= room.capacity) {
        throw forbiddenError("Room has already full")
    }
    const { id: bookingId } = await bookingRepository.create(roomId, userId);
    return { bookingId };
}

async function find(userId: number): Promise<OutputBooking> {
    const booking = await bookingRepository.findByUserId(userId);
    if (booking == null) throw notFoundError();
    return booking;
}

async function update(roomId: number, userId: number, bookingId: number): Promise<BookingId> {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (enrollment == null) throw forbiddenError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (ticket == null) throw forbiddenError("Ticket not found");
    if (ticket.TicketType.isRemote) throw forbiddenError("Ticket type is remote");
    if (!ticket.TicketType.includesHotel) throw forbiddenError("Ticket type is not includes hotel");
    if (ticket.status !== TicketStatus.PAID) throw forbiddenError("Ticket is not paid yet");

    const room = await hotelRepository.findRoomById(roomId);
    if (room == null) throw notFoundError();

    const booking = await bookingRepository.findByUserId(userId);
    if (booking == null) throw forbiddenError();

    // FIXME: validate by count
    const result = await bookingRepository.count(roomId);
    if (result._count._all >= room.capacity) {
        throw forbiddenError("Room has already full")
    }
    // if ((await bookingRepository.findByRoomId(roomId)).userId != userId) {
    //     throw forbiddenError("Room already reserved by other user");
    // }
    const { id } = await bookingRepository.update(roomId, userId);
    return { bookingId: id };
}

export const bookingService = {
    create, find, update
};
