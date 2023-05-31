import { Profile } from "@/Components/Profile.tsx";
import { useAuth } from "@/Services/Auth.tsx";
import { MatchService } from "@/Services/MatchService.tsx";
import { PassService } from "@/Services/PassService.tsx";
import { useNavigate } from "react-router-dom";

export function Match({ currentProfile, fetchProfile }) {
	const auth = useAuth();

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
		navigate("/messages", currentProfile);
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
