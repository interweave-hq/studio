import { type Fields } from "@interweave/interweave";

import { isEmpty } from "../helpers";

export function formatFormObject(data: Record<string, unknown>, keys: Fields) {
	const dataKeys = Object.keys(data);
	dataKeys.forEach((d) => {
		const value = data[d];
		let keyConfig = keys[d];
		if (!keyConfig) {
			// If you can't find the key config, look for the outKey
			const keysArr = Object.keys(keys);
			const correctKey = keysArr.find(
				(k) => keys[k].interface?.form?.out_key === d
			);
			if (!correctKey) {
				return;
			}
			keyConfig = keys[correctKey];
		}

		// Format input numbers
		const type = keyConfig.schema.type;
		if (type === "number" && typeof value === "string") {
			data[d] = parseFloat(value);
		}

		// Format null values
		if (
			(isEmpty(value) || value === "None") &&
			type !== "boolean" &&
			!keyConfig.schema.is_array
		) {
			data[d] = null;
		}

		// Format date values to include timezone
		if (value) {
			if (type === "datetime" || type === "time") {
				if (typeof value === "string" || typeof value === "number") {
					data[d] = new Date(value).toISOString();
				}
			}
			// Enable timezone tracking on date
			if (type === "date") {
				if (typeof value === "string") {
					const newDate = new Date();
					const [nYear, nMonth, nDay] = value.split("-");
					newDate.setFullYear(parseInt(nYear));
					newDate.setMonth(parseInt(nMonth) - 1);
					newDate.setDate(parseInt(nDay));
					newDate.setHours(0);
					newDate.setMinutes(0);
					newDate.setSeconds(0);
					newDate.setMilliseconds(0);
					data[d] = newDate.toISOString();
				}
			}
		}
	});
	return data;
}
