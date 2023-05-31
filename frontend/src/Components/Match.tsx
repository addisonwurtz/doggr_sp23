import { Profile, ProfileProps } from "@/Components/Profile.tsx";
import { ProfileType } from "@/DoggrTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { getNextProfileFromServer } from "@/Services/HttpClient.tsx";
import { MatchService } from "@/Services/MatchService.tsx";
import { PassService } from "@/Services/PassService.tsx";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Match(props: ProfileType) {
	const [currentProfile, setCurrentProfile] = useState<ProfileType>(props);
	const auth = useAuth();

	const fetchProfile = () => {
		getNextProfileFromServer()
			.then((response) => setCurrentProfile(response))
			.catch((err) => console.log("Error in fetch profile", err));
	};

	useEffect(() => {
		//fetchProfile();
		fetchProfile();
		console.log("in Match useEffect: ");
		console.log(currentProfile.name);
	}, [currentProfile.name]);

	const onLikeButtonClick = () => {
		MatchService.send(auth.userId, currentProfile.id)
			.then(fetchProfile)
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
