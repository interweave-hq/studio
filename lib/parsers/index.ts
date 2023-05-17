import { type Request } from "@interweave/interweave";
import { get, isEmpty } from "../helpers";

export { getLabelFromKey } from "./getLabelFromKey";

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
	formData: "formData",
} as const;

type SourceValue = {
	[K in keyof typeof ALLOWED_SOURCES]?: Record<string, any>;
};

/**
 * Pulls the variables out of a string
 * http://{row.domain}/api/{row.resource} -> ['row.domain', 'row.resource']
 */
export function extractVariables(str: string): string[] {
	const variables: string[] = [];
	let i = 0;

	while (i < str.length) {
		if (str[i] === "<") {
			const start = i + 1;
			const end = str.indexOf(">", start);
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

type ParseRequestReturnValue = {
	data?: string;
	error?: string;
};

/**
 * Used to replace templated URL strings with their needed values
 *
 * Let's say we have a data object with { formData: { title: "abc" } }
 *
 * What we want to support:
 *
 * String replacement:
 * IN: { uri: "https://example.com/<formData.title>" }
 * OUT: { uri: "https://example.com/abc" }
 *
 * Object setting:
 * IN: { data: <formData> }
 * OUT: { data: { title: "abc" } }
 *
 * Object spreading: (Not supported)
 * IN: { data: { update: "static", <...formData> } }
 * OUT: { data: { update: "static", title: "abc" } }
 *
 */
export function parseRequest(
	request: Request,
	data: SourceValue
): ParseRequestReturnValue {
	let requestString = JSON.stringify(request);
	const variables = extractVariables(requestString);
	variables.forEach((v) => {
		const [source, key] = v.includes(".") ? v.split(".") : [v];
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
				error: `No source was specified in variable ${v}. A variable must include parts: 'source.key'.`,
				data: undefined,
			};
		}
		const hasKey = !!key;

		if (hasKey) {
			const value = get(data, v);
			if (isEmpty(value)) {
				return {
					error: `No data was returned from the variable target ${v}.`,
					data: undefined,
				};
			}
			requestString = requestString.replaceAll(`<${v}>`, value);
			return;
		}

		const sourceObj = get(data, v);
		const sourceObjStr = JSON.stringify(
			JSON.parse(JSON.stringify(sourceObj))
		);
		requestString = requestString.replaceAll(`<${v}>`, sourceObjStr);

		// Now we have to remove some quotes so we get an actual object instead of a string of an object
		// tried a million things and JSON.parse / JSON.stringify stuff doesnt work
		const whereReplacementStarts = requestString.indexOf(sourceObjStr) - 1;
		requestString =
			requestString.slice(0, whereReplacementStarts) +
			requestString.slice(whereReplacementStarts + 1);
		const whereReplacementEnds =
			whereReplacementStarts + sourceObjStr.length;
		requestString =
			requestString.slice(0, whereReplacementEnds) +
			requestString.slice(whereReplacementEnds + 1);
	});
	return {
		error: undefined,
		data: JSON.parse(requestString),
	};
}
