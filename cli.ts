import { getSongFileURL, getTitle, getMetaTags } from "./lib";
import sanitize from "sanitize-filename";
import pkg from "./package.json";
import minimist from "minimist";
import download from "download";

(async () => {
	const args = minimist(process.argv.slice(2));

	const e = process.exit;

	const OUT_DIR =
		process.platform === "win32"
			? `${process.env.USERPROFILE}\\Downloads`
			: `${process.env.HOME}/ngdl`;

	async function downloadAudio(id: number) {
		const url = await getSongFileURL(id);
		const name = await getTitle(id);

		await download(url, OUT_DIR, {
			filename: `${sanitize(name) || id.toString()}.mp3`,
		});
	}

	async function getAudioInfo(id: number) {
		const info = await getMetaTags(id);
		const TITLE = info["og:title"];
		const DESCRIPTION = info["og:description"];
		const URL = info["og:url"];
		console.log(`Title: ${TITLE}
Description: ${DESCRIPTION}
URL: ${URL}`);
	}

	const help = () =>
		console.log(`Usage:
ngdl -d <id: number>
ngdl -i <id: number>
ngdl -v | --version
ngdl -h | --help`);

	if (args.h || args.help) {
		help();
		e(0);
	}

	if (args.v || args.version) {
		console.log(`ngdl version ${pkg.version}`);
		e(0);
	}

	if (args.d) {
		if (typeof args.d === "number") {
			await downloadAudio(args.d);
			e(0);
		}
		if (typeof args.d === "string") {
			await downloadAudio(parseInt(args.d));
			e(0);
		}
		(args.d as any[]).forEach(async (id) => {
			if (typeof id !== "number" || typeof id !== "string") e(1);
			if (typeof id === "string") await downloadAudio(parseInt(id));
			if (typeof id === "number") await downloadAudio(id);
		});
		e(0);
	}

	if (args.i) {
		if (typeof args.i === "number") {
			await getAudioInfo(args.i);
			e(0);
		}
		if (typeof args.i === "string") {
			await getAudioInfo(parseInt(args.i));
			e(0);
		}
		(args.i as any[]).forEach(async (id) => {
			if (typeof id !== "number" || typeof id !== "string") e(1);
			if (typeof id === "string") await getAudioInfo(parseInt(id));
			if (typeof id === "number") await getAudioInfo(id);
		});
		e(0);
	}
})();
