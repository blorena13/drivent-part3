import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function getHotel(){
    return prisma.hotel.findMany();
}

async function getHotelsRooms(id: number){
    return await prisma.hotel.findFirst({
        where: {
            id: id
        },
        include: {
            Rooms: true,
        }
    });
}

async function getById(id: number){
    const hotels = await prisma.hotel.findFirst({
        where: {
            id: id
        },
        include: {
            Rooms: true,
        }
    });

    return {
        id: hotels.id,
        name: hotels.name,
        image: hotels.image,
        createdAt: hotels.createdAt,
        updatedAt: hotels.updatedAt,
        Rooms: hotels.Rooms.map((room) => ({
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            hotelId: room.hotelId,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt
        }))
    }
}


async function ticketPaid(userId: number){
    return await prisma.ticket.findFirst({
        where:{
            status: 'PAID',
            Enrollment: {
                userId: userId
            }
        },
        include: {
            TicketType: true,
            Enrollment: true,
        }
    })

}

async function ticketRemote(userId: number){
    return await prisma.ticket.findFirst({
        where:{
            Enrollment: {
                userId: userId
            },
            TicketType: {
                isRemote: true
            }
        },
        include: {
            TicketType: true,
            Enrollment: true,
        }
    })

}

async function ticketNotIncludeHotel(userId: number){
    return await prisma.ticket.findFirst({
        where:{
            Enrollment: {
                userId: userId
            },
            TicketType: {
                includesHotel: false
            }
        },
        include: {
            TicketType: true,
            Enrollment: true,
        }
    })

}


const hotelRepository = {
    getHotel,
    getById,
    ticketPaid,
    ticketRemote,
    ticketNotIncludeHotel,
    getHotelsRooms
}

export default hotelRepository;