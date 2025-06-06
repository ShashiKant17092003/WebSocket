import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async(req,res) => {
    try{
        const {message} = req.body;
        const {id:receiverId} = req.params;
        console.log(receiverId);
        
        const senderId = req.user._id;
        
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        })

        if(!conversation){
            conversation  = await Conversation.create({
                participants:[senderId,receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        
        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await conversation.save();
        await newMessage.save();
        
        res.status(201).json(newMessage);

    }catch(err){
        console.log("error",err.message);
        res.status(500).json({error:"Internal server error"});
    }
}