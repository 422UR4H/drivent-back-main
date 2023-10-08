import { AuthenticatedRequest } from "@/middlewares";
import { InputBooking } from "@/protocols";
import { bookingService } from "@/services";
import { Response } from "express";

export async function postBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { roomId } = req.body as InputBooking;
    const { userId } = req;
    const result = await bookingService.createBooking(roomId, userId);

    res.send(result);
}

export async function getBooking(req: AuthenticatedRequest, res: Response): Promise<void> {

}

export async function putBooking(req: AuthenticatedRequest, res: Response): Promise<void> {

}
