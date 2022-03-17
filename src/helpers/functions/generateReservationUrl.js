import constants from "../constants/index.js";

const { RESERVATION_URL } = constants;

function generateReservationUrl({ serviceHost }) {
  let reservationUrl = RESERVATION_URL;

  reservationUrl = reservationUrl.replace("<service_host>", serviceHost);

  return reservationUrl;
}

export default generateReservationUrl;
