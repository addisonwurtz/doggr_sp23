import { MessageProfileView } from "@/Components/MessageProfileView.tsx";
import { ProfileProps } from "@/Components/Profile.tsx";
import { State, ProfileType } from "@/DoggrTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { MessageService } from "@/Services/MessageService.tsx";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function Message(props: ProfileType) {
	const auth = useAuth();
	const [currentProfile, setCurrentProfile] = useState<ProfileType>(props);
	const [message, setMessage] = useState("");
	const [buttonName, setButtonName] = useState("Send");

	useEffect(() => {
		console.log("in Message useEffect ");
		console.log(currentProfile.name);
		setCurrentProfile(props);
	}, [currentProfile, props]);

	const onSendButtonClick = () => {
		MessageService.send(auth.userId, currentProfile.id, message).catch((err) => {
			console.error(err);
		});
	};

	const profile = <MessageProfileView {...currentProfile} onSendButtonClick={onSendButtonClick} />;

	return (
		<div className={"flex flex-col items-center rounded-box bg-slate-700 w-4/5 mx-auto"}>
			<>{profile}</>

			<div className={"items-center my-3.5"}>
				<div>
					<label htmlFor={"message"}></label>
					<input
						type="text"
						placeholder={"Type message here..."}
						id="message"
						required
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						name={"message"}
					/>
				</div>
				<div className={"flex flex-col items-center my-3.5"}>
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
		</div>
	);
}
