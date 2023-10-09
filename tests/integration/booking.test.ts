import app, { init } from "@/app"
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketType, createUser } from "../factories";
import jwt from "jsonwebtoken";
import { TicketStatus } from "@prisma/client";
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory";
import { createBooking } from "../factories/booking-factory";
import { bookingRepository } from "@/repositories/booking-repository";
import { OutputBooking } from "@/protocols";


const server = supertest(app);

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

describe("POST /booking", () => {
    it('should respond with status 401 if no token is given', async () => {
        const { status } = await server.post('/booking').send({ roomId: 1 });
        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const { status } = await server
            .post('/booking')
            .send({ roomId: 1 })
            .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const { id: userId } = await createUser();

        const token = jwt.sign({ userId }, process.env.JWT_SECRET);
        const { status } = await server
            .post('/booking')
            .send({ roomId: 1 })
            .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it("should respond with status 403 when user does not have an enrollment", async () => {
            const token = await generateValidToken();
            const { status } = await server
                .post('/booking')
                .send({ roomId: 1 })
                .set('Authorization', `Bearer ${token}`);

            expect(status).toBe(httpStatus.FORBIDDEN);
        });

        it("should respond with status 403 when user does not have a ticket", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const { status } = await server
                .post('/booking')
                .send({ roomId: 1 })
                .set('Authorization', `Bearer ${token}`);

            expect(status).toBe(httpStatus.FORBIDDEN);
        });

        it("should respond with status 404 when roomId does not exist", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const { status } = await server
                .post('/booking')
                .send({ roomId: 1 })
                .set('Authorization', `Bearer ${token}`);

            expect(status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 403 when room does not available", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const user2 = await createUser();
            const enrollment2 = await createEnrollmentWithAddress(user2);
            const ticket2 = await createTicket(enrollment2.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket2.id, ticketType.price);
            await createBooking(user2.id, room.id);

            const { status } = await server
                .post('/booking')
                .send({ roomId: room.id })
                .set('Authorization', `Bearer ${token}`);

            expect(status).toBe(httpStatus.FORBIDDEN);
        });

        it("should respond with status code 200 and bookingId", async () => {
            const user = await createUser();
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const { status, body } = await server
                .post('/booking')
                .send({ roomId: room.id })
                .set('Authorization', `Bearer ${token}`);

            expect(status).toBe(httpStatus.OK);
            expect(body).toEqual({
                bookingId: expect.any(Number)
            });
        });
    });
});

describe("GET /booking", () => {
    it('should respond with status 401 if no token is given', async () => {
        const { status } = await server.get('/booking');
        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const { status } = await server
            .get('/booking')
            .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const { id: userId } = await createUser();

        const token = jwt.sign({ userId }, process.env.JWT_SECRET);
        const { status } = await server
            .get('/booking')
            .set('Authorization', `Bearer ${token}`);

        expect(status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it("should respond with status 404 when user does not have a booking", async () => {
            const token = await generateValidToken();
            const { status } = await server
                .get('/booking')
                .set('Authorization', `Bearer ${token}`);

            expect(status).toBe(httpStatus.NOT_FOUND);
        });

        it("should respond with status 200, bookingId and room", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);
            const booking = await createBooking(user.id, room.id);

            const result = await server
                .get('/booking')
                .set('Authorization', `Bearer ${token}`);

            const body = result.body as OutputBooking;
            const { status } = result;

            expect(status).toBe(httpStatus.OK);
            expect(body).toEqual({
                id: booking.id,
                Room: {
                    id: room.id,
                    name: room.name,
                    capacity: room.capacity,
                    hotelId: room.hotelId,
                    createdAt: room.createdAt.toISOString(),
                    updatedAt: room.updatedAt.toISOString()
                }
            });
        });
    });
});
