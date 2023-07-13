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


async function ticketPaid(){

}


const hotelRepository = {
    getHotel,
    getById
}

export default hotelRepository;