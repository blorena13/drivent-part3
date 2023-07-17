import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Hotel, Room } from "@prisma/client";

export async function createHotel(){
    return prisma.hotel.create({
        data: {
            name: faker.name.findName(),
            image: faker.image.city(),
        }
    })
}

export async function getAllHotels(){
    const hotels = prisma.hotel.findMany();

    return  (await hotels).map((hotel)=> ({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: hotel.createdAt.toISOString(),
        updatedAt: hotel.updatedAt.toISOString()
    }))
}

export async function createRoom(id: number){
    return prisma.room.create({
        data: {
            name: faker.name.findName(),
            capacity: 5,
            hotelId: id
        }
    })
}