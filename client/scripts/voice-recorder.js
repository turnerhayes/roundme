import Promise from "bluebird";
import EventEmitter from "events";
import RecorderJS from "recorderjs";
import audioContext from "./audio-context";

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

		this.recorderPromise = GET_USER_MEDIA_PROMISE.then(
			stream => {
				const recorder = new RecorderJS(audioContext.createMediaStreamSource(stream));

				return recorder;
			}
		);
	}

	start = () => {
		this.recorderPromise.then(
			recorder => {
				recorder.record();
				_handleStart(this);
			}
		);
	}

	stop = () => {
		this.recorderPromise.then(
			recorder => {
				recorder.stop();
				_handleStop(this);
			}
		);
	}

	save = (filename = "roundme.wav") => this.getBlob().then(
		blob => RecorderJS.forceDownload(blob, filename)
	)

	getBlob = () => {
		return this.recorderPromise.then(
			recorder => new Promise(
				(resolve) => {
					recorder.exportWAV(resolve);
				}
			)
		);
	}
}
