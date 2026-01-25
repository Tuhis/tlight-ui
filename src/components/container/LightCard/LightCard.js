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

import NormalButton from "../../presentational/NormalButton/NormalButton";
import { MODES, CONTROLLABLE_MODES } from "../../../constants/nodeOperatingModes";
import { MIN_VALUE, MAX_VALUE } from "../../../constants/generic";
import { changeLightValues } from "../../../actions/lightActions";
import ColorWrapper from "../../presentational/ColorWrapper/ColorWrapper";

class LightCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            useColorPicker: true
        };

        this.handleBrightnessChange = this.handleBrightnessChange.bind(this);
        this.handleRedChange = this.handleRedChange.bind(this);
        this.handleGreenChange = this.handleGreenChange.bind(this);
        this.handleBlueChange = this.handleBlueChange.bind(this);
        this.handleColorPickerChange = this.handleColorPickerChange.bind(this);
        this.toggleColorPicker = this.toggleColorPicker.bind(this);
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

    handleColorPickerChange({ r, g, b }) {
        // We can dispatch individual changes or a single batch if backend supported it.
        // For now, let's just trigger one by one or maybe we should have a bulk update action?
        // The current actions seem to handle one prop at a time or object merge.
        // Let's check handleRedChange: onRedChange(..., {red, green, blue}).
        // Ideally we should have an action that updates all 3.
        // changeLightValues takes payload.

        // Dispatching for all 3:
        // Actually onRedChange does: dispatch(changeLightValues(..., color))
        // So we can just call any of them or dispatch directly if we had access.
        // Since we only have props mapped:
        // We can reuse onRedChange which actually accepts a full color object as the 3rd arg!
        // Look at mapDispatchToProps: onRedChange: (nodeId, lightId, color) => dispatch(changeLightValues(nodeId, lightId, color)),

        this.props.onRedChange(this.props.nodeId, this.props.id, {
            red: r,
            green: g,
            blue: b
        });
    }

    toggleColorPicker() {
        this.setState({
            useColorPicker: !this.state.useColorPicker
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
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            <NormalButton
                                onClick={this.toggleColorPicker}
                                style={{ width: '100%' }}>
                                {this.state.useColorPicker ? "Switch to Manual Sliders" : "Switch to Color Picker"}
                            </NormalButton>
                        </div>

                        {this.state.useColorPicker ? (
                            <ColorWrapper
                                r={this.props.red}
                                g={this.props.green}
                                b={this.props.blue}
                                onChange={this.handleColorPickerChange}
                            />
                        ) : (
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
                            </React.Fragment>
                        )}

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
