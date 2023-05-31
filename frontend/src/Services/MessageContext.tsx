import { ProfileType } from "@/DoggrTypes.ts";
import { createContext, useContext } from "react";

export const messageContext = createContext<ProfileType | null>(null);

export const useMessageContext = () => {
	return useContext(messageContext);
};
