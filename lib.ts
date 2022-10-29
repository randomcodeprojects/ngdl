import { JSDOM } from "jsdom";
import axios from "axios";

async function _getData(id: number) {
	return (await axios.get(`https://newgrounds.com/audio/listen/${id}`))
		.data as string;
}

/**
 * Gets The Title Of A Song In Newgrounds
 * @param id {number}
 */
export async function getTitle(id: number) {
	const data = await _getData(id);

	const { document } = new JSDOM(data).window;

	return document.title;
}

/**
 * Gets All The Link Tags In A Newgrounds Song Page
 * @param id {number}
 */
export async function getLinkTags(id: number) {
	const data = await _getData(id);

	const { document } = new JSDOM(data).window;

	const linkTags = Array.from(document.head.querySelectorAll("link")).map(
		(link) => {
			const sizes = link.attributes.getNamedItem("sizes")?.value;

			return {
				rel: link.rel,
				href: link.href,
				sizes:
					link.rel === "apple-touch-icon" && sizes ? { sizes } : "",
			};
		}
	);

	return linkTags;
}

/**
 * Gets All The Meta Tags In A Newgrounds Song Page
 * @param id {number}
 */
export async function getMetaTags(id: number) {
	const data = await _getData(id);

	const { document } = new JSDOM(data).window;

	const metaArray = Array.from(document.head.querySelectorAll("meta")).map(
		(meta) => {
			const name =
				meta.name ||
				meta.attributes.getNamedItem("property")?.value ||
				meta.httpEquiv;

			const value = meta.content;

			return { [name]: value };
		}
	);

	return metaArray.reduce((total, current) => {
		const [k, v] = Object.entries(current)[0];

		return { ...total, [k]: v };
	}, {});
}

/**
 * Gets The Url Of A Song File In Newgrounds
 * @param id {number}
 */
export async function getSongFileURL(id: number) {
	const data = await _getData(id);

	const { document } = new JSDOM(data).window;

	const script = Array.from(document.querySelectorAll("script"))
		.map((script) => script.innerHTML)
		.map((script) => script.replace(/\n/g, "\n").replace(/\t/g, "\t"))
		.filter((script) => script !== undefined || script !== "")
		.filter((script) =>
			script.includes("var embed_controller = new embedController")
		)[0]
		.replace(/var embed_controller = new embedController\(\[\{"url":"/g, "")
		.split('","is_published"')[0]
		.replace(/\\\//g, "/");

	return script;
}
