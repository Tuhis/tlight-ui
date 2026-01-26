import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import BaseCard from "../../presentational/BaseCard/BaseCard";
import CardAdjustmentRow from "../../presentational/CardAdjustmentRow/CardAdjustmentRow";
import Divider from "../../presentational/Divider/Divider";
import SliderAndInput from "../../presentational/SliderAndInput/SliderAndInput";

import { setCardPreference } from "../../../slices/uiSlice";

import NormalButton from "../../presentational/NormalButton/NormalButton";
import { MIN_VALUE, MAX_VALUE } from "../../../constants/generic";
import { changeLightValues } from "../../../actions/lightActions";
import ColorWrapper from "../../presentational/ColorWrapper/ColorWrapper";

function LightCard({ id, nodeId }) {
    const dispatch = useDispatch();
    const uniqueId = `${nodeId}_${id}`;

    // UI Local State from Redux
    const useColorPicker = useSelector(state =>
        (state.ui.preferences[uniqueId] && state.ui.preferences[uniqueId].useColorPicker) ?? true
    );

    const lightValue = useSelector(state => state.lightValues[nodeId][id]);
    const colorSupport = useSelector(state => state.nodes[nodeId].features.color);

    const brightness = _.get(lightValue, "brightness");
    const red = _.get(lightValue, "red");
    const green = _.get(lightValue, "green");
    const blue = _.get(lightValue, "blue");

    const handleBrightnessChange = ({ value }) => {
        dispatch(changeLightValues(nodeId, id, { brightness: value }));
    };

    const handleRedChange = ({ value }) => {
        dispatch(changeLightValues(nodeId, id, {
            red: value,
            green: green,
            blue: blue
        }));
    };

    const handleGreenChange = ({ value }) => {
        dispatch(changeLightValues(nodeId, id, {
            red: red,
            green: value,
            blue: blue
        }));
    };

    const handleBlueChange = ({ value }) => {
        dispatch(changeLightValues(nodeId, id, {
            red: red,
            green: green,
            blue: value
        }));
    };

    const handleColorPickerChange = ({ r, g, b }) => {
        dispatch(changeLightValues(nodeId, id, {
            red: r,
            green: g,
            blue: b
        }));
    };

    const toggleColorPicker = () => {
        dispatch(setCardPreference({
            id: uniqueId,
            key: 'useColorPicker',
            value: !useColorPicker
        }));
    };

    return (
        <BaseCard
            title={id}
            autoHeight={true} >

            <CardAdjustmentRow>
                <div>Brightness:</div>

                <SliderAndInput
                    minValue={MIN_VALUE}
                    maxValue={MAX_VALUE}
                    value={brightness}
                    onChange={handleBrightnessChange} />
            </CardAdjustmentRow>

            <Divider />

            {colorSupport &&
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
        </BaseCard>
    );
}

LightCard.propTypes = {
    id: PropTypes.string.isRequired,
    nodeId: PropTypes.string.isRequired
};

export default LightCard;
