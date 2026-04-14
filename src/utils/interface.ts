export interface IdempotentKeyAttributes {
    id: number;
    idempotent_key: string;
    user_id: string;
    request_method: string;
    endpoint: string;
    request_hash: string;
}


export interface UserDataAttributes{
    id?: number,
    name?:string,
    email:string,
    password:string,
    phone?:string,
    role?:string,
    token_version?:number,
    is_deleted?:Date
    is_verified?:boolean
}