import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
	useIsAuthenticated,
} from "@azure/msal-react";
import { Result } from "antd";
import "App.css";
import { AdminLayout } from "layouts";
import { Admin, Chart, Home, Login, Report, ReportLog } from "pages";
import React from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppSelector } from "store";
import { ROLES } from "./constants";

const CustomRoutes = () => {
	const isAuthenticated = useIsAuthenticated();
	const location = useLocation();

	if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

	return <Navigate to="/" state={{ from: location }} replace />;
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const location = useLocation();
	const { pathname } = location;

	const userRole = useAppSelector((state) => state.user.role);

	if (!userRole) {
		return (
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={<Link to="/">Back Home</Link>}
			/>
		);
	}

	if (userRole.toLowerCase() === ROLES[0].toLowerCase() && pathname === "/admin") {
		return (
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={<Link to="/">Back Home</Link>}
			/>
		);
	}

	return children;
};

const App = () => {
	return (
		<>
			<AuthenticatedTemplate>
				<Routes>
					<Route element={<AdminLayout />}>
						<Route path="/" element={<Home />} />
						<Route path="/chart" element={<Chart />} />
						<Route
							path="/report"
							element={
								<ProtectedRoute>
									<Report />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/report-log"
							element={
								<ProtectedRoute>
									<ReportLog />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin"
							element={
								<ProtectedRoute>
									<Admin />
								</ProtectedRoute>
							}
						/>
						<Route path="*" element={<CustomRoutes />} />
					</Route>
				</Routes>
			</AuthenticatedTemplate>
			<UnauthenticatedTemplate>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="*" element={<CustomRoutes />} />
				</Routes>
			</UnauthenticatedTemplate>
		</>
	);
};

export default App;
