import { SHA256 } from "crypto-ts";
import { enc } from "crypto-ts";

export function GenerateRequestHash(user_id:string, email:string): string {

    const normalized = {
      email:email,
      user_id:user_id
    };
  
    return SHA256(JSON.stringify(normalized)).toString(enc.Hex);
}