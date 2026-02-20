

export function getPendingMessages(userFriendships, receivedMessages) {
  const pendingMessages = [];
  
  userFriendships.forEach((friendship) => {
    const friendId = friendship.friendId;
    const friendMessages = receivedMessages.filter((msg) => msg.senderId !== friendId && !msg.read);
    pendingMessages.push(...friendMessages);
  });

  return pendingMessages;
};