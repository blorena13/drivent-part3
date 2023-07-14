import { notFoundError, paymentRequiredError } from "../../errors";
import enrollmentRepository from "../../repositories/enrollment-repository";
import hotelRepository from "../../repositories/hotel-repository";

async function getHotel(userId: number){

    const userWithPaymentTrue = await enrollmentRepository.getUserPaymentTrue(userId);
    if(!userWithPaymentTrue || !userWithPaymentTrue.Ticket || userWithPaymentTrue.Ticket.length === 0){
        throw notFoundError();
    }

    const paidTicket = await hotelRepository.ticketPaid(userId);
    const remoteTicket = await hotelRepository.ticketRemote(userId);
    const notIncludesHotel = await hotelRepository.ticketNotIncludeHotel(userId);
    if(!paidTicket || !remoteTicket || !notIncludesHotel){
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

    const paidTicket = await hotelRepository.ticketPaid(userId);
    const remoteTicket = await hotelRepository.ticketRemote(userId);
    if(!paidTicket || !remoteTicket){
        throw paymentRequiredError();
    }

    const hotel = await hotelRepository.getById(hotelId);
    if(!hotel){
        throw notFoundError();
    }
    return hotel;
}

const hotelService = {
    getHotel,
    getHotelById
}

export default hotelService;