import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./EffectCardGrid.module.css";
import _ from "lodash";
import AddNewCard from "../../presentational/AddNewCard/AddNewCard";

class EffectCardGrid extends React.Component {

    render() {
        console.log("Rendering EffectCardGrid!");
        console.log(this.props);

        return (
            <div className={styles["card-container"]}>
                <AddNewCard />
            </div>
        );
    }
}

EffectCardGrid.propTypes = {
};

EffectCardGrid.defaultProps = {
};

const mapStateToProps = (state, ownProps) => {

    return {
    }
};

export default connect(
    mapStateToProps
)(EffectCardGrid);
