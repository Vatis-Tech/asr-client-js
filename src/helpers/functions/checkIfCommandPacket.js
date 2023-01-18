import constants from "../constants/index.js";

const {
  SOCKET_IO_CLIENT_RESPONSE_COMMAND_PACKET
} = constants;

const checkIfCommandPacket = (data) => {
  return (
    data.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_COMMAND_PACKET)
  );
};

export default checkIfCommandPacket;
