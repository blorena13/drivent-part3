import httpStatus from "http-status";
import supertest from "supertest";
import app from "@/app";
import faker from "@faker-js/faker";
import { cleanDb } from "../helpers";
import { createHotel, createRoom, getAllHotels } from "../factories/hotels-factory";
import { ticketWithoutHotel } from "../factories";

beforeEach(async ()=> {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {

    it('should return 404 if there is no subscription, ticket or hotel', async () => {
        const response = await server.get('/hotels');
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 402 if ticket is unpaid, remote or does not include hotel', async () => {
        const ticket = await ticketWithoutHotel();

        const response = await server.get('/hotels');
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        
    });

    it('should return 200 with all hotels', async () => {
        const hotels1 = await createHotel();
        const hotels2 = await createHotel();
        const allHotels = await getAllHotels();

        const response = await server.get('/hotels');
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(allHotels);
    });

    it('', async () => {
        
    });
})

describe('GET /hotels/:hotelId',() => {

    it('should return 404 if there is no subscription, ticket or hotel', async () => {
        const response = await server.get('/hotels/:id');
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });


    it('should return 402 if ticket is unpaid, remote or does not include hotel', async () => {
        const ticket = await ticketWithoutHotel();

        const response = await server.get('/hotels/:id');
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });


    it('should return 400 if hotelId is not provided', async () => {
        const response = await server.get('/hotels/');
        expect(response.status).toBe(httpStatus.BAD_REQUEST);        
    });

    it('should return 404 if hotel is not found', async () => {
        const response = await server.get('/hotels/99999');
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 200 with hotel and rooms', async () => {

        const hotel = await createHotel();
        const room = await createRoom(hotel.id);

        const response = await server.get(`/hotels/${hotel.id}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    Rooms: [
                        {
                            id: expect.any(Number),
                            name: expect.any(String),
                            capacity: expect.any(Number),
                            hotelId: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String)
                        }
                    ]
                })
            ])
        )
        
    });
})



