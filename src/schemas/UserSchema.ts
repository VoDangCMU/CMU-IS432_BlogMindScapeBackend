import { z } from 'zod';
import CommonSchema from './Common';

const FullUserSchema = z.object({
  id: CommonSchema.NumberSchema,
  username: z.string(),
  mail: z.string().email(),
  fullname: z.string(),
  dateOfBirth: CommonSchema.DateSchema,
  password: z.string(),
})

const PasswordlessUserSchema = z.object({
  id: CommonSchema.NumberSchema,
  username: z.string(),
  mail: z.string().email(),
  fullname: z.string(),
  dateOfBirth: CommonSchema.DateSchema,
})

const UserLoginCredentialSchema = z.object({
  username: z.string(),
  password: z.string(),
  keepLogin: z.enum(['true', 'false']).transform((value) => value === 'true')
});

const UserSchema = {
  FullUserSchema,
  UserLoginCredentialSchema,
  PasswordlessUserSchema
}

export default UserSchema;
module.exports = UserSchema;