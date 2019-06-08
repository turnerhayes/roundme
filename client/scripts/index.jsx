import React from "react";
import { render } from "react-dom";
import { Router, browserHistory, Route, IndexRoute } from "react-router";
import SourceSelectorComponent from "./components/SourceSelector";
import AppComponent from "./components/App";
import RoundPlayerComponent from "./components/RoundPlayer";

render(
	<Router history={browserHistory}>
		<Route name="Home" path="/" component={AppComponent}>
			<IndexRoute component={SourceSelectorComponent} />

			<Route name="Round" path="/round" component={RoundPlayerComponent} />
		</Route>
	</Router>,
	document.getElementById("app")
);
