import { Profile, ProfileProps } from "@/Components/Profile.tsx";
import { ProfileType } from "@/DoggrTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { getNextProfileFromServer } from "@/Services/HttpClient.tsx";
import { MatchService } from "@/Services/MatchService.tsx";
import { PassService } from "@/Services/PassService.tsx";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Match({ currentProfile, fetchProfile }) {
	const auth = useAuth();

	useEffect(() => {
		console.log("in Match useEffect: ");
		console.log(currentProfile.name);
	}, [currentProfile.name]);

	const onLikeButtonClick = () => {
		MatchService.send(auth.userId, currentProfile.id)
			.then(fetchProfile())
			.catch((err) => {
				console.error(err);
				fetchProfile();
			});
	};

	const onPassButtonClick = () => {
		PassService.send(auth.userId, currentProfile.id)
			.then(fetchProfile)
			.catch((err) => {
				console.error(err);
				fetchProfile();
			});
	};

	const navigate = useNavigate();

	const onMessageButtonClick = () => {
		console.log(currentProfile);
		navigate("/messages");
	};

	const profile = (
		<Profile
			{...currentProfile}
			onLikeButtonClick={onLikeButtonClick}
			onPassButtonClick={onPassButtonClick}
			onMessageButtonClick={onMessageButtonClick}
		/>
	);

	return <>{profile}</>;
}
