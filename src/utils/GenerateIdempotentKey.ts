import { v4 as uuidv4 } from 'uuid'


export function GenerateIdempotentKey(){
    const idempotentKey = uuidv4()
    return idempotentKey
}