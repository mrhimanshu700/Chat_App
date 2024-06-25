const asyncHandler = require("express-async-handler");
const Chat= require("../models/Chat.model");
const User= require("../models/User.model");


const accessChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body;
    if(!userId){
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
    }
    var isChat= await Chat.find({
        isGroupChat: false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ],
    }).populate("users","-password").populate("latestMassege");
    isChat = await User.populate(isChat,{
        path:'latestMassege.sender',
        select:'username image email',
    });


    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],
        };

        try{
        const createdchat = await Chat.create(chatData);
        const Fullchat = await Chat.findOne({_id:createdchat._id}).populate("users","-password");
        res.status(200).send(Fullchat);
        }catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats = asyncHandler(async(req,res)=>{
    try{
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate('users','-password')
        .populate('groupAdmin','-password')
        .populate('latestMassege')
        .sort({updatedAt:-1})
        .then(async(result)=>{
            result = await User.populate(result,{
                path:'latestMassege.sender',
                select:'username image email',
            });
            res.status(200).send(result);
        })
    }catch(error){
        res.status(400);
        throw new Error(error.messege);
    }
});


const createGroupChat = asyncHandler(async (req,res)=>{

    if(!req.body.users && !req.body.name){
        return res.status(400).send({message:"please fill all the feilds"});
    }

    var users = JSON.parse(req.body.users);
    
    if(users.length<2){
        return res.status(400)
        .send("More than 2 users are required to form group chat");
    }

    users.push(req.user);
     
    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({_id:groupChat.id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    }catch(error){
     
        res.status(400);
        throw new Error(error.message);
    }

})


const renameGroup = asyncHandler( async (req,res)=>{

    const {chatId,chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true,
        }
    ).populate('users','-password')
    .populate('groupAdmin','-password');

    if(!updatedChat){
        res.status(404);
        throw new Error ("chat not found");
    }
    else{
        res.json(updatedChat);
    }
})


const addToGroup = asyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users: userId}
        },
        {
            new : true
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added){
        res.status(404);
        throw new Error("chat not found");  
    }else{
        res.json(added);
    }
});


const removeFromGroup = asyncHandler(async(req,res)=>{
    const {chatId,userId} = req.body;
    
    const remove = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users: userId}
        },
        {
            new : true
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!remove){
        res.status(404);
        throw new Error("chat not found");  
    }else{
        res.json(remove);
    }
});

 module.exports = { accessChat,fetchChats,createGroupChat,renameGroup, addToGroup,removeFromGroup}