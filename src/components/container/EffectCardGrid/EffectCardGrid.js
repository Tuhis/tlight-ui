import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./EffectCardGrid.module.css";
import _ from "lodash";
import AddNewCard from "../../presentational/AddNewCard/AddNewCard";
import EffectCard from "../EffectCard/EffectCard";
import { createNewEffect } from "../../../actions/effectActions";

class EffectCardGrid extends React.Component {

    onAddNewEffectClick = () => {
        this.props.onAddNewEffect();
    }

    render() {
        console.log("Rendering EffectCardGrid!");
        console.log(this.props);

        return (
            <div className={styles["card-container"]}>
                {
                    _.map(this.props.effectIds, id =>
                        <EffectCard
                            id={id}
                            key={id} />
                    )
                }
                <AddNewCard
                    onClick={this.onAddNewEffectClick} />
            </div>
        );
    }
}

EffectCardGrid.propTypes = {
    onAddNewEffect: PropTypes.func.isRequired,
    effectIds: PropTypes.array.isRequired
};

EffectCardGrid.defaultProps = {
    onAddNewEffect: _.noop,
    effectIds: []
};

const mapStateToProps = (state, ownProps) => {

    return {
        effectIds: _.map(state.effects.configuredEffects, effect => effect.id)
    }
};

const mapDispatchToProps = dispatch => ({
    onAddNewEffect: () => dispatch(createNewEffect())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EffectCardGrid);
