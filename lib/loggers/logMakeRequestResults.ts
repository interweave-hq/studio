export function logMakeRequestResults({
	data,
	error,
	key,
}: {
	data?: any;
	error?: any;
	key: string;
}) {
	console.group(`Fetch results - ${key}`);
	console.log("Data: ", data);
	console.log("Error: ", error);
	console.groupEnd();
}
