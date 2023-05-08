"use client";

import { createContext, type ReactNode } from "react";

export const InterfaceContext = createContext<{ interfaceId: string }>({
	interfaceId: "",
});

export function InterfaceContextProvider({
	interfaceId,
	children,
}: {
	interfaceId: string;
	children: ReactNode;
}) {
	return (
		<InterfaceContext.Provider value={{ interfaceId }}>
			{children}
		</InterfaceContext.Provider>
	);
}
