import { uniqueId } from "lodash";
import $ from "jquery";
import React from "react";
import WaveSurfer from "wavesurfer";
import "font-awesome/less/font-awesome.less";
import "waveform-viewer.less";

const SKIP_LENGTH_IN_SECONDS = 200/1000;

export default class WaveformViewerComponent extends React.Component {
	componentID = uniqueId("waveform-viewer-component-")

	static propTypes = {
		"file": React.PropTypes.object,
		"onRecordingFinished": React.PropTypes.func
	}

	state = {
		"currentTime": undefined,
		"isPlaying": false,
		"isRecording": false,
		"hasRecordedData": false
	}

	componentDidMount() {
		this.surfer = WaveSurfer.create({
			"container": `#${this.componentID}`,
			"scrollParent": true
		});

		const updateCurrentTime = () => {
			this.setState({ "currentTime": this.surfer.getCurrentTime() });
		};

		this.surfer.on("audioprocess", updateCurrentTime);
		this.surfer.on("seek", updateCurrentTime);
		this.surfer.on("pause", () => this.setState({ "isPlaying": false }));
		this.surfer.on("finish", () => this.setState({ "isPlaying": false }));
		this.surfer.on("play", () => this.setState({ "isPlaying": true }));
		this.surfer.on("error", err => console.error(err));

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

		$(document).on(
			"keydown." + this.componentID,
			event => {
				if (event.key === " ") {
					this.togglePlaying();
				}
				else if (event.key === "ArrowLeft") {
					this.surfer.pause();

					let skipLength = SKIP_LENGTH_IN_SECONDS;
					if (event.ctrlKey) {
						skipLength = skipLength / 10;
					}

					this.surfer.skipBackward(skipLength);
				}
				else if (event.key === "ArrowRight") {
					this.surfer.pause();

					let skipLength = SKIP_LENGTH_IN_SECONDS;
					if (event.ctrlKey) {
						skipLength = skipLength / 10;
					}

					this.surfer.skipForward(skipLength);
				}
			}
		);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.file) {
			this.surfer.loadBlob(nextProps.file);
		}
	}

	componentWillUnmount() {
		if (this.surfer) {
			this.surfer.destroy();
			delete this.surfer;
		}
	}

	togglePlaying = () => {
		this.surfer.playPause();
		this.setState({ "isPlaying": this.surfer.isPlaying() });
	}

	displayTime = (time) => {
		if (time === void 0) {
			return "";
		}

		const minutes = ("0" + Math.floor(time / 60)).slice(-2);
		const seconds = ("0" + Math.floor(time % 60)).slice(-2);
		const milliseconds = ("00" + Math.floor((time - minutes - seconds) * 1000)).slice(-3);

		return `${minutes}:${seconds}:${milliseconds}`;
	}

	handlePlayButtonClicked = event => {
		this.togglePlaying();
		event.target.blur();
	}

	render() {
		return (
			<div
				className="waveform-viewer-container"
			>
				<button
					type="button"
					onClick={this.handlePlayButtonClicked}
					disabled={!this.props.file}
					className={`fa fa-${this.state.isPlaying ? "pause" : "play"}`}
					aria-label={this.state.isPlaying ? "Pause": "Play"}
					title={this.state.isPlaying ? "Pause": "Play"}
				></button>
				<button
					type="button"
					onClick={this.handleRecordButtonClicked}
					disabled={this.state.isPlaying}
					className={`fa fa-circle record-button ${this.state.isRecording ? "recording": ""}`}
					aria-label={this.state.isRecording ? "Stop Recording": "Record"}
					title={this.state.isRecording ? "Stop Recording": "Record"}
				></button>
				<button
					type="button"
					onClick={this.handleSaveButtonClicked}
					disabled={!this.state.hasRecordedData}
					className={`fa fa-save`}
				></button>
				<input
					type="text"
					value={this.displayTime(this.state.currentTime)}
					onChange={this.handleTimestampChanged}
				/>
				<div id={this.componentID}>
				</div>
			</div>
		);
	}
}
