import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import styles from "./BaseCard.module.css";
import Divider from "../Divider/Divider";

import "./BaseCardOverride.css";

const BaseCard = ({
    title = "Card Title",
    autoHeight = false,
    autoWidth = true,
    minHeight = 0,
    showTitle = true,
    editableTitle = false,
    onTitleChange = _.noop,
    children
}) => {
    return (
        <div className={
            styles.basecard +
            " base-card " +
            (autoHeight ? styles["auto-height"] : styles["fixed-height"]) + " " +
            (autoWidth ? styles["auto-width"] : styles["fixed-width"])}
            style={{ minHeight: minHeight }} >

            {showTitle &&
                <React.Fragment>
                    {editableTitle ?
                        <input
                            className={styles["title-input"]}
                            type="text"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)} />
                        :
                        <h2>{title}</h2>
                    }
                    <Divider className={styles.divider} />
                </React.Fragment>
            }

            {children}
        </div>
    );
};

BaseCard.propTypes = {
    title: PropTypes.string,
    autoHeight: PropTypes.bool,
    autoWidth: PropTypes.bool,
    minHeight: PropTypes.number,
    showTitle: PropTypes.bool,
    editableTitle: PropTypes.bool,
    onTitleChange: PropTypes.func,
    children: PropTypes.node
};

export default BaseCard;
