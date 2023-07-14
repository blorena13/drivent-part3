import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import hotelService from "../services/hotel-service";

async function getHotels(req: AuthenticatedRequest, res: Response){
    const userId = req.userId;
    
        const hotels = await hotelService.getHotel(userId);
        return res.status(httpStatus.OK).send(hotels);
    
}

async function getHotelById(req: AuthenticatedRequest, res: Response){
    const hotelId = req.params.hotelId;
    const userId = req.userId;
    
        const hotel = await hotelService.getHotelById(Number(hotelId), userId);
        return res.status(httpStatus.OK).send(hotel);
    
}

const hotelContoller = {
    getHotels,
    getHotelById
}

export default hotelContoller;