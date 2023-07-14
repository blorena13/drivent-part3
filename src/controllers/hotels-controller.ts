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
        if(err.name === 'NotFoundError'){
            return res.sendStatus(httpStatus.NOT_FOUND);
        } else if(err.name === 'PaymentRequiredError'){
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

async function getHotelById(req: AuthenticatedRequest, res: Response){
    const hotelId = req.params.hotelId;
    const userId = req.userId;
    try{
        const hotel = await hotelService.getHotelById(Number(hotelId), userId);
        return res.status(httpStatus.OK).send(hotel);
    } catch(err){
        if(err.name === 'NotFoundError'){
            return res.sendStatus(httpStatus.NOT_FOUND);
        } else if(err.name === 'PaymentRequiredError'){
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        }
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

const hotelContoller = {
    getHotels,
    getHotelById
}

export default hotelContoller;