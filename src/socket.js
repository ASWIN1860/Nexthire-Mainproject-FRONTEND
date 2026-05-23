import { io } from "socket.io-client";
import base_url from "./services/base_url";

const socket = io(base_url);

export default socket;