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
    return prisma.hotel.findMany();
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