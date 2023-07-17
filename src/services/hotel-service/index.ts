import { number } from "joi";
import { notFoundError, paymentRequiredError } from "../../errors";
import enrollmentRepository from "../../repositories/enrollment-repository";
import hotelRepository from "../../repositories/hotel-repository";

async function getHotel(userId: number){

    const userWithPaymentTrue = await enrollmentRepository.getUserPaymentTrue(userId);
    if(!userWithPaymentTrue || userWithPaymentTrue.Ticket.length === 0){
        throw notFoundError();
    }

    const paidTicket = await hotelRepository.ticketPaid(userId);
    const remoteTicket = await hotelRepository.ticketRemote(userId);
    const notIncludesHotel = await hotelRepository.ticketNotIncludeHotel(userId);
    if(!paidTicket || remoteTicket || notIncludesHotel){
        throw paymentRequiredError();
    }

    const hotels = await hotelRepository.getHotel();
    if(hotels.length === 0 || !hotels){
        throw notFoundError();
    }

    return hotels.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString()
    }))
}


async function getHotelById(hotelId: number, userId: number){

    const userWithPaymentTrue = await enrollmentRepository.getUserPaymentTrue(userId);
    if(!userWithPaymentTrue || !userWithPaymentTrue.Ticket || userWithPaymentTrue.Ticket.length === 0){
        throw notFoundError();
    }

    const paidTicket = await hotelRepository.ticketPaid(userId);
    const remoteTicket = await hotelRepository.ticketRemote(userId);
    const notIncludesHotel = await hotelRepository.ticketNotIncludeHotel(userId);
    if(!paidTicket || remoteTicket || notIncludesHotel){
        throw paymentRequiredError();
    }

    const verifyHotelRooms = await hotelRepository.getHotelsRooms(hotelId);
    if(!verifyHotelRooms){
        throw notFoundError();
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