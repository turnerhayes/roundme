import React from "react";
import Player from "../player";

export default class RoundPlayerComponent extends React.Component {
	state = {
		"isPlaying": false,
		"file": null
	}

	componentDidMount() {
		this.setState({ "file": window._FILE });
	}

	render() {
		return (
			<div
			>
				<button
					type="button"
					className={`fa fa-2x fa-${this.state.isPlaying ? "pause" : "play"}`}
					onClick={() => this.state.file && Player.playFile(this.state.file)}
					aria-label={this.state.isPlaying ? "Pause" : "Play"}
					title={this.state.isPlaying ? "Pause" : "Play"}
				></button>
			</div>
		);
	}
}
