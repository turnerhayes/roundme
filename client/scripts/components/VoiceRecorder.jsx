import React from "react";
import VoiceRecorder from "../voice-recorder";

export default class VoiceRecorderComponent extends React.Component {
	static propTypes = {
		"onRecordingFinished": React.PropTypes.func
	}

	state = {
		isRecording: false
	}

	recorder = new VoiceRecorder()

	constructor(props) {
		super(props);
		
		this.recorder.on("recording-started", () => this._toggleRecordingState(true));
		this.recorder.on("recording-stopped", () => {
			if (this.props.onRecordingFinished) {
				this.props.onRecordingFinished(this.recorder.getBlob());
			}
			this._toggleRecordingState(false);
		});
	}

	_toggleRecordingState(status) {
		if (status === void  0) {
			status = !this.state.isRecording;
		}

		this.setState({ "isRecording": status });
	}

	render() {
		return (
			<div>
				<button
					type="button"
					disabled={this.state.isRecording}
					onClick={() => this.recorder.start()}>
					Start
				</button>
				<button
					type="button"
					disabled={!this.state.isRecording}
					onClick={() => this.recorder.stop()}>
					Stop
				</button>
			</div>
		);
	}
}
