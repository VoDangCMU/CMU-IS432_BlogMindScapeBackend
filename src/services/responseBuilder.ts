import {Response} from "express";

function NotFound(res: Response, detail: any = "") {
	return res.status(404).json({
		message: "The content you requested is missing.",
		detail,
	});
}

function BadRequest(res: Response, detail: any = "") {
	return res.status(400).json({
		message: "Bad Request.",
		detail,
	});
}

function Forbidden(res: Response, detail: any = "") {
	return res.status(403).json({
		message: "You do not have permission to access to this resource.",
		detail,
	});
}

function Unauthorize(res: Response, detail: any = "") {
	return res.status(401).json({
		message: "Unauthorize.",
		detail,
	});
}

function Ok(res: Response, data: Object = {}) {
	return res.status(200).json(data);
}

function InternalServerError(
	res: Response,
	detail: any = "Check server logs for further information"
) {
	return res.status(500).json({
		message: "Internal Server Error",
		detail,
	});
}

const ResponseBuilder = {
	NotFound,
	BadRequest,
	Forbidden,
	Unauthorize,
	Ok,
	InternalServerError,
};

export default ResponseBuilder;
