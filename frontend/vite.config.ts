import react from "@vitejs/plugin-react-swc";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Generates ascii 65-90 (Capital letters) into array Vite is expecting
const alphabet = Array.from(Array(26), (v, k) => {
	return String.fromCharCode(k + 65);
});

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [react(), tsconfigPaths()],
		test: {
			globals: true,
			environment: "jsdom",
			setupFiles: "./test/setup.ts",
		},
		// added this becuase of weird build error saying I had top level await
		//build: {
		//	target: "esnext",
		//},
		// vite config
		// https://github.com/vitejs/vite/pull/9880 I am so angry about this
		envPrefix: alphabet,
	};
});
