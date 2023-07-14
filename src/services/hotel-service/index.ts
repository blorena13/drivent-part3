import { notFoundError, paymentRequiredError } from "../../errors";
import enrollmentRepository from "../../repositories/enrollment-repository";
import hotelRepository from "../../repositories/hotel-repository";

async function getHotel(userId: number){

    const userWithPaymentTrue = await enrollmentRepository.getUserPaymentTrue(userId);
    if(!userWithPaymentTrue || !userWithPaymentTrue.Ticket || userWithPaymentTrue.Ticket.length === 0){
        throw notFoundError();
    }

    const paidTicket = await hotelRepository.ticketPaid(userId);
    if(!paidTicket){
        throw paymentRequiredError();
    }

    const hotels = await hotelRepository.getHotel();
    if(hotels.length === 0){
        throw notFoundError();
    }
    return hotels;
}


async function getHotelById(hotelId: number, userId: number){

    const userWithPaymentTrue = await enrollmentRepository.getUserPaymentTrue(userId);
    if(!userWithPaymentTrue || !userWithPaymentTrue.Ticket || userWithPaymentTrue.Ticket.length === 0){
        throw notFoundError();
    }

    const hotel = await hotelRepository.getById(hotelId);
    return hotel;
}

const hotelService = {
    getHotel,
    getHotelById
}

export default hotelService;