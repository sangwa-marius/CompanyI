import {Request, Response, NextFunction} from 'express';

class AppError extends Error {
    status:number;
    constructor(message:string, status:number){
        super(message);
        this.status = status;
    }
}
const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new AppError('Route Not Found', 404);
    next(error);
}

export default notFound;