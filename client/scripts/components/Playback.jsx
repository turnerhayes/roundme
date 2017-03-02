import React from "react";
import Player from "../player";

export default class PlaybackComponent extends React.Component {
	static propTypes = {
		"file": React.PropTypes.object
	}

	playFile = () => {
		Player.playFile(this.props.file);
	}

	render() {
		return (
			<div>
				<button
					type="button"
					disabled={this.props.file === null}
					onClick={this.playFile}
				>
					Play
				</button>
			</div>
		);
	}
}
