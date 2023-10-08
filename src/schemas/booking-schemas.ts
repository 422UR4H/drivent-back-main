import { InputBooking } from "@/protocols";
import Joi from "joi";

export const createOrUpdateBookingSchema = Joi.object<InputBooking>({
    roomId: Joi.number().integer().required()
});
