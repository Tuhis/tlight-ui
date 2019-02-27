import React from "react";
import PropTypes from "prop-types";
import styles from "./BaseCard.module.css";
import Divider from "../Divider/Divider";

import "./BaseCardOverride.css";

const BaseCard = props => {
    return (
        <div className={
            styles.basecard +
            " base-card " +
            (props.autoHeight ? styles["auto-height"] : styles["fixed-height"])}>

            {props.showTitle &&
                <React.Fragment>
                    <h2>{props.title}</h2>
                    <Divider className={styles.divider} />
                </React.Fragment>
            }

            {props.children}
        </div>
    );
};

BaseCard.propTypes = {
    title: PropTypes.string.isRequired,
    autoHeight: PropTypes.bool.isRequired,
    showTitle: PropTypes.bool.isRequired
};

BaseCard.defaultProps = {
    title: "Card Title",
    autoHeight: false,
    showTitle: true
};

export default BaseCard;
