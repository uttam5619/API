# Api

## Idempotency in API.
Idempotency ensures that repeating the same request multiple times has the same effect as doing it once. This is crucial for reliability, especially with network retries, timeouts, or distributed systems.

## Idempotency in HTTP Methods.
Some of the http methods are naturally idempotent. `GET`, `PUT` and `DELETE` are naturally idempotent in nature, whereas `POST` and `PATCH` are not idempotent by default.

## Why it is important to generate the idempotent-key at client side??
If the server generates the ID, then it's a `black box` to the client until the response arrives. If the connection drops mid-flight, the client is left in the dark.

Example 
Let us supposefor a moment that the server generates the unique identifier (like a transaction_id), then the workflow would looks like this:

- Client sends a "Charge $10" request.
- Server receives it, generates ID_123, and processes the payment.
- Network Crash: The server tries to send ID_123 back, but the client never gets it.
- The Dilemma: The client doesn't know if the charge happened. If they "Retry," they send a brand new request. The server sees this as a fresh instruction and charges another $10.

Solution: The Client Side Key Generation.
To ensure idempotency, the Client must generate a unique string (often called an Idempotency-Key or Request-ID) before sending the request.

How it works:
- `The Header`: The client generates a UUID (e.g., 550e8400-e29b...) and puts it in the request header.
- `The Server Log`: Before processing, the server checks its database: "Have I already seen a request with this specific Key?"
- `The Result`: * If No: The server processes the request and stores the result against that key.
- `If Yes`: The server ignores the processing logic and simply returns the cached response from the first time.

## Problem with the Server Side Generation.
```
export async function IdempotentRequest(req:Request, res:Response, next:NextFunction){

    try{
        // generating the key for the very first time.

        const idempotent_key = req.headers["idempotent-key"]
        const {user_id,email} = req.body
        const request_url = req.originalUrl
        const request_method = req.method

        if(!idempotent_key){

            // Generating the code at Server Side.
            const newkey = GenerateIdempotentKey()
            const request_hash = GenerateRequestHash(user_id,email)
            
            const idempotentRecordObject={
                idempotent_key:newkey,
                user_id:user_id,
                request_method:request_method,
                endpoint:request_url,
                request_hash:request_hash,
                status:'processing'
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
            (req as any).idempotent_key = key_saved;
            
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

            const current_hash = GenerateRequestHash(user_id, email )
            const stored_hash = key_record.get("request_hash") as string
            if(current_hash != stored_hash){
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
```

Here again we will fallback into the same problem from which we are trying to get rid from. These problems are mentioned below.
- `The "First-Time" Generation Logic`
The code generates a key if one isn't provided. This defeats the purpose of idempotency for retries. If a client's request fails due to a network timeout before they receive your generated key, they have no way to retry the request with the same key to ensure they aren't charged/processed twice.

- `Race Conditions (Concurrency)`
If two identical requests hit the server at the exact same millisecond, both might find that no record exists (or that the status is 'processing') and both will proceed to execute the business logic (e.g., charging a credit card).

- `Handling "Processing" State`
The Problem: If a second request arrives while the first one is still status: 'processing', your code currently proceeds to try and return responseData. However, responseData will be null because the first request hasn't finished.