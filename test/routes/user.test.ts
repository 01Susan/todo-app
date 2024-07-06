import request from 'supertest';
import { app } from '../../src/index'; // Adjust the path to your app
import { prisma } from '../../src/routes/user'; // Adjust the path to your Prisma client
import { hashPassword } from '../../src/services/auth_services'; // Import your password hashing utility
import { generateAuthToken } from '../../src/services/auth_services'; // Import your token generation utility

// describe('POST /user/signup', () => {
//     beforeAll(async () => {
//         await prisma.user.deleteMany();
//     });


//     it('should create a new user successfully', async () => {
//         const response = await request(app)
//             .post('/user/signup')
//             .send({
//                 fullName: 'John Doe',
//                 email: 'johndoe@gmail.com',
//                 password: 'SecurePassword@123',
//             });

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('message', 'User created successfully');
//     });

//     it('should return a validation error for invalid input', async () => {
//         const response = await request(app)
//             .post('/user/signup')
//             .send({
//                 fullName: '',
//                 email: '',
//                 password: '',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('message', 'Validation error');
//     });

//     it('should return a conflict error for existing user', async () => {
//         // First, create the user
//         const response = await request(app)
//             .post('/user/signup')
//             .send({
//                 fullName: 'John Doe',
//                 email: 'johndoe@gmail.com',
//                 password: 'SecurePassword@123'
//             });

//         expect(response.status).toBe(409); // Adjusted based on your logic
//         expect(response.body).toHaveProperty('message', 'User already exists');
//     });
// });

// describe('POST user/signin', () => {
//     let testUser: any; // Variable to hold the test user data

//     beforeAll(async () => {
//         // Create a test user for the signin tests
//         const hashedPassword = await hashPassword('SecurePassword@123'); // Hash a password for testing
//         testUser = await prisma.user.create({
//             data: {
//                 fullName: 'Susan Dhital',
//                 email: 'dhitalsusan99@gmail.com',
//                 password: hashedPassword,
//             },
//         });
//     });

//     afterAll(async () => {
//         // Clean up the database after all tests
//         await prisma.user.deleteMany();
//         await prisma.$disconnect();
//     });

//     it('should log in a user successfully with correct credentials', async () => {
//         const response = await request(app)
//             .post('/user/signin')
//             .send({
//                 email: 'dhitalsusan99@gmail.com',
//                 password: 'SecurePassword@123',
//             });

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('message', 'User logged in successfully');
//         expect(response.body).toHaveProperty('data'); // Assuming your token is returned in 'data'
//     });

//     it('should return a validation error for invalid input', async () => {
//         const response = await request(app)
//             .post('/user/signin')
//             .send({
//                 email: '', // Invalid email
//                 password: '', // Invalid password
//             });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('message', 'Validation error');
//     });

//     it('should return a 404 error for user not found', async () => {
//         const response = await request(app)
//             .post('/user/signin')
//             .send({
//                 email: 'nonexistent@example.com',
//                 password: 'SomePassword@123',
//             });
//         expect(response.status).toBe(404);
//         expect(response.body).toHaveProperty('message', 'User not found');
//     });

//     it('should return a 400 error for invalid password', async () => {
//         const response = await request(app)
//             .post('/user/signin')
//             .send({
//                 email: 'dhitalsusan99@gmail.com',
//                 password: 'WrongPassword@123',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('error', 'Invalid password');
//     });
// });
