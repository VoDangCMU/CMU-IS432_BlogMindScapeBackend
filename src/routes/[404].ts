import { Router } from "express";
import ResponseBuilder from "@services/responseBuilder";

const notfound = Router();

notfound.all("/", (req, res) => {
  return ResponseBuilder.NotFound(res, "REQUESTED_CONTENT_NOTFOUND");
});

export default notfound;
