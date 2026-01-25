import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import styles from "./EffectCardGrid.module.css";
import _ from "lodash";
import AddNewCard from "../../presentational/AddNewCard/AddNewCard";
import EffectCard from "../EffectCard/EffectCard";
import { createNewEffect } from "../../../actions/effectActions";

function EffectCardGrid() {
    const dispatch = useDispatch();
    const effectIds = useSelector(state => _.map(state.effects.configuredEffects, effect => effect.id));

    const onAddNewEffectClick = () => {
        dispatch(createNewEffect());
    };

    console.log("Rendering EffectCardGrid!");
    console.log({ effectIds });

    return (
        <div className={styles["card-container"]}>
            {
                _.map(effectIds, id =>
                    <EffectCard
                        id={id}
                        key={id} />
                )
            }
            <AddNewCard
                onClick={onAddNewEffectClick}
                autoHeight />
        </div>
    );
}

EffectCardGrid.propTypes = {
    onAddNewEffect: PropTypes.func.isRequired,
    effectIds: PropTypes.array.isRequired
};

EffectCardGrid.defaultProps = {
    onAddNewEffect: _.noop,
    effectIds: []
};

export default EffectCardGrid;
