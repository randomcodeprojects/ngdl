import { JSDOM } from "jsdom";
import axios from "axios";

async function _getDocument(id: number) {
	const req = await axios.get(`https://newgrounds.com/audio/listen/${id}`);
	const dom = new JSDOM(req.data);
	return dom.window.document;
}

export async function getTitle(id: number) {
	const document = await _getDocument(id);

	return document.title;
}

export async function getMetaTags(id: number) {
	const document = await _getDocument(id);

	const metaArray = Array.from(document.head.querySelectorAll("meta")).map(
		(meta, idx) => {
			const name =
				meta.name ||
				meta.attributes.getNamedItem("property")?.value ||
				meta.httpEquiv ||
				idx.toString();

			return { [name]: meta.content };
		}
	);

	return metaArray.reduce((total, current) => {
		return { ...total, ...current };
	}, {});
}

export async function getSongFileURL(id: number) {
	return `https://newgrounds.com/audio/download/${id}`;
}
