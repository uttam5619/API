import { SHA256 } from "crypto-ts";
import { enc } from "crypto-ts";

export function GenerateRequestHash(requestBody:any): string {
    return SHA256(JSON.stringify(requestBody)).toString(enc.Hex);
}