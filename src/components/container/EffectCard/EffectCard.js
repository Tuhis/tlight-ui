import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import BaseCard from "../../presentational/BaseCard/BaseCard";
import CardAdjustmentRow from "../../presentational/CardAdjustmentRow/CardAdjustmentRow";
import Divider from "../../presentational/Divider/Divider";
import Dropdown from "../../presentational/Dropdown/Dropdown";
import KeyValueList from "../../presentational/KeyValueList/KeyValueList";
import Row50 from "../../presentational/Row50/Row50";
import SliderAndInput from "../../presentational/SliderAndInput/SliderAndInput";

import { changeNodeValues } from "../../../actions/nodeActions";

import { MODES, CONTROLLABLE_MODES } from "../../../constants/nodeOperatingModes";
import { MIN_VALUE, MAX_VALUE } from "../../../constants/generic";
import { changeLightValues } from "../../../actions/lightActions";

class LightCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BaseCard
                title={this.props.id}
                autoHeight={true} >

            </BaseCard>
        );
    }
}

LightCard.propTypes = {
    id: PropTypes.string.isRequired
};

LightCard.defaultProps = {
};

const mapStateToProps = (state, ownProps) => {

    return {
    };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LightCard);
