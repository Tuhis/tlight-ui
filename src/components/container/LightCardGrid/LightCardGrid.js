import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styles from "./LightCardGrid.module.css";
import _ from "lodash";
import LightCard from "../LightCard/LightCard";

function LightCardGrid() {
    // Use React Router v6 useParams hook
    const { nodeId } = useParams();
    const lightIds = useSelector(state => {
        if (!nodeId || !state.lightValues[nodeId]) {
            return [];
        }
        return _.keys(state.lightValues[nodeId]);
    });

    console.log("Rendering LightCardGrid!");
    console.log({ lightIds, nodeId });

    return (
        <div className={styles["card-container"]}>
            {_.map(lightIds, id => {
                return (
                    <LightCard
                        key={id}
                        id={id}
                        nodeId={nodeId} />
                );
            })}
        </div>
    );
}

LightCardGrid.propTypes = {
    lightIds: PropTypes.array.isRequired,
    nodeId: PropTypes.string
};

LightCardGrid.defaultProps = {
    lightIds: []
};

export default LightCardGrid;
