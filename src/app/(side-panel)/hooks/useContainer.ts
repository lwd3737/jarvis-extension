import { useContext } from "react";
import { DIContainer } from "@/src/services";
import { ContainerContext } from "../components/ContainerProvider";

export function useContainer(): DIContainer | null {
	return useContext(ContainerContext);
}
