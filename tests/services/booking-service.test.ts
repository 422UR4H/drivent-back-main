import { init } from "@/app"
import { cleanDb } from "../helpers";
import { enrollmentRepository, hotelRepository, ticketsRepository } from "@/repositories";
import { randomEnrollmentWithAddress, randomTicket, randomTicketType } from "../factories";
import { TicketStatus } from "@prisma/client";
import { bookingService } from "@/services";
import { forbiddenError } from "@/errors";
import { randomRoom } from "../factories/hotels-factory";
import { bookingRepository } from "@/repositories/booking-repository";
import { randomBooking } from "../factories/booking-factory";


beforeAll(async () => {
    await init();
    await cleanDb();
});

describe('createBooking', () => {
    it('should throw 403 status when ticket type is remote', async () => {
        const enrollment = await randomEnrollmentWithAddress();
        const ticketType = randomTicketType(true, true);
        const ticket = randomTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        jest
            .spyOn(enrollmentRepository, "findWithAddressByUserId")
            .mockResolvedValueOnce(enrollment);

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockResolvedValueOnce({ ...ticket, TicketType: ticketType });

        const result = bookingService.create(1, enrollment.userId);
        expect(result).rejects.toEqual(forbiddenError("Ticket type is remote"));
    });

    it('should throw 403 status when ticket type without includes hotel', async () => {
        const enrollment = await randomEnrollmentWithAddress();
        const ticketType = randomTicketType(false, false);
        const ticket = randomTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        jest
            .spyOn(enrollmentRepository, "findWithAddressByUserId")
            .mockResolvedValueOnce(enrollment);

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockResolvedValueOnce({ ...ticket, TicketType: ticketType });

        const result = bookingService.create(1, enrollment.userId);
        expect(result).rejects.toEqual(forbiddenError("Ticket type is not includes hotel"));
    });

    it('should throw 403 status when ticket type is not PAID yet', async () => {
        const enrollment = await randomEnrollmentWithAddress();
        const ticketType = randomTicketType(false, true);
        const ticket = randomTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        jest
            .spyOn(enrollmentRepository, "findWithAddressByUserId")
            .mockResolvedValueOnce(enrollment);

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockResolvedValueOnce({ ...ticket, TicketType: ticketType });

        const result = bookingService.create(1, enrollment.userId);
        expect(result).rejects.toEqual(forbiddenError("Ticket is not paid yet"));
    });

    it('should return status 200 and bookingId when ticket type is not remote, includes hotel and have PAID', async () => {
        const enrollment = await randomEnrollmentWithAddress();
        const ticketType = randomTicketType(false, true);
        const ticket = randomTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const room = randomRoom();
        const booking = randomBooking();

        jest
            .spyOn(enrollmentRepository, "findWithAddressByUserId")
            .mockResolvedValueOnce(enrollment);

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockResolvedValueOnce({ ...ticket, TicketType: ticketType });

        jest
            .spyOn(hotelRepository, "findRoomById")
            .mockResolvedValueOnce(room);

        jest
            .spyOn(bookingRepository, "findByRoomId")
            .mockResolvedValueOnce(null);

        jest
            .spyOn(bookingRepository, "create")
            .mockResolvedValueOnce(booking);

        const result = await bookingService.create(1, enrollment.userId);
        expect(result).toEqual({ bookingId: booking.id });
    });
});

describe('updateBooking', () => {
    it('should throw 403 status when ticket type is remote', async () => {
        const enrollment = await randomEnrollmentWithAddress();
        const ticketType = randomTicketType(true, true);
        const ticket = randomTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        jest
            .spyOn(enrollmentRepository, "findWithAddressByUserId")
            .mockResolvedValueOnce(enrollment);

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockResolvedValueOnce({ ...ticket, TicketType: ticketType });

        const result = bookingService.update(1, enrollment.userId);
        expect(result).rejects.toEqual(forbiddenError("Ticket type is remote"));
    });

    it('should throw 403 status when ticket type without includes hotel', async () => {
        const enrollment = await randomEnrollmentWithAddress();
        const ticketType = randomTicketType(false, false);
        const ticket = randomTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        jest
            .spyOn(enrollmentRepository, "findWithAddressByUserId")
            .mockResolvedValueOnce(enrollment);

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockResolvedValueOnce({ ...ticket, TicketType: ticketType });

        const result = bookingService.update(1, enrollment.userId);
        expect(result).rejects.toEqual(forbiddenError("Ticket type is not includes hotel"));
    });

    it('should throw 403 status when ticket type is not PAID yet', async () => {
        const enrollment = await randomEnrollmentWithAddress();
        const ticketType = randomTicketType(false, true);
        const ticket = randomTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

        jest
            .spyOn(enrollmentRepository, "findWithAddressByUserId")
            .mockResolvedValueOnce(enrollment);

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockResolvedValueOnce({ ...ticket, TicketType: ticketType });

        const result = bookingService.update(1, enrollment.userId);
        expect(result).rejects.toEqual(forbiddenError("Ticket is not paid yet"));
    });

    it('should return status 200 and bookingId when ticket type is not remote, includes hotel and have PAID', async () => {
        const enrollment = await randomEnrollmentWithAddress();
        const ticketType = randomTicketType(false, true);
        const ticket = randomTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const room = randomRoom();
        const booking = randomBooking(enrollment.userId, room.id);
        const newBooking = randomBooking(enrollment.userId);

        jest
            .spyOn(enrollmentRepository, "findWithAddressByUserId")
            .mockResolvedValueOnce(enrollment);

        jest
            .spyOn(ticketsRepository, "findTicketByEnrollmentId")
            .mockResolvedValueOnce({ ...ticket, TicketType: ticketType });

        jest
            .spyOn(hotelRepository, "findRoomById")
            .mockResolvedValueOnce(room);

        jest
            .spyOn(bookingRepository, "findByUserId")
            .mockResolvedValueOnce({ id: booking.id, Room: room });

        jest
            .spyOn(bookingRepository, "findByRoomId")
            .mockResolvedValueOnce(booking);

        jest
            .spyOn(bookingRepository, "update")
            .mockResolvedValueOnce(newBooking);

        const result = await bookingService.update(1, enrollment.userId);
        expect(result).toEqual({ bookingId: newBooking.id });
    });
});