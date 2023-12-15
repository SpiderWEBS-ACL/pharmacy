const connectedUsers = new Map();
let io = null;

function getKeyByValue(searchValue) {
  connectedUsers.forEach((value, key) => {
    console.log(value, key);
    console.log(` New connection: ${key}: ${value.userId}`);
    if (value.userId + "" == searchValue + "") {
      return key;
    }
  });

  return null;
}
const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUsers.set(socketId, { userId });
  connectedUsers.forEach((value, key) => {
    console.log(` New connection: ${key}: ${value.userId}`);
  });
};

const removeConnectedUser = ({ socketId }) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
  }
};

const getActiveConnections = (userId) => {
  const activeConnections = [];

  connectedUsers.forEach((value, key) => {
    if (value.userId === userId) {
      activeConnections.push(key);
    }
  });
  console.log("connected users", connectedUsers);

  return activeConnections;
};

const getOnlineUsers = () => {
  const onlineUsers = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({
      userId: value.userId,
      socketId: key,
    });
  });

  return onlineUsers;
};

const setServerSocketInstance = (ioInstance) => {
  io = ioInstance;
};

const getServerSocketInstance = () => {
  return io;
};

module.exports = {
  addNewConnectedUser,
  removeConnectedUser,
  getActiveConnections,
  setServerSocketInstance,
  getServerSocketInstance,
  getOnlineUsers,
  connectedUsers,
  getKeyByValue,
};
