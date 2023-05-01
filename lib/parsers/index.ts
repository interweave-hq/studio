import { get, isEmpty } from "../helpers";

/**
 * A Source is where data can come from, aka the first part of a key in a string
 * Right now these are the allowed sources:
 *
 * `row`: The active row on the table. Will be undefined if no row is active.
 *
 * `parameters`: The parameters available on the page, either exposed via a get requests parameters key or whatever is specified in the URL bar
 */
const ALLOWED_SOURCES = {
	row: "row",
	parameters: "parameters",
} as const;

/**
 * Pulls the variables out of a string
 * http://{row.domain}/api/{row.resource} -> ['row.domain', 'row.resource']
 */
function extractVariables(str: string): string[] {
	const variables: string[] = [];
	let i = 0;

	while (i < str.length) {
		if (str[i] === "{") {
			const start = i + 1;
			const end = str.indexOf("}", start);
			if (end !== -1) {
				const variable = str.substring(start, end);
				variables.push(variable);
				i = end + 1;
				continue;
			}
		}
		i++;
	}

	return variables;
}

type ParseUrlReturnValue = {
	data?: string;
	error?: string;
};

/**
 * Used to replace templated URL strings with their needed values
 */
export function parseUrl(
	urlString: string,
	data: {
		row?: Record<string, any>;
		parameters?: Record<string, any>;
	}
): ParseUrlReturnValue {
	const variables = extractVariables(urlString);
	variables.forEach((v) => {
		const [source, key] = v.split(".");
		// Can check for expected variables here like row, state, etc
		if (!ALLOWED_SOURCES[source as keyof typeof ALLOWED_SOURCES]) {
			return {
				error: `An invalid source was specifed in variable ${v}. The only valid sources are: ${Object.keys(
					ALLOWED_SOURCES
				).join(" | ")}.`,
				data: undefined,
			};
		}
		if (!source) {
			return {
				error: `No source was specified in variable ${v}. A variable must include two parts: 'source.key'.`,
				data: undefined,
			};
		}
		if (!key) {
			return {
				error: `No key was specified in variable ${v}. A variable must include two parts: 'source.key'.`,
				data: undefined,
			};
		}
		const value = get(data, v);
		if (isEmpty(value)) {
			return {
				error: `No data was returned from the variable target ${v}.`,
				data: undefined,
			};
		}
		urlString = urlString.replaceAll(`{${v}}`, value);
	});

	return {
		error: undefined,
		data: urlString,
	};
}
