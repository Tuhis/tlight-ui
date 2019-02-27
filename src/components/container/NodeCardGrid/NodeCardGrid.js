import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./NodeCardGrid.module.css";
import NodeCard from "../NodeCard/NodeCard";
import _ from "lodash";

class NodeCardGrid extends React.Component {

    renderNodeCards() {
        return _.map(this.props.nodeIds, id => {
            return (
                <NodeCard
                    key={id}
                    id={id} />
            );
        });
    }

    render() {
        console.log(this.props);

        return (
            <div className={styles["card-container"]}>
                {this.renderNodeCards()}
            </div>
        );
    }
}

NodeCardGrid.propTypes = {
    nodeIds: PropTypes.array.isRequired
};

NodeCardGrid.defaultProps = {
    nodeIds: []
};

const mapStateToProps = state => ({
    nodeIds: ((nodes) => _.keys(nodes)) (state.nodes)
});

export default connect(
    mapStateToProps
)(NodeCardGrid);
