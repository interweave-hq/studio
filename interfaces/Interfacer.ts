import { type InterfaceConfiguration } from "@interweave/interweave";

export interface Interfacer {
	id: string;
	updated_at: string;
	project: Record<string, unknown>;
	project_id: string;
	slug: string;
	title: string;
	description?: string;
	schema_config: InterfaceConfiguration;
	key: string;
	hash: string;
	build_time: Date;
	privacy:
		| "Public"
		| "Unlisted"
		| "Private"
		| "DomainRestricted"
		| "InviteRestricted";
}
