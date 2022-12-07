import React from "react";

export function Page({ children }: { children: React.ReactNode }) {
	return <div className="flex flex-col w-full">{children}</div>;
}
