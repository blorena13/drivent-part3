import httpStatus from "http-status";
import supertest from "supertest";
import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { cleanDb, generateValidToken } from "../helpers";
import { createHotel, createRoom, getAllHotels } from "../factories/hotels-factory";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser, ticketHotelTrue, ticketRemote, ticketWithoutHotel } from "../factories";
import { TicketStatus } from "@prisma/client";

beforeAll(async ()=> {
    await init();
})

beforeEach(async ()=> {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotel with token invalid', ()=> {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
    })
})

describe('GET /hotels with valid token', () => {

    it('should return 404 if there is no subscription', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 404 if there is no ticket ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
        
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 404 if there is no hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 402 if ticket is unpaid', async () => {
        
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentUser = await createEnrollmentWithAddress(user);
        const newTicketType = await createTicketType();
        const newTicket = await createTicket(enrollmentUser.id ,newTicketType.id, TicketStatus.RESERVED);
        

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        
    });

    it('should return 402 if ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentUser = await createEnrollmentWithAddress(user);
        const newTicket = await ticketRemote();
        const ticket = await createTicket(enrollmentUser.id ,newTicket.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        
    });

    it('should return 402 if ticket does not include hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentUser = await createEnrollmentWithAddress(user);
        const newTicket = await ticketWithoutHotel();
        const ticket = await createTicket(enrollmentUser.id ,newTicket.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        
    });

    it('should return 200 with all hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentUser = await createEnrollmentWithAddress(user);
        const newTicketType = await ticketHotelTrue();
        const newTicket = await createTicket(enrollmentUser.id ,newTicketType.id, TicketStatus.PAID);

        const hotels1 = await createHotel();
        const hotels2 = await createHotel();
        const allHotels = await getAllHotels();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(allHotels);
    });
})

describe('GET /hotels/:hotelId with valid token',() => {

    it('should return 404 if there is no subscription', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);;
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 404 if there is no ticket ', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
        
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 404 if there is no hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });


    it('should return 402 if ticket is unpaid', async () => {
        
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentUser = await createEnrollmentWithAddress(user);
        const newTicketType = await createTicketType();
        const newTicket = await createTicket(enrollmentUser.id ,newTicketType.id, TicketStatus.RESERVED);
        

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        
    });

    it('should return 402 if ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentUser = await createEnrollmentWithAddress(user);
        const newTicket = await ticketRemote();
        const ticket = await createTicket(enrollmentUser.id ,newTicket.id, TicketStatus.PAID);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        
    });

    it('should return 402 if ticket does not include hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentUser = await createEnrollmentWithAddress(user);
        const newTicket = await ticketWithoutHotel();
        const ticket = await createTicket(enrollmentUser.id ,newTicket.id, TicketStatus.PAID);

        const response = await server.get(`/hotels/:hotelId`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        
    });


    it('should return 404 if hotel is not found', async () => {
        const token = await generateValidToken();
        const response = await server.get('/hotels/99999').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 200 with hotel and rooms', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollmentUser = await createEnrollmentWithAddress(user);
        const newTicket = await ticketHotelTrue();
        const ticket = await createTicket(enrollmentUser.id ,newTicket.id, TicketStatus.PAID);

        const hotel = await createHotel();
        const hotelId = hotel.id;
        const room = await createRoom(hotelId);

        const response = await server.get(`/hotels/${hotelId}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
                expect.objectContaining({
                    id: hotel.id,
                    name: hotel.name,
                    image: hotel.image,
                    createdAt: hotel.createdAt.toISOString(),
                    updatedAt: hotel.updatedAt.toISOString(),
                    Rooms: [
                        {
                            id: room.id,
                            name: room.name,
                            capacity: room.capacity,
                            hotelId: room.hotelId,
                            createdAt: room.createdAt.toISOString(),
                            updatedAt: room.updatedAt.toISOString()
                        }
                    ]
                })
        )
        
    });
})



