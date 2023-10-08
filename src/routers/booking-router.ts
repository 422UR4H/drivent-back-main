import { Router } from "express";
import { InputBooking } from "@/protocols";
import { authenticateToken, validateBody } from "@/middlewares";
import { createOrUpdateBookingSchema } from "@/schemas";
import { getBooking, postBooking, putBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();
bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBooking)
    .post('/', validateBody<InputBooking>(createOrUpdateBookingSchema), postBooking)
    .put('/', validateBody<InputBooking>(createOrUpdateBookingSchema), putBooking);

export default bookingRouter;
