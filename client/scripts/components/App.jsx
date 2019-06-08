import React from "react";
import "style.less";

export default class App extends React.Component {
	static propTypes = {
		"children": React.PropTypes.oneOfType([
			React.PropTypes.element,
			React.PropTypes.arrayOf(React.PropTypes.element)
		])
	}

	render() {
		return (
			<section
			>
				{this.props.children}
			</section>
		);
	}
}
