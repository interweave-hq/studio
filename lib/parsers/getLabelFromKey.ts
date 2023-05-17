export const getLabelFromKey = (key: string) => {
	if (key === "id") return "ID";
	key = key.replaceAll("_", " ");
	key = key.charAt(0).toUpperCase() + key.slice(1);
	return key;
};
