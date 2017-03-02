import Promise from "bluebird";
import audioContext from "./audio-context";

function loadFile(file) {
	return new Promise(
		(resolve, reject) => {
			const reader = new FileReader();
			
			reader.onload = event => {
				resolve(event.target.result);
			};

			reader.onerror = err => {
				reject(err);
			};

			reader.onabort = () => {
				reject();
			};

			reader.readAsArrayBuffer(file);
		}
	);
}

function createFileSourceNode(file) {
	return loadFile(file).then(
		buffer => audioContext.createBufferSource(buffer)
	);
}

export default class Player {
	static playFile(file) {
		return createFileSourceNode(file).then(
			node => {
				node.connect(audioContext.destination);
				node.start();
			}
		);
	}
}
