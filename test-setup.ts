import { loadEnv } from './src/loadEnv';

loadEnv();

// const jwtBaseOptions: jwt.SignOptions = {
//   algorithm: JWT_ALGORITHM,
//   issuer: 'batch',
//   subject: 'login',
//   expiresIn: '15y',
// };

// const token = jwt.sign(
//   {
//     email: 'john@doe.com',
//     role: 'donor',
//   },
//   String(JWT_SECRET),
//   jwtBaseOptions,
// );

// console.log(token);
