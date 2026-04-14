

export class GenericError extends Error{
    statusCode:number
    name:string
    constructor(statusCode:number,name:string,message:string){
        super(message) // error message + stacktrace
        this.name=name||this.constructor.name
        this.statusCode=statusCode

        if(Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
        }
    }
    
}

export class BadRequestError extends GenericError {
    constructor(statusCode:number, message:string){
        super(statusCode,'Bad Request',message)
    }
}

export class ResourceNotFoundError extends GenericError {
    constructor(statusCode:number, message:string){
        super(statusCode, 'Resource Not Found', message)
    }
}

export class ServerError extends GenericError{
    constructor(statusCode:number,message:string){
        super(statusCode, 'Server Error', message)
    }
}