import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "newcodelabstudents24",
  api_key: "631571737476252",
  api_secret: "5JuVB7MjtouQqRrKU3zAjRg81zY",
  secure: true,
});

export default cloudinary;
