import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

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
import NormalButton from "../../presentational/NormalButton/NormalButton";
import { selectEffect } from "../../../actions/effectActions";
import ColorWrapper from "../../presentational/ColorWrapper/ColorWrapper";

class NodeCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modeIndex: _.findIndex(MODES, ['data', this.props.operatingMode]), // What if mismatch?
            useColorPicker: true
        }

        this.handleModeChange = this.handleModeChange.bind(this);
        this.handleBrightnessChange = this.handleBrightnessChange.bind(this);
        this.handleRedChange = this.handleRedChange.bind(this);
        this.handleGreenChange = this.handleGreenChange.bind(this);
        this.handleBlueChange = this.handleBlueChange.bind(this);
        this.handleColorPickerChange = this.handleColorPickerChange.bind(this);
        this.toggleColorPicker = this.toggleColorPicker.bind(this);
    }

    handleModeChange(item, modeIndex) {
        // TODO: Get rid of state
        this.setState({
            modeIndex
        });

        this.props.onModeChange(this.props.id, item.data);
    }

    handleEffectChange = (item, itemIndex) => {
        this.props.onEffectChange(this.props.id, item.data, this.props.colorSupport);
    }

    handleBrightnessChange({ value }) {
        this.props.onBrightnessChange(this.props.id, value);
    }

    handleRedChange({ value }) {
        this.props.onRedChange(this.props.id, value);
    }

    handleGreenChange({ value }) {
        this.props.onGreenChange(this.props.id, value);
    }

    handleBlueChange({ value }) {
        this.props.onBlueChange(this.props.id, value);
    }

    handleColorPickerChange({ r, g, b }) {
        this.props.onColorChange(this.props.id, {
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
        console.log(this.props);
        const showBrightness =
            !_.isUndefined(this.props.brightness) && _.includes(CONTROLLABLE_MODES, this.props.operatingMode);

        const showColor =
            this.props.colorSupport && this.props.operatingMode === "SINGLE";

        const showEffectPicker =
            this.props.operatingMode === "EXTERNAL";

        const selectedEffectIndex = _.findIndex(this.props.effects, ["data", this.props.selectedEffectId]);

        return (
            <BaseCard
                title={this.props.name} >

                <KeyValueList
                    data={[
                        { key: "Type", value: this.props.type },
                        { key: "Node ID", value: this.props.id },
                        { key: "Light count", value: this.props.lightCount },
                        { key: "Addressable", value: _.toString(this.props.addressable) },
                        { key: "Color support", value: _.toString(this.props.colorSupport) }
                    ]} />
                <Divider />

                <Row50>
                    <div>Operating mode:</div>

                    <Dropdown
                        data={MODES}
                        selectedItemIndex={this.state.modeIndex}
                        onChange={this.handleModeChange} />
                </Row50>

                <Divider />

                {showBrightness &&
                    <React.Fragment>
                        <CardAdjustmentRow>
                            <div>Brightness:</div>

                            <SliderAndInput
                                minValue={MIN_VALUE}
                                maxValue={MAX_VALUE}
                                value={this.props.brightness}
                                onChange={this.handleBrightnessChange} />
                        </CardAdjustmentRow>

                        <Divider />
                    </React.Fragment>
                }

                {showColor &&
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

                {showEffectPicker &&
                    <React.Fragment>
                        <Row50>
                            <div>Effect:</div>

                            <Dropdown
                                data={this.props.effects}
                                selectedItemIndex={selectedEffectIndex}
                                onChange={this.handleEffectChange} />
                        </Row50>

                        <Divider />
                    </React.Fragment>
                }

                {this.props.operatingMode === "INDIVIDUAL" &&
                    <NormalButton
                        onClick={() => this.props.push("/nodes/" + this.props.id + "/lights")}>
                        Lights
                    </NormalButton>
                }
            </BaseCard>
        );
    }
}

NodeCard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    lightCount: PropTypes.number.isRequired,
    addressable: PropTypes.bool.isRequired,
    colorSupport: PropTypes.bool.isRequired,
    operatingMode: PropTypes.string.isRequired,
    brightness: PropTypes.number,
    red: PropTypes.number,
    green: PropTypes.number,
    blue: PropTypes.number,
    effects: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedEffectId: PropTypes.string,
    onModeChange: PropTypes.func.isRequired,
    onBrightnessChange: PropTypes.func.isRequired,
    onRedChange: PropTypes.func.isRequired,
    onGreenChange: PropTypes.func.isRequired,
    onBlueChange: PropTypes.func.isRequired,
    onColorChange: PropTypes.func.isRequired,
    onEffectChange: PropTypes.func.isRequired
};

NodeCard.defaultProps = {
    onModeChange: _.noop,
    onBrightnessChange: _.noop,
    onRedChange: _.noop,
    onGreenChange: _.noop,
    onBlueChange: _.noop,
    onColorChange: _.noop,
    onEffectChange: _.noop
};

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.id;

    return {
        name: state.nodes[id].name,
        type: state.nodes[id].type,
        lightCount: state.nodes[id].features.count,
        addressable: state.nodes[id].features.addressable,
        colorSupport: state.nodes[id].features.color,
        operatingMode: state.nodeValues[id].mode,
        brightness: _.get(state.nodeValues[id], "brightness"),
        red: _.get(state.nodeValues[id], "red"),
        green: _.get(state.nodeValues[id], "green"),
        blue: _.get(state.nodeValues[id], "blue"),
        effects: _.map(state.effects.configuredEffects, effect => ({ data: effect.id, label: effect.name })),
        selectedEffectId: state.effects.effectsInUsePerNode[id].effectId
    };
};

const mapDispatchToProps = dispatch => ({
    onModeChange: (nodeId, mode) => dispatch(changeNodeValues(nodeId, { mode })),
    onBrightnessChange: (nodeId, brightness) => dispatch(changeNodeValues(nodeId, { brightness })),
    onRedChange: (nodeId, red) => dispatch(changeNodeValues(nodeId, { red })),
    onGreenChange: (nodeId, green) => dispatch(changeNodeValues(nodeId, { green })),
    onBlueChange: (nodeId, blue) => dispatch(changeNodeValues(nodeId, { blue })),
    onColorChange: (nodeId, color) => dispatch(changeNodeValues(nodeId, color)),
    onEffectChange: (nodeId, effectId, nodeColorSupport) => dispatch(selectEffect(nodeId, effectId, nodeColorSupport)),
    push: path => dispatch(push(path))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NodeCard);
