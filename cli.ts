import { getSongFileURL, getTitle, getMetaTags } from ".";
import sanitize from "sanitize-filename";
import download from "download";

(async () => {
	const [, , mode, id] = process.argv;

	const help = () =>
		console.log(`Usage: 
ngdl -d | --download <id: number>
ngdl -i | --info <id: number>
ngdl -v | --version
ngdl -h | --help`);

	if (mode === "-d" || mode === "--download") {
		const OUT_DIR =
			process.platform === "win32"
				? `${process.env.USERPROFILE}\\Downloads`
				: `${process.env.HOME}/ngdl`;

		if (!id) {
			console.log("No ID Provided");
			process.exit(1);
		}

		const url = await getSongFileURL(parseInt(id));
		const name = await getTitle(parseInt(id));

		await download(url, OUT_DIR, {
			filename: `${sanitize(name) || "file"}.mp3`,
		});
	} else if (mode === "-v" || mode === "--version") {
		console.log(`ngdl v${require("../package.json").version}`);
	} else if (mode === "-i" || mode === "--info") {
		const info = await getMetaTags(parseInt(id));

		const TITLE = info["og:title"];
		const DESCRIPTION = info["og:description"];
		const URL = info["og:url"];

		console.log(`Title: ${TITLE}
Description: ${DESCRIPTION}
URL: ${URL}`);
	} else if (mode === "-h" || mode === "--help") {
		help();
	} else {
		console.log("No Mode Provided Or Mode Not Recognized");
		help();
		process.exit(1);
	}
})();
