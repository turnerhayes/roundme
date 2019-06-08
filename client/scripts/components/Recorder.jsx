import { uniqueId, isEmpty, size } from "lodash";
import React from "react";
import { withRouter } from "react-router";
import HTML5Backend, { NativeTypes } from "react-dnd-html5-backend";
import { DragDropContext, DropTarget } from "react-dnd";
import WaveSurfer from "wavesurfer";
import "wavesurfer/dist/plugin/wavesurfer.microphone.min";
import VoiceRecorder from "../voice-recorder";
import "font-awesome/less/font-awesome.less";
import "recorder.less";

const SKIP_LENGTH_IN_SECONDS = 200/1000;

const dropSpec = {
	canDrop(props, monitor) {
		const dropItem = monitor.getItem();

		console.log(dropItem);

		if (size(dropItem.files) !== 1) {
			return false;
		}

		if (!dropItem.files[0].type === "audio/wav") {
			return false;
		}

		return true;
	},

	drop(props, monitor, component) {
		if (monitor.didDrop()) {
			return;
		}

		const dropItem = monitor.getItem();

		if (!isEmpty(dropItem.files)) {
			component.loadFile(dropItem.files[0]);
		}
	}
};

function collect(connect, monitor) {
	return {
		"connectDropTarget": connect.dropTarget(),
		"isOver": monitor.isOver(),
		"isOverCurrent": monitor.isOver({ "shallow": true }),
		"canDrop": monitor.canDrop(),
		"itemType": monitor.getItemType()
	};
}

@withRouter
@DragDropContext(HTML5Backend)
@DropTarget(NativeTypes.FILE, dropSpec, collect)
export default class RecorderComponent extends React.Component {
	componentID = uniqueId("recorder-component-")

	static propTypes = {
		"connectDropTarget": React.PropTypes.func,
		"router": React.PropTypes.object
	}

	state = {
		"isPlaying": false,
		"isRecording": false,
		"recordedData": null,
		"uploadedFile": null
	}

	componentDidMount() {
		this.surfer = WaveSurfer.create({
			"container": `#${this.componentID}`,
			"scrollParent": true
		});

		const startedPlaying = () => {
			this.setState({ "isPlaying": true });
		};

		const stoppedPlaying = () => {
			this.setState({ "isPlaying": false });
		};

		this.surfer.on("error", err => console.error(err));
		this.surfer.on("play", startedPlaying);
		this.surfer.on("finish", stoppedPlaying);
		this.surfer.on("pause", stoppedPlaying);

		this.microphone = Object.create(WaveSurfer.Microphone);

		this.microphone.on(
			"deviceError",
			err => {
				// eslint-ignore-next-line no-console
				console.error(err);
			}
		);

		this.voiceRecorder = new VoiceRecorder();

		this.microphone.init({
			"wavesurfer": this.surfer
		});
	}

	componentWillUnmount() {
		this.microphone.destroy();
		delete this.microphone;
		this.surfer.destroy();
		delete this.surfer;
	}

	startRecording = () => {
		this.microphone.start();
		this.voiceRecorder.start();
		this.setState({
			"isRecording": true,
			"uploadedFile": null
		});
	}

	stopRecording = () => {
		this.microphone.stop();
		this.voiceRecorder.stop();
		this.setState({ "isRecording": false });

		this.voiceRecorder && this.voiceRecorder.getBlob().then(
			blob => {
				// WAV header is 44 bytes; if blob has only 44 bytes, no data recorded
				if (blob.size === 44) {
					throw new Error("No audio data appears to have been captured");
				}

				this.setState({"recordedData": blob});
				this.surfer.loadBlob(blob);

				window._FILE = blob;
			}
		);
	}

	loadFile = file => {
		this.setState({
			"uploadedFile": file,
			"recordedData": null
		});
		// this.surfer.loadBlob(file);

		window._FILE = file;
		this.props.router.push("/round");
	}

	handleRecordButtonClicked = () => {
		if (this.state.isRecording) {
			this.stopRecording();
		}
		else {
			this.startRecording();
		}
	}

	handleSaveButtonClicked = () => {
		this.voiceRecorder && this.voiceRecorder.save();
	}

	handleOpenFileButtonClicked = () => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";

		fileInput.onchange = event => {
			const files = event.target.files;

			if (isEmpty(files)) {
				return;
			}

			const file = Array.from(files).find(
				f => f.type === "audio/wav"
			);

			this.loadFile(file);
		}

		fileInput.click();
	}

	handlePlayButtonClicked = () => {
		this.surfer.playPause();
	}

	handleSkipBackButtonClicked = () => {
		this.surfer.skipBackward(SKIP_LENGTH_IN_SECONDS);
	}

	handleSkipForwardButtonClicked = () => {
		this.surfer.skipForward(SKIP_LENGTH_IN_SECONDS);
	}

	render() {
		return this.props.connectDropTarget(
			<div
				className="recorder-container"
			>
				<button
					type="button"
					onClick={this.handleRecordButtonClicked}
					disabled={this.state.isPlaying}
					className={`fa fa-2x fa-circle record-button ${this.state.isRecording ? "recording": "not-recording"}`}
					aria-label={this.state.isRecording ? "Stop Recording": "Record"}
					title={this.state.isRecording ? "Stop Recording": "Record"}
				></button>
				<button
					type="button"
					onClick={this.handleOpenFileButtonClicked}
					className={`fa fa-2x fa-folder-open`}
					aria-label="Open File"
					title="Open File"
				></button>
				<button
					type="button"
					onClick={this.handleSaveButtonClicked}
					disabled={!this.state.recordedData}
					className={`fa fa-2x fa-save save-button ${this.state.recordedData ? "" : "hidden"}`}
					aria-label="Save Recording"
					title="Save Recording"
				></button>
				<div id={this.componentID}>
					<div
						className={`instruction-message ${this.state.isRecording || this.state.recordedData ? "hidden" : ""}`}
					>
						Record audio, or select an existing .wav audio file by dragging and dropping it here, or by clicking the folder icon above
					</div>
				</div>
				<div
					className={`playback-controls ${this.state.recordedData || this.state.uploadedFile ? "" : "hidden"}`}
				>
					<button
						type="button"
						onClick={this.handleSkipBackButtonClicked}
						className="fa fa-2x fa-step-backward"
						aria-label="Go Back"
						title="Go Back"
					></button>
					<button
						type="button"
						onClick={this.handlePlayButtonClicked}
						className={`fa fa-2x fa-${this.state.isPlaying ? "pause" : "play"}`}
						disabled={!(this.state.recordedData || this.state.uploadedFile )}
						aria-label={`${this.state.isPlaying ? "Pause" : "Play"} Audio`}
						title={`${this.state.isPlaying ? "Pause" : "Play"} Audio`}
					></button>
					<button
						type="button"
						onClick={this.handleSkipForwardButtonClicked}
						className="fa fa-2x fa-step-forward"
						aria-label="Go Forward"
						title="Go Forward"
					></button>
				</div>
			</div>
		);
	}
}
