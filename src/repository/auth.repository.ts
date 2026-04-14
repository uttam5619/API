import { User } from "../db/models/user.model.js";
import { ServerError } from "../utils/Error.js";

export async function SignUpRepository(data:any){
    
    const newUser = await User.create(data)
    if(!newUser){
        throw new ServerError(500,'Failed to register the user')
    }

    const userData = newUser.get();

    const user={
        id: userData.id,
        email: userData.email,
        role: userData.role,
        is_verified: userData.is_verified
    }
    return user
}