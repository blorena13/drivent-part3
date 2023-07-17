import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { Hotel, Room } from "@prisma/client";

export async function createHotel(){
    return prisma.hotel.create({
        data: {
            createdAt: "2023-07-17T13:36:20.552Z",
            name: faker.name.findName(),
            image: faker.image.city(),
            updatedAt: "2023-07-15T00:05:42.087Z"
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