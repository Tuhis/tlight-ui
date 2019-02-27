import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./LightCardGrid.module.css";
import _ from "lodash";
import LightCard from "../LightCard/LightCard";

class LightCardGrid extends React.Component {

    renderLightCards() {
        return _.map(this.props.lightIds, id => {
            return (
                <LightCard
                    key={id}
                    id={id}
                    nodeId={this.props.nodeId} />
            );
        });
    }

    render() {
        console.log("Rendering LightCardGrid!");
        console.log(this.props);

        return (
            <div className={styles["card-container"]}>
                {this.renderLightCards()}
            </div>
        );
    }
}

LightCardGrid.propTypes = {
    lightIds: PropTypes.array.isRequired,
    nodeId: PropTypes.string
};

LightCardGrid.defaultProps = {
    lightIds: []
};

const mapStateToProps = (state, ownProps) => {
    const nodeId = _.get(ownProps, "match.params.nodeId", null);

    return {
        lightIds: ((lights) => _.keys(lights))(state.lightValues[nodeId]),
        nodeId
    }
};

export default connect(
    mapStateToProps
)(LightCardGrid);
