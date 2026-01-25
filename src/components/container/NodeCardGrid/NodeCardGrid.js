import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import styles from "./NodeCardGrid.module.css";
import NodeCard from "../NodeCard/NodeCard";
import _ from "lodash";

function NodeCardGrid() {
    const nodeIds = useSelector(state => _.keys(state.nodes));

    console.log({ nodeIds });

    return (
        <div className={styles["card-container"]}>
            {_.map(nodeIds, id => {
                return (
                    <NodeCard
                        key={id}
                        id={id} />
                );
            })}
        </div>
    );
}

NodeCardGrid.propTypes = {
    nodeIds: PropTypes.array.isRequired
};

NodeCardGrid.defaultProps = {
    nodeIds: []
};

export default NodeCardGrid;
