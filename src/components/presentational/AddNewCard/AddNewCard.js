import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import styles from "./AddNewCard.module.css";
import BaseCard from "../BaseCard/BaseCard";

const AddNewCard = props => {
    return (
        <BaseCard
            showTitle={false} >

            <div
                onClick={props.onClick}
                className={styles.container}>
                <div className={styles.icon}>
                    +
                </div>
                <div className={styles.text}>
                    {props.title}
                </div>
            </div>

        </BaseCard>
    );
};

AddNewCard.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

AddNewCard.defaultProps = {
    title: "Add New",
    onClick: _.noop
};

export default AddNewCard;
