import { Idempotent_key } from "../db/models/idempotent_key.model.js";
import type { Request,Response, NextFunction } from "express";
import { GenerateIdempotentKey } from "../utils/GenerateIdempotentKey.js";
import { GenerateRequestHash } from "../utils/crypto.js";
import { GenericError, ResourceNotFoundError, ServerError } from "../utils/Error.js";

export async function IdempotentRequest(req:Request, res:Response, next:NextFunction){

    try{
        // generating the key for the very first time.

        const idempotent_key = req.headers["idempotent-key"]
        const {user_id,email} = req.body
        const request_url = req.originalUrl
        const request_method = req.method

        if(!idempotent_key){

            const key = GenerateIdempotentKey()
            const request_hash = GenerateRequestHash(user_id,email)
            
            const idempotentRecordObject={
                idempotent_key:key,
                user_id:user_id,
                request_method:request_method,
                endpoint:request_url,
                request_hash:request_hash
            }

            //Generating the idempotent_key_record.
            const key_record = await Idempotent_key.create(idempotentRecordObject)
            if(!key_record){
                throw new ServerError(500,'failed to generate the idempotent key')
            }
            //Extracting the idempotent_key from the idempotent_key_record. 
            const key_saved= key_record.get("idempotent_key") as string
            //Sending the idempotent_key back to the client.
            res.setHeader("idempotent-key", key_saved);
            //Embedding the idempotent_key in the request body so that it can be used further.
            //(req as any).idempotent_key = key_saved;

        }else{
            
            // If the key is already generated and exisiting in the req body

            const key_record = await Idempotent_key.findOne({
                where: {
                  idempotent_key,
                  request_method: request_method,
                  endpoint: request_url
                }
            })
            if(!key_record){
                throw new ResourceNotFoundError(400,'Idempotent key not found')
            }

            const request_hash = GenerateRequestHash(user_id, email )
            if(request_hash!=key_record.get("request_hash") as string){
                return res.status(409).json(
                    {
                        sucess:false,
                        messagge: "Idempotency key reused with different payload"
                    }
                );
            }

            const responseData = key_record.get("response_data")
            return res.status(200).json(
                {
                    sucess:true,
                    message:'',
                    data:responseData
                }
            )

        }

        next()
    }catch(err){
        console.log(err)
    }
}




export function IdempotentResponse(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;

  res.json = function (body: any) {
    const key = res.headers["idempotent-key"] as string;

    //determining status based on response body
    let status: string;
    let response_data: any;

    if (body?.success) {
      status = "completed";
      response_data = body.data;
    } else {
      status = "rejected";
      response_data = {
        message: body?.message || "The request has been denied",
      };
    }

    // not blocking the response
    setImmediate(async () => {
      try {
        if (!key) return;

        await Idempotent_key.update(
          {
            status,
            response_data,
          },
          {
            where: { idempotent_key: key },
          }
        );
      } catch (err) {
        console.error("Idempotent update failed:", err);
      }
    });

    //send response immediately
    return originalJson.call(this, body);
  };

  next();
}