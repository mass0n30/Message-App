

export function getPendingMessages(userFriendships, receivedMessages) {
  const pendingMessages = [];

  if (userFriendships.length === 0) {
    receivedMessages.forEach((msg) => {
      if (!msg.read) {
        pendingMessages.push(msg);
      }
    })
  };

  userFriendships.forEach((friendship) => {
    const friendId = friendship.friendId;
    const friendMessages = receivedMessages.filter((msg) => msg.senderId !== friendId && !msg.read);
    pendingMessages.push(...friendMessages);
  });

  return pendingMessages;
};


export function assignChatRoomPattern(chatRoom, pattern) {
  if (!chatRoom || !pattern) return chatRoom;

  const patternMap = {
    "FloatingCloud": "/pattern/FloatingCloud.svg",
    "GlowingStars": "/pattern/GlowingStars.svg",
    "Snow": "/pattern/Snow.svg",
    "Sprinkle": "/pattern/Sprinkle.svg",
    "DashLights": "/pattern/DashLights.svg",
    "Abstract": "/pattern/Abstract.svg",
    "Circuit": "/pattern/Circuit.svg",
  };

  const backgroundImage = patternMap[pattern] || null;

  return {
    ...chatRoom,
    backgroundImage,
  };
}
