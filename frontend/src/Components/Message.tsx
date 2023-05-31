import { MessageProfileView } from "@/Components/MessageProfileView.tsx";
import { ProfileProps } from "@/Components/Profile.tsx";
import { State, ProfileType } from "@/DoggrTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { MessageService } from "@/Services/MessageService.tsx";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Message = () => {
	const auth = useAuth();
	const [currentProfile, setCurrentProfile] = useState<ProfileType>();

	const [message, setMessage] = useState("");
	const [buttonName, setButtonName] = useState("Send");

	useEffect(() => {
		console.log("in useEffect ");
	}, [currentProfile]);

	const onSendButtonClick = () => {
		MessageService.send(auth.userId, currentProfile.id, message).catch((err) => {
			console.error(err);
		});
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
				<button
					className="btn btn-circle"
					onClick={() => {
						onSendButtonClick();
						setButtonName("Sent!");
					}}>
					{buttonName}
				</button>
			</div>
		</div>
	);
};
