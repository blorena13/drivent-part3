import { Router } from "express";
import { authenticateToken } from "../middlewares";
import hotelContoller from "../controllers/hotels-controller";

const hotelRouter = Router();

hotelRouter.get('/', authenticateToken, hotelContoller.getHotels);
hotelRouter.get('/:hotelId', authenticateToken, hotelContoller.getHotelById);

export { hotelRouter };