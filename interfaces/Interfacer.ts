import { type Schema } from "@interweave/interweave";

export interface Interfacer {
	id: string;
	project: Record<string, unknown>;
	project_id: string;
	slug: string;
	title: string;
	schema_config: Schema;
	key: string;
	hash: string;
	build_time: Date;
	request_headers: Record<string, unknown>;
}
