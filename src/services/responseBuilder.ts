import { Response } from "express";

function NotFound(res: Response, detail: any = "") {
  return res
    .status(404)
    .json({
      message: "The content you requested is missing.",
      detail
    })
}

function BadRequest(res: Response, detail: any = "") {
  return res
    .status(400)
    .json({
      message: "Bad Request.",
      detail
    })
}

function Forbidden(res: Response, detail: any = "") {
  return res
    .status(403)
    .json({
      message: "You do not have permission to access to this resource.",
      detail
    })
}

function Unauthorize(res: Response, detail: any = "") {
  return res
    .status(401)
    .json({
      message: "Unauthorize.",
      detail
    })
}

function Ok(res: Response, data: Object = {}) {
  return res
    .status(200)
    .json(data)
}

const ResponseBuilder = {
  NotFound,
  BadRequest,
  Forbidden,
  Unauthorize,
  Ok
}

export default ResponseBuilder;