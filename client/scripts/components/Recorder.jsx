import React from "react";
import VoiceRecorderComponent from "./VoiceRecorder";
import PlaybackComponent from "./Playback";

export default class RecorderComponent extends React.Component {
	state = {
		"audioBlob": null
	}

	handleRecordingFinished = audioBlob => {
		this.setState({ "audioBlob": audioBlob });
	}

	render() {
		return (
			<div>
				<VoiceRecorderComponent
					onRecordingFinished={this.handleRecordingFinished}
				/>
				<PlaybackComponent
					file={this.state.audioBlob}
				/>
			</div>
		);
	}
}
