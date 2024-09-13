import { z } from 'zod';

const UserValidator = z.object({
  id: z.string().regex(/^\d+$/).transform(Number).optional(),
  username: z.string(),
  mail: z.string().email(),
  fullname: z.string(),
  dateOfBirth: z.string().transform(Date),
  password: z.string(),
})

const UserCredentialValidator = z.object({
  username: z.string(),
  password: z.string(),
  keepLogin: z.enum(['true', 'false']).transform((value) => value === 'true')
});

const UserSchema = {
  UserValidator,
  UserCredentialValidator
}

export default UserSchema;
module.exports = UserSchema;