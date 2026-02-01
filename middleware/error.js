const errorHandler = (err, req, res, next) =>{
  if(err.name === "ValidationError"){
    return res.status(400).json({
      message: "Validation Error",
      errors: err.details?.map(e => e.message) || [err.message]
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

module.exports = errorHandler;
