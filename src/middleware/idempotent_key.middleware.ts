import { Idempotent_key } from "../db/models/idempotent_key.model.js";
import type { Request,Response, NextFunction } from "express";
import { GenerateIdempotentKey } from "../utils/GenerateIdempotentKey.js";
import { GenerateRequestHash } from "../utils/crypto.js";

export async function IdempotentRequestMiddleware(req: Request, res: Response, next: NextFunction) {

    const key = req.headers["idempotency-key"] as string;
    const email = req.body.email
     
    //checking the key.
    if (!key) {
        return res.status(400).json({ message: "Idempotency-Key header is required" });
    }

    try {
        const requestHash = GenerateRequestHash(req.body);
        
        // Atomic check or insert
        // Using a unique constraint in DB to prevent race conditions
        const [record, created] = await Idempotent_key.findOrCreate({
            where: { idempotent_key: key },
            defaults: {
                status: 'processing',
                request_hash: requestHash,
                endpoint: req.originalUrl,
                request_method:req.method
            }
        });

        if (!created) {
          //Integrity Check to find did the payload change?
          if (record.request_hash !== requestHash) {
              return res.status(400).json({ 
                  error: "Idempotency-Error",
                  message: "Idempotency key reused with a different request body." 
              });
          }
      
          //Concurrency Check to find that is the request still running.
          if (record.status === 'processing') {
              const lockDuration = Date.now() - new Date(record.createdAt).getTime();
              
              //Zombie Check that whether it been "processing" for too long
              if (lockDuration > 120000) { 
                  // if processing foor more than 2 minutes then clear the zombie and let this request create a new one
                  await record.destroy();
                  return res.status(503).json({ message: "Previous attempt timed out. Please retry." });
              }
              // Tell client to wait 2 seconds
              res.set("Retry-After", "2");
              return res.status(409).json({ message: "Request is currently being processed." });
          }
      
          // Final Replay: Use the stored status and data
          // Ensure you fall back to 200 if response_status wasn't saved
          const savedStatus = record.response_status || 200;
          
          // Add a custom header so the client knows this is a "Replayed" response
          res.set("Idempotency-Replayed", "true");
          
          return res.status(savedStatus).json(record.response_data);
      }

      // Attach key to req so the controller can update the record later
      (req as any).idempotencyKey = key;
        
      //Proceed to the actual logic
      next();

    } catch (err) {
        console.error(err);
        next(err)
    }
}


export function IdempotentResponseMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["idempotency-key"] as string;

  // If no key, don't bother patching
  if (!key) return next();

  const originalJson = res.json;

  res.json = function (body: any) {
    // Capture the actual HTTP status code
    const statusCode = res.statusCode;
    
    // Logic to determine if this should be cached
    // Usually, we don't cache 5xx errors so the user can actually retry
    const isCacheable = statusCode < 500;

    if (isCacheable) {
      // Background update (or await if high-consistency is needed)
      Idempotent_key.update(
        {
          status: "completed",
          response_code: statusCode, // Save the status!
          response_data: body,       // Save the full body
        },
        { where: { idempotent_key: key } }
      ).catch(err => console.error("Idempotency update failed:", err));
    } else {
        // If it's a 500, maybe delete the key so they can try again immediately?
        Idempotent_key.destroy({ where: { idempotent_key: key } }).catch(() => {});
    }

    return originalJson.call(this, body);
  };

  next();
}