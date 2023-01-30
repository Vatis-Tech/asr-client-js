import constants from "../constants/index.js";

const {
  SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET,
  SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET,
} = constants;

const checkIfFinalPacket = (data) => {
  return (
    !data.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET) ||
    (data.headers.hasOwnProperty(SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET) &&
      data.headers.hasOwnProperty(
        SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET
      ) &&
      data.headers[SOCKET_IO_CLIENT_RESPONSE_SPLIT_PACKET] === true &&
      data.headers[SOCKET_IO_CLIENT_RESPONSE_FINAL_SPLIT_PACKET] === true)
  );
};

export default checkIfFinalPacket;
