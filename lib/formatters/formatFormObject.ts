import { type SchemaKeys } from "@interweave/interweave";

export function formatFormObject(
	data: Record<string, unknown>,
	keys: SchemaKeys
) {
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
		const type = keyConfig.schema.type;
		if (type === "number" && typeof value === "string") {
			data[d] = parseFloat(value);
		}
	});
	return data;
}
