import _ from "lodash";
import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { push } from 'connected-react-router'
import { Sidebar } from "./components/presentational/Sidebar/Sidebar";
import './App.css';
import Topbar from './components/presentational/Topbar/Topbar';
import BigLinkList from './components/presentational/BigLinkList/BigLinkList';
import Breadcrumbs from './components/presentational/Breadcrumbs/Breadcrumbs';
import NodeCardGrid from './components/container/NodeCardGrid/NodeCardGrid';
import LightCardGrid from "./components/container/LightCardGrid/LightCardGrid";
import EffectCardGrid from "./components/container/EffectCardGrid/EffectCardGrid";

class App extends Component {

    constructor(props) {
        super(props);

        this.navigateTo = this.navigateTo.bind(this);
    }

    navigateTo(path) {
        this.props.push(path);
    }

    render() {
        const sidebarLinks = [
            {
                text: "Nodes",
                onClick: () => this.navigateTo("/nodes")
            },
            {
                text: "Effects",
                onClick: () => this.navigateTo("/effects")
            },
            {
                text: "Groups",
                onClick: () => this.navigateTo("/groups")
            }
        ];

        return (
            <div className="App">

                <Sidebar>
                    <BigLinkList links={sidebarLinks} />
                </Sidebar>

                <div className={"content"}>
                    <Topbar>
                        <Breadcrumbs path={this.props.breadcrumbPath} />
                    </Topbar>

                    <Switch>
                        <Route exact path="/nodes" component={NodeCardGrid} />
                        <Route exact path="/effects" component={EffectCardGrid} />
                        <Route exact path="/groups" />
                        <Route path="/nodes/:nodeId/lights" component={LightCardGrid} />
                        <Redirect to="/nodes" />
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    breadcrumbPath: _.chain(state.router.location.pathname)
                     .split("/")
                     .compact()
                     .map(e => _.startCase(_.toLower(e)))
                     .value()
});

const mapDispatchToProps = dispatch => ({
    push: path => dispatch(push(path))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
