import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import BaseCard from "../../presentational/BaseCard/BaseCard";
import CardAdjustmentRow from "../../presentational/CardAdjustmentRow/CardAdjustmentRow";
import Divider from "../../presentational/Divider/Divider";
import Dropdown from "../../presentational/Dropdown/Dropdown";
import KeyValueList from "../../presentational/KeyValueList/KeyValueList";
import Row50 from "../../presentational/Row50/Row50";
import SliderAndInput from "../../presentational/SliderAndInput/SliderAndInput";

import { changeNodeValues } from "../../../actions/nodeActions";
import { setCardPreference } from "../../../slices/uiSlice";

import { MODES, CONTROLLABLE_MODES } from "../../../constants/nodeOperatingModes";
import { MIN_VALUE, MAX_VALUE } from "../../../constants/generic";
import NormalButton from "../../presentational/NormalButton/NormalButton";
import { selectEffect } from "../../../actions/effectActions";
import ColorWrapper from "../../presentational/ColorWrapper/ColorWrapper";

function NodeCard({ id }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const node = useSelector(state => state.nodes[id]);
    const nodeValue = useSelector(state => state.nodeValues[id]);
    const effects = useSelector(state => _.map(state.effects.configuredEffects, effect => ({ data: effect.id, label: effect.name })));
    const selectedEffectId = useSelector(state => state.effects.effectsInUsePerNode[id].effectId);

    // UI Local State from Redux
    const useColorPicker = useSelector(state =>
        (state.ui.preferences[id] && state.ui.preferences[id].useColorPicker) ?? true
    );

    const name = node.name;
    const type = node.type;
    const lightCount = node.features.lightCount;
    const addressable = node.features.addressable;
    const colorSupport = node.features.color;
    const operatingMode = nodeValue.mode;
    const brightness = _.get(nodeValue, "brightness");
    const red = _.get(nodeValue, "red");
    const green = _.get(nodeValue, "green");
    const blue = _.get(nodeValue, "blue");

    // Derived state, no need for useState + useEffect sync madness
    const animatable = node.features.animatable;
    const availableModes = _.filter(MODES, m => {
        if (m.data === "SINGLE" || m.data === "EXTERNAL") return true;
        if (m.data === "INDIVIDUAL" && addressable) return true;
        if (m.data === "ANIMATION" && animatable) return true;
        return false;
    });

    const modeIndex = _.findIndex(availableModes, ['data', operatingMode]);

    const handleModeChange = (item) => {
        dispatch(changeNodeValues(id, { mode: item.data }));
    };

    const handleEffectChange = (item) => {
        dispatch(selectEffect(id, item.data, colorSupport));
    };

    const handleBrightnessChange = ({ value }) => {
        dispatch(changeNodeValues(id, { brightness: value }));
    };

    const handleRedChange = ({ value }) => {
        dispatch(changeNodeValues(id, { red: value }));
    };

    const handleGreenChange = ({ value }) => {
        dispatch(changeNodeValues(id, { green: value }));
    };

    const handleBlueChange = ({ value }) => {
        dispatch(changeNodeValues(id, { blue: value }));
    };

    const handleColorPickerChange = ({ r, g, b }) => {
        dispatch(changeNodeValues(id, {
            red: r,
            green: g,
            blue: b
        }));
    };

    const toggleColorPicker = () => {
        dispatch(setCardPreference({
            id,
            key: 'useColorPicker',
            value: !useColorPicker
        }));
    };

    const showBrightness =
        !_.isUndefined(brightness) && _.includes(CONTROLLABLE_MODES, operatingMode);

    const showColor =
        colorSupport && operatingMode === "SINGLE";

    const showEffectPicker =
        operatingMode === "EXTERNAL";

    const selectedEffectIndex = _.findIndex(effects, ["data", selectedEffectId]);

    return (
        <BaseCard
            title={name} >

            <KeyValueList
                data={[
                    { key: "Type", value: type },
                    { key: "Node ID", value: id },
                    { key: "Light count", value: lightCount },
                    { key: "Addressable", value: _.toString(addressable) },
                    { key: "Color support", value: _.toString(colorSupport) }
                ]} />
            <Divider />

            <Row50>
                <div>Operating mode:</div>

                <Dropdown
                    data={availableModes}
                    selectedItemIndex={modeIndex}
                    onChange={handleModeChange} />
            </Row50>

            <Divider />

            {showBrightness &&
                <React.Fragment>
                    <CardAdjustmentRow>
                        <div>Brightness:</div>

                        <SliderAndInput
                            minValue={MIN_VALUE}
                            maxValue={MAX_VALUE}
                            value={brightness}
                            onChange={handleBrightnessChange} />
                    </CardAdjustmentRow>

                    <Divider />
                </React.Fragment>
            }

            {showColor &&
                <React.Fragment>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <NormalButton
                            onClick={toggleColorPicker}
                            style={{ width: '100%' }}>
                            {useColorPicker ? "Switch to Manual Sliders" : "Switch to Color Picker"}
                        </NormalButton>
                    </div>

                    {useColorPicker ? (
                        <ColorWrapper
                            r={red}
                            g={green}
                            b={blue}
                            onChange={handleColorPickerChange}
                        />
                    ) : (
                        <React.Fragment>
                            <CardAdjustmentRow>
                                <div>Red:</div>

                                <SliderAndInput
                                    minValue={MIN_VALUE}
                                    maxValue={MAX_VALUE}
                                    value={red}
                                    onChange={handleRedChange} />
                            </CardAdjustmentRow>
                            <CardAdjustmentRow>
                                <div>Green:</div>

                                <SliderAndInput
                                    minValue={MIN_VALUE}
                                    maxValue={MAX_VALUE}
                                    value={green}
                                    onChange={handleGreenChange} />
                            </CardAdjustmentRow>
                            <CardAdjustmentRow>
                                <div>Blue:</div>

                                <SliderAndInput
                                    minValue={MIN_VALUE}
                                    maxValue={MAX_VALUE}
                                    value={blue}
                                    onChange={handleBlueChange} />
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
                            data={effects}
                            selectedItemIndex={selectedEffectIndex}
                            onChange={handleEffectChange} />
                    </Row50>

                    <Divider />
                </React.Fragment>
            }

            {operatingMode === "INDIVIDUAL" &&
                <NormalButton
                    onClick={() => navigate("/nodes/" + id + "/lights")}>
                    Lights
                </NormalButton>
            }
        </BaseCard>
    );
}

NodeCard.propTypes = {
    id: PropTypes.string.isRequired
};

export default NodeCard;
