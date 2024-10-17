const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { User } = require("../models/user.models.js");




const userEntry = asyncHandler( async (req,res)=>{
  console.log(req.body)
  const {userId,username,groupId} = req.body;
  // if(!userId){
    console.log(userId)
  // }
  if(
    [username,groupId].some((field)=>
      field.trim() === "")
  ){
    throw new ApiError(400,"All fields are required");
  }

  const user = await User.create({
    userId,
    username,
    groupId,
  })

  const isUserCreated = await User.findOne({userId})

  if(!isUserCreated){
    throw new ApiError(500,"Usre not entered")
  }

  return res.status(201).json(
    new ApiResponse(200,isUserCreated,"User is entered successfully")
  )
})

const getUser = asyncHandler(async (req,res)=>{

  const {userId} = req.body;

  const user = await User.findOne({userId})
  
  if(!user){
  throw new ApiError(404,"User not found")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {
        user
      },
      `${user.username} is successFully entered in.`)
  )


})

const logOut = asyncHandler(async (req,res)=>{
  const {userId} = req.body;
  console.log(userId)
  await User.findOneAndDelete({userId})

  return res
    .status(200)
    .json(
      new ApiResponse(200,{},"User successfully logged Out ")
    )
})


module.exports = {
    userEntry,
    getUser,
    logOut
}

