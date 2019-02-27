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

        this.handleBrightnessChange = this.handleBrightnessChange.bind(this);
        this.handleRedChange = this.handleRedChange.bind(this);
        this.handleGreenChange = this.handleGreenChange.bind(this);
        this.handleBlueChange = this.handleBlueChange.bind(this);
    }

    handleBrightnessChange({ value }) {
        this.props.onBrightnessChange(this.props.nodeId, this.props.id, value);
    }

    handleRedChange({ value }) {
        this.props.onRedChange(this.props.nodeId, this.props.id, {
            red: value,
            green: this.props.green,
            blue: this.props.blue
        });
    }

    handleGreenChange({ value }) {
        this.props.onGreenChange(this.props.nodeId, this.props.id, {
            red: this.props.red,
            green: value,
            blue: this.props.blue
        });
    }

    handleBlueChange({ value }) {
        this.props.onBlueChange(this.props.nodeId, this.props.id, {
            red: this.props.red,
            green: this.props.green,
            blue: value
        });
    }

    render() {
        return (
            <BaseCard
                title={this.props.id}
                autoHeight={true} >

                <CardAdjustmentRow>
                    <div>Brightness:</div>

                    <SliderAndInput
                        minValue={MIN_VALUE}
                        maxValue={MAX_VALUE}
                        value={this.props.brightness}
                        onChange={this.handleBrightnessChange} />
                </CardAdjustmentRow>

                <Divider />

                {this.props.colorSupport &&
                    <React.Fragment>
                        <CardAdjustmentRow>
                            <div>Red:</div>

                            <SliderAndInput
                                minValue={MIN_VALUE}
                                maxValue={MAX_VALUE}
                                value={this.props.red}
                                onChange={this.handleRedChange} />
                        </CardAdjustmentRow>
                        <CardAdjustmentRow>
                            <div>Green:</div>

                            <SliderAndInput
                                minValue={MIN_VALUE}
                                maxValue={MAX_VALUE}
                                value={this.props.green}
                                onChange={this.handleGreenChange} />
                        </CardAdjustmentRow>
                        <CardAdjustmentRow>
                            <div>Blue:</div>

                            <SliderAndInput
                                minValue={MIN_VALUE}
                                maxValue={MAX_VALUE}
                                value={this.props.blue}
                                onChange={this.handleBlueChange} />
                        </CardAdjustmentRow>

                        <Divider />
                    </React.Fragment>
                }
            </BaseCard>
        );
    }
}

LightCard.propTypes = {
    id: PropTypes.string.isRequired,
    nodeId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    brightness: PropTypes.number,
    red: PropTypes.number,
    green: PropTypes.number,
    blue: PropTypes.number,
    colorSupport: PropTypes.bool.isRequired,
    onBrightnessChange: PropTypes.func.isRequired,
    onRedChange: PropTypes.func.isRequired,
    onGreenChange: PropTypes.func.isRequired,
    onBlueChange: PropTypes.func.isRequired
};

LightCard.defaultProps = {
    onBrightnessChange: _.noop,
    onRedChange: _.noop,
    onGreenChange: _.noop,
    onBlueChange: _.noop
};

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.id;
    const nodeId = ownProps.nodeId;

    return {
        type: state.lightValues[nodeId][id].type,
        brightness: _.get(state.lightValues[nodeId][id], "brightness"),
        red: _.get(state.lightValues[nodeId][id], "red"),
        green: _.get(state.lightValues[nodeId][id], "green"),
        blue: _.get(state.lightValues[nodeId][id], "blue"),
        colorSupport: state.nodes[nodeId].features.color
    };
};

const mapDispatchToProps = dispatch => ({
    onBrightnessChange: (nodeId, lightId, brightness) => dispatch(changeLightValues(nodeId, lightId, { brightness })),
    onRedChange: (nodeId, lightId, color) => dispatch(changeLightValues(nodeId, lightId, color)),
    onGreenChange: (nodeId, lightId, color) => dispatch(changeLightValues(nodeId, lightId, color)),
    onBlueChange: (nodeId, lightId, color) => dispatch(changeLightValues(nodeId, lightId, color)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LightCard);
