import React, { useEffect, useState, useRef } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface User {
  name: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user?: User;
}

interface ChatData {
  chats: Message[];
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoggedIn, user } = useAuth() as AuthContextType;
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  // Fetch user chats when the component mounts or when user changes
  useEffect(() => {
    if (isLoggedIn && user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data: ChatData) => {
          setChatMessages(data.chats);
          toast.success("Successfully loaded chats", { id: "loadchats" });
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch((err) => {
          console.error("Error loading chats:", err);
          toast.error("Loading Failed", { id: "loadchats" });
          setLoading(false); // Set loading to false on error
        });
    }
  }, [isLoggedIn, user]);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle sending a chat message
  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim() || "";
    if (content === "") return;
    if (inputRef.current) inputRef.current.value = "";

    const newMessage: Message = { role: "user", content };

    // Update state with new message
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      setLoading(true);
      const { chats }: ChatData = await sendChatRequest(content);
      setChatMessages([...chats]);
      setLoading(false); // Ensure loading is set to false when messages are updated
    } catch (error) {
      console.error("Error sending chat request:", error);
      toast.error("Failed to send message");
      setLoading(false); // Set loading to false on error
    }
  };

  // Handle deleting all chat messages
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  // // Conditionally render the component based on loading state and chatMessages
  // if (loading) {
  //   toast.success("Loading response .... ", { id: "loadchats" });
  // }

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {user?.name[0]}
            {user?.name.split(" ")[1]?.[0]} {/* Guard against undefined */}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask some questions related to Knowledge, Business, Advices,
            Education, etc. But avoid sharing personal information
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - GPT 3.5 Turbo
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
            mb: 2
          }}
        >
          {
            chatMessages.map((chat, index) => (
              <ChatItem
                content={chat.content}
                role={chat.role}
                key={`${chat.role}-${index}`} // Ensure unique keys
              />
            ))
          }
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            {loading?<>Loading ...</>:<IoMdSend />}
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
