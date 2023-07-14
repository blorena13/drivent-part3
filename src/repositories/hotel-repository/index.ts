import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function getHotel(){
    return prisma.hotel.findMany();
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
        createdAt: hotels.createdAt.toISOString(),
        updatedAt: hotels.updatedAt.toISOString(),
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


const hotelRepository = {
    getHotel,
    getById,
    ticketPaid
}

export default hotelRepository;