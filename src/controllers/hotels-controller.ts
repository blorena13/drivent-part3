import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import hotelService from "../services/hotel-service";

async function getHotels(req: AuthenticatedRequest, res: Response){
    const userId = req.userId;
    try{
        const hotels = await hotelService.getHotel(userId);
        return res.status(httpStatus.OK).send(hotels);
    } catch(err){
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

async function getHotelById(req: AuthenticatedRequest, res: Response){
    const hotelId = req.params;
    const userId = req.userId;
    try{
        const hotel = await hotelService.getHotelById(Number(hotelId), userId);
        return res.status(httpStatus.OK).send(hotel);
    } catch(err){
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}

const hotelContoller = {
    getHotels,
    getHotelById
}

export default hotelContoller;