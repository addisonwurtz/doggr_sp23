import { MessageProfileView } from "@/Components/MessageProfileView.tsx";
import { ProfileType } from "@/DoggrTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { getNextProfileFromServer } from "@/Services/HttpClient.tsx";
import { MessageService } from "@/Services/MessageService.tsx";
import { render } from "@testing-library/react";
import { useContext, useEffect, useState } from "react";

export const Message = () => {
	const auth = useAuth();
	const [currentProfile, setCurrentProfile] = useState<ProfileType>();
	const [message, setMessage] = useState("");

	const fetchProfile = () => {
		getNextProfileFromServer()
			.then((response) => setCurrentProfile(response))
			.catch((err) => console.log("Error in fetch profile", err));
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	const onSendButtonClick = () => {
		MessageService.send(auth.userId, currentProfile.id, message)
			.then(changeButtonState)
			.catch((err) => {
				console.error(err);
				//fetchProfile();
			});
	};

	const state = { name: "Send" };

	const changeButtonState = () => {
		state.name = "Sent!";
		console.log("button state changed");
	};

	const profile = <MessageProfileView {...currentProfile} onSendButtonClick={onSendButtonClick} />;

	return (
		<div>
			<>{profile}</>

			<div className={"space-x-9 my-1"}>
				<div>
					<label htmlFor={"message"}>Message:</label>
					<input
						type="text"
						id="message"
						required
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						name={"message"}
					/>
				</div>
				<button className="btn btn-circle" onClick={onSendButtonClick}>
					{state.name}
				</button>
			</div>
		</div>
	);
};
