import { Router } from "express";
import { BookingParam, InputBooking } from "@/protocols";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { bookingIdSchema, createOrUpdateBookingSchema } from "@/schemas";
import { getBooking, postBooking, putBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();
bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', validateBody<InputBooking>(createOrUpdateBookingSchema), postBooking)
    .put('/:bookingId', validateBody<InputBooking>(createOrUpdateBookingSchema), validateParams<BookingParam>(bookingIdSchema), putBooking);

export default bookingRouter;
