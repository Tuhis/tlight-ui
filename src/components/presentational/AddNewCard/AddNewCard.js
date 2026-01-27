import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import styles from "./AddNewCard.module.css";
import BaseCard from "../BaseCard/BaseCard";

const AddNewCard = ({
    title = "Add New",
    onClick = _.noop,
    autoWidth = false,
    minHeight,
    autoHeight
}) => {
    return (
        <BaseCard
            showTitle={false}
            minHeight={minHeight}
            autoHeight={autoHeight}
            autoWidth={autoWidth}
            className={styles["card-hover"]} >

            <div
                onClick={onClick}
                className={styles.container}>
                <div className={styles.icon}>
                    +
                </div>
                <div className={styles.text}>
                    {title}
                </div>
            </div>

        </BaseCard>
    );
};

AddNewCard.propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func,
    minHeight: PropTypes.number,
    autoHeight: PropTypes.bool,
    autoWidth: PropTypes.bool
};

export default AddNewCard;
