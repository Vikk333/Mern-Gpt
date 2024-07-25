import User from "../models/User.js";
// import { configureOpenAI } from "../config/openai-config.js";
// import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
import axios from 'axios';
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        // Grab chats of user
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        console.log("Message is ", message);
        chats.push({ content: message, role: "user" });
        // Define the request URL and headers
        const url = 'https://open-ai21.p.rapidapi.com/conversationpalm2';
        const headers = {
            'x-rapidapi-key': '085d6605b1msh6cd7ba927a59395p152da1jsn61f7e9041394',
            'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
            'Content-Type': 'application/json'
        };
        // Send request to the API using axios.post
        const response = await axios.post(url, { messages: chats }, { headers });
        console.log('API Response:', response.data);
        // Check if the response has the expected BOT property
        const userMessage = { content: message, role: "user" };
        user.chats.push(userMessage);
        if (response.data && response.data.BOT) {
            const newMessage = { content: response.data.BOT, role: "assistant" };
            console.log(newMessage);
            user.chats.push(newMessage);
            await user.save();
            return res.status(200).json({ chats: user.chats });
        }
        else {
            console.error('Unexpected response structure:', response.data);
            return res.status(500).json({ message: "Unexpected response from API" });
        }
    }
    catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map