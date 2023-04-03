export const APP_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: "https://studio.interwv.com";

export const API_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:8000"
		: "https://api.interwv.com";
