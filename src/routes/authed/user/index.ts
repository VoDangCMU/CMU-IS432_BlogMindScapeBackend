import { Router } from "express";

const user = Router();

user.get("/", (req, res) => {
  let user = {
    id: 1,
    name: "Khoa"
  }

  res.status(200).json(user);
})

export default user;
module.exports = user;