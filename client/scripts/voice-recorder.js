import Promise from "bluebird";
import EventEmitter from "events";

const GET_USER_MEDIA_PROMISE = new Promise(
	(resolve, reject) => {
		navigator.getUserMedia(
			{
				"audio": true,
			},
			resolve,
			reject
		);
	}
);

const MIME_TYPE = ["audio/wav", "audio/webm"].find(MediaRecorder.isTypeSupported);

if (MIME_TYPE === void 0) {
	throw new Error("No known audio MIME type is supported by this media recorder");
}

function _handleStart(voiceRecorder) {
	voiceRecorder.isRecording = true;
	voiceRecorder.emit("recording-started");
}

function _handleStop(voiceRecorder) {
	voiceRecorder.isRecording = false;
	voiceRecorder.emit("recording-stopped");
}

export default class VoiceRecorder extends EventEmitter {
	constructor() {
		super();

		this.blobs = [];

		this.recorderPromise = GET_USER_MEDIA_PROMISE.then(
			stream => {
				const recorder = new MediaRecorder(stream, {
					"mimeType": MIME_TYPE
				});
				recorder.ignoreMutedMedia = true;
				recorder.ondataavailable = blob => {
					this.blobs.push(blob);
				};

				recorder.onstop = recorder.onpause = () => {
					_handleStop(this);
				};

				recorder.onstart = recorder.onresume = () => {
					_handleStart(this);
				};

				return recorder;
			}
		);
	}

	start = () => {
		this.recorderPromise.then(
			recorder => {
				recorder.start();
			}
		);
	}

	stop = () => {
		this.recorderPromise.then(
			recorder => {
				recorder.stop();
			}
		);
	}

	getBlob = () => new Blob(this.blobs, { "type": "audio/wav" });
}
