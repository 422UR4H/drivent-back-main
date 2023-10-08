import { CreateBooking, UpdateBooking } from "@/protocols";
import Joi from "joi";

export const createBookingSchema = Joi.object<CreateBooking>({
    userId: Joi.number().integer().required(),
    roomId: Joi.number().integer().required()
});

export const updateBookingSchema = Joi.object<UpdateBooking>({
    roomId: Joi.number().integer().required()
});
