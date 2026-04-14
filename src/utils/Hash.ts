import bcrypt from "bcryptjs"


export async function hashThePassword(password:string){
    const hashedPassword = await bcrypt.hash(password,10)
    return hashedPassword
}
