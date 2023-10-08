import { Router } from "express";
import { CreateBooking, UpdateBooking } from "@/protocols";
import { authenticateToken, validateBody } from "@/middlewares";
import { createBookingSchema, updateBookingSchema } from "@/schemas";
import { getBooking, postBooking, putBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();
bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', validateBody<CreateBooking>(createBookingSchema), postBooking)
    .put('/', validateBody<UpdateBooking>(updateBookingSchema), putBooking);

export default bookingRouter;
