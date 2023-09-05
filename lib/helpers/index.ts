import { type FieldConfiguration } from "@interweave/interweave";
import isEmpty from "is-empty";

export { isEmpty };

export function get(object: object, path?: string, defaultValue = null): any {
	if (!path) {
		return object;
	}
	// Convert dot notation to bracket notation
	path = path.replace(/\[(\w+)\]/g, ".$1");
	path = path.replace(/^\./, "");

	// Split path into an array of keys
	const keys = path.split(".");

	// Iterate over the keys to retrieve the value
	let result = object;
	for (const key of keys) {
		if (
			result != null &&
			Object.prototype.hasOwnProperty.call(result, key)
		) {
			result = result[key as keyof typeof result];
		} else {
			return defaultValue;
		}
	}

	return result === undefined ? defaultValue : result;
}

// Given a schema configuration object...
// We need to take a path X and return a proper configuration object
// So given obj { products: { schema: { object_keys: Schema } } }
// So path "products"
// Will return products.schema.object_keys
// columnData will be a KeyConfiguration
// dataPath will be a string of where to look
export function getSchema(
	object: { [key: string]: FieldConfiguration },
	path: string,
	defaultValue = null
): { [key: string]: FieldConfiguration } | null {
	// Convert dot notation to bracket notation
	path = path.replace(/\[(\w+)\]/g, ".$1");
	path = path.replace(/^\./, "");

	// Split path into an array of keys
	const keys = path.split(".");

	// Iterate over the keys to retrieve the value
	let result = object;
	for (const key of keys) {
		if (
			result != null &&
			Object.prototype.hasOwnProperty.call(result, key)
		) {
			const val = result[key]?.schema?.object_schema?.keys;
			if (typeof val === "undefined") {
				return defaultValue;
			}
			result = val;
		} else {
			return defaultValue;
		}
	}

	return result === undefined ? defaultValue : result;
}

export function combineCss(arr: (string | null | undefined)[]): string {
	const filteredArr = arr.filter(
		(value) => value !== null && value !== undefined
	);
	return filteredArr.join(" ");
}

/**
 *
 * We accept a __cssFor style overrides that may look like
 * { label: 'classname' }
 * We want to combine this override with our standard styling
 * So we can call this function once and get our concatenated strings
 * 	const { container: containerStyles } = shapeCss<OverridesKeys, InputOverrides<string>>(Overrides, styles, __cssFor);
 *
 * Overrides being our keys that can possibly be overwritten in the component
 * styles being the CSS module object of classNames
 * __cssFor being the overrides object
 *
 *
 */
export const shapeCss = <
	Keys extends string,
	OverridesMap extends Partial<Record<Keys, string>>
>(
	overrides: OverridesMap,
	styles: Record<string, string>,
	__cssFor?: Partial<OverridesMap>
) => {
	const obj = {} as OverridesMap;
	(Object.keys(overrides) as Keys[]).forEach((o) => {
		obj[o] = combineCss([
			styles[o],
			__cssFor ? __cssFor[o as Keys] : "",
		]) as OverridesMap[Keys];
	});
	return obj;
};
