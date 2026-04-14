import {Request, Response, NextFunction} from 'express';
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) =>{
  if(err.name === "ValidationError"){
    return res.status(400).json({
      message: "Validation Error",
      errors: err.details?.map((e: { message: any; }) => e.message) || [err.message]
    })
  }

  if(err.name ==="CastError"){
    return res.status(400).json({message: "the Id format is invalid"})
  }

  if(err.code ===11000){
    return res.status(400).json({message:"Duplicate entry"})
  }

  res.status(err.status||500).json({message:err.message ||'internal server error'})
}
export default errorHandler;
