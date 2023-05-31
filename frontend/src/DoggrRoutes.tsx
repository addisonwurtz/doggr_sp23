import { CreateProfile } from "@/Components/CreateProfile.tsx";
import { Home } from "@/Components/HomePage.tsx";
import { Login } from "@/Components/Login.tsx";
import { Logout } from "@/Components/Logout.tsx";
import { Match } from "@/Components/Match.tsx";
import { Message } from "@/Components/Message.tsx";
import { ProtectedRoute } from "@/Components/ProtectedRoute.tsx";
import { ProfileType, State } from "@/DoggrTypes.ts";
import { useAuth } from "@/Services/Auth.tsx";
import { getNextProfileFromServer } from "@/Services/HttpClient.tsx";
import { MatchService } from "@/Services/MatchService.tsx";
import { PassService } from "@/Services/PassService.tsx";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "@css/DoggrStyles.css";
import { ProfileProps } from "@/Components/Profile.tsx";

export function DoggrRouter() {
	const auth = useAuth();
	const [currentProfile, setCurrentProfile] = useState<ProfileType | null>();
	const fetchProfile = useCallback(() => {
		getNextProfileFromServer()
			.then((response) => setCurrentProfile(response))
			.catch((err) => console.log("Error in fetch profile", err));
		//console.log("DoggrRoutes fetchProfile: " + currentProfile);
	}, []);

	useEffect(() => {
		if (currentProfile == null) {
			fetchProfile();
		}
	}, [currentProfile, fetchProfile]);

	return (
		<div className={"doggrfancy"}>
			<nav className="bg-blue-800 rounded-b shadow-lg mb-4">
				<div className="navbar justify-center">
					<div className={"navbar-center lg:flex"}>
						<ul className={"menu menu-horizontal"}>
							<li>
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/match"> Match</Link>
							</li>
							{auth?.token != null ? (
								<li>
									<Link to="/logout">Logout</Link>
								</li>
							) : (
								<>
									<li>
										<Link to="/login"> Login</Link>
									</li>
									<li>
										<Link to="/create"> Create Account</Link>{" "}
									</li>
								</>
							)}
						</ul>
					</div>
				</div>
			</nav>

			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/match"
					element={
						<ProtectedRoute>
							<Match currentProfile={currentProfile} fetchProfile={fetchProfile} />
						</ProtectedRoute>
					}
				/>
				<Route path="/create" element={<CreateProfile />} />
				<Route path="/login" element={<Login />} />
				<Route path="/logout" element={<Logout />} />
				<Route
					path="/messages"
					element={
						<ProtectedRoute>
							<Message currentProfile={currentProfile} fetchProfile={fetchProfile} />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</div>
	);
}
