import { useContext, useEffect } from "react";
import { ContainerContext } from "../components/ContainerProvider";
import { DIContainer } from "@/src/services";

export function useContainer(): DIContainer | null {
	return useContext(ContainerContext);
}
