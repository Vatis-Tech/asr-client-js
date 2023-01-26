import constants from "../constants/index.js";

const {
  SOCKET_IO_CLIENT_RESPONSE_FINAL_PACKET
} = constants;

const checkIfFinalPacket = (data) => {
  return (
    data.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_FINAL_PACKET) &&
    data.headers[SOCKET_IO_CLIENT_RESPONSE_FINAL_PACKET] === true
  );
};

export default checkIfFinalPacket;
