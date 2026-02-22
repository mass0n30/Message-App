

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