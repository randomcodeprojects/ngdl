import { getSongFileURL, getTitle, getMetaTags } from "./lib";
import sanitize from "sanitize-filename";
import pkg from "./package.json";
import minimist from "minimist";
import download from "download";

(async () => {
	const args = minimist(process.argv.slice(2));

	const OUT_DIR =
		args.o || args.output || process.platform === "win32"
			? `${process.env.USERPROFILE}\\Downloads`
			: `${process.env.HOME}/ngdl`;

	async function downloadAudio(id: number) {
		const url = await getSongFileURL(id);
		const name = await getTitle(id);

		await download(url, OUT_DIR, {
			filename: `${sanitize(name) || id.toString()}.mp3`,
			followRedirect: true,
		});
	}

	async function logInfoToConsole(id: number) {
		const info = await getMetaTags(id);
		console.log(`Title: ${info["og:title"]}
Description: ${info["og:description"]}
URL: ${info["og:url"]}
Image URL: ${info["og:image"]}
`);
	}

	const help = `Usage:
ngdl -d <id: number> -> Downloads The Song With The Specified Id
ngdl -i <id: number> -> Gets The Info Of The Song With The Specified Id
ngdl -v -> Gets The Current Version
ngdl -h -> Shows This Help Message`;

	if (args.h) console.log(help);
	if (args.v) console.log(`ngdl v${pkg.version}`);

	if (args.d) {
		if (typeof args.d === "number") await downloadAudio(args.d);
		if (typeof args.d === "string") await downloadAudio(parseInt(args.d));
		if (typeof args.d === "object" && Array.isArray(args.d)) {
			for (let id of args.d) {
				if (typeof id === "number") await downloadAudio(id);
				if (typeof id === "string") await downloadAudio(parseInt(id));
			}
		}
	}

	if (args.i) {
		if (typeof args.i === "number") await logInfoToConsole(args.i);
		if (typeof args.i === "string")
			await logInfoToConsole(parseInt(args.i));
		if (typeof args.i === "object" && Array.isArray(args.i)) {
			for (let id of args.i) {
				if (typeof id === "number") await logInfoToConsole(id);
				if (typeof id === "string")
					await logInfoToConsole(parseInt(id));
			}
		}
	}
})();
