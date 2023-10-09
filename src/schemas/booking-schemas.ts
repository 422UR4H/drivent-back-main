import { BookingParam, InputBooking } from "@/protocols";
import Joi from "joi";

export const createOrUpdateBookingSchema = Joi.object<InputBooking>({
    roomId: Joi.number().integer().required()
});

export const bookingIdSchema = Joi.object<BookingParam>({
    bookingId: Joi.number().integer().required()
});

