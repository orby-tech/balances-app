export const jwtConstants = {
  secret: process.env.JWT_SECRET || Math.random().toString(),
};
