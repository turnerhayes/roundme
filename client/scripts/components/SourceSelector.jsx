import React from "react";
import DropzoneComponent from "react-dropzone";
import RecorderComponent from "./Recorder";

export default class SourceSelectorComponent extends React.Component {
	state = {
		"audioBlob": null
	}

	handleRecordingFinished = audioBlob => {
		this.setState({ "audioBlob": audioBlob });
	}

	handleFileDropped = accepted => {
		this.setState({ "audioBlob": accepted[0] });
	}

	render() {
		return (
			<div>
				<DropzoneComponent
					accept="audio/wav"
					onDrop={this.handleFileDropped}
				>
					Upload a .wav audio file
				</DropzoneComponent>
				<RecorderComponent
					onRecordingFinished={this.handleRecordingFinished}
				/>
			</div>
		);
	}
}
