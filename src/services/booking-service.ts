import { Booking, TicketStatus } from "@prisma/client";
import { forbiddenError, notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories/booking-repository";
import {
    enrollmentRepository,
    hotelRepository,
    ticketsRepository
} from "@/repositories";


type BookingId = {
    bookingId: number
};

async function createBooking(roomId: number, userId: number): Promise<BookingId> {
    const { id } = await enrollmentRepository.findWithAddressByUserId(userId);
    const ticket = await ticketsRepository.findTicketByEnrollmentId(id);

    if (ticket == null) throw forbiddenError("Ticket not found");
    if (ticket.TicketType.isRemote) throw forbiddenError("Ticket type is remote");
    if (!ticket.TicketType.includesHotel) throw forbiddenError("Ticket type is not includes hotel");
    if (ticket.status !== TicketStatus.PAID) throw forbiddenError("Ticket is not paid yet");

    const { Rooms: rooms } = await hotelRepository.findRoomsByHotelId(roomId);
    const room = rooms.find(room => room.id === roomId);

    if (room === undefined) throw notFoundError();

    if ((await bookingRepository.findByRoomId(roomId)) != null) {
        throw forbiddenError("Room already reserved");
    }
    // FIXME: validate by count too
    const { id: bookingId } = await bookingRepository.create(roomId, userId);
    return { bookingId };
}

async function findBooking(): Promise<void> {

}

async function updateBooking(): Promise<void> {

}

export const bookingService = {
    createBooking, findBooking, updateBooking
};
