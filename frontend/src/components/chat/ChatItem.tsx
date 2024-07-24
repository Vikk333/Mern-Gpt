import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

interface ChatItemProps {
  content: string;
  role: "user" | "assistant";
}

const ChatItem: React.FC<ChatItemProps> = ({ content, role }) => {
  const auth = useAuth();

  // Add logging for debugging
  console.log('Role:', role);
  console.log('Auth User:', auth?.user);

  const isAssistant = role === "assistant";

  return (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: isAssistant ? "#004d5612" : "#004d56",
        gap: 2,
        borderRadius: 2,
        my: isAssistant ? 1 : 0,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: isAssistant ? "white" : undefined, color: isAssistant ? "black" : undefined }}>
        {isAssistant ? ( <img src="openai.png" alt="openai" width={"30px"} />
        ) : 
         
          (
            auth?.user?.name ? (
              <>
                {auth.user.name[0]}
                {auth.user.name.split(" ")[1]?.[0]}
              </>
            ) : (
              "U"
            )
        )}
      </Avatar>
      <Box>
        <Typography sx={{ fontSize: "20px" }}>{content}</Typography>
      </Box>
    </Box>
  );
}

export default ChatItem;
