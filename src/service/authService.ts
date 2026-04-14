import { ServerError } from "../utils/Error.js"
import { SignUpRepository } from "../repository/auth.repository.js"
import { hashThePassword } from "../utils/Hash.js"
import type { UserDataAttributes } from "../utils/interface.js"


export async function SignUpService(data:UserDataAttributes){

  //Extracting the password from the user data
  const password= data.password

  //Hashing the password before saving it into the database
  const hashedPassword= await hashThePassword(password)

  //Embedding the hashed password in the user data
  data.password= hashedPassword

  const newUser = await SignUpRepository(data)
  return newUser
}