import request from 'supertest';
import { app } from '../../src/index'; // Adjust the path to your app
import { prisma } from '../../src/routes/user'; // Adjust the path to your Prisma client

let todoID: number;

describe('Create a new todo POST: /todo', () => {
    let token: string;

    beforeAll(async () => {
        // Sign in and get the token
        const response = await request(app)
            .post('/user/signin')
            .send({
                email: 'dhitalsusan99@gmail.com',
                password: 'SecurePassword@123',
            });

        token = response.body.data;

    });

    it('should create a new todo successfully', async () => {
        const response = await request(app)
            .post('/todo/')
            .set('authorization', `Bearer ${token}`)
            .send({
                title: 'Test Todo',
                description: 'This is a test todo',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Todo created successfully');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('title', 'Test Todo');
        expect(response.body.data).toHaveProperty('description', 'This is a test todo');
        todoID = response.body.data.id;
    });

    it('should return a validation error for invalid input', async () => {
        const response = await request(app)
            .post('/todo/')
            .set('authorization', `Bearer ${token}`)
            .send({
                title: '', // Invalid title
                description: '', // Invalid description
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Validation error');
    });

    it('should return an unauthorized error if no token is provided', async () => {
        const response = await request(app)
            .post('/todo/')
            .send({
                title: 'Another Test Todo',
                description: 'This is another test todo',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Please provide a valid token');
    });
});

describe('Get All todos  GET: /todo', () => {
    let token: string;
    beforeAll(async () => {
        // Sign in and get the token
        const response = await request(app)
            .post('/user/signin')
            .send({
                email: 'dhitalsusan99@gmail.com',
                password: 'SecurePassword@123',
            });

        token = response.body.data;

    });

    it('should return all todos', async () => {
        const response = await request(app)
            .get('/todo')
            .set('authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.length).toBeGreaterThan(0);
    });

});


describe('Update a todo PUT: /todo/:id', () => {
    let token: string;
    beforeAll(async () => {
        // Sign in and get the token
        const response = await request(app)
            .post('/user/signin')
            .send({
                email: 'dhitalsusan99@gmail.com',
                password: 'SecurePassword@123',
            });

        token = response.body.data;

    });

    it('should update a todo', async () => {
        const response = await request(app)
            .put(`/todo/${todoID}`)
            .set('authorization', `Bearer ${token}`)
            .send({
                completed: true
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Todo updated successfully');
        expect(response.body.data).toHaveProperty('title');
        expect(response.body.data).toHaveProperty('description');
        expect(response.body.data).toHaveProperty('completed');
    });

})