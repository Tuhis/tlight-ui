import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import BaseCard from "../../presentational/BaseCard/BaseCard";
import CardAdjustmentRow from "../../presentational/CardAdjustmentRow/CardAdjustmentRow";
import Divider from "../../presentational/Divider/Divider";
import Dropdown from "../../presentational/Dropdown/Dropdown";
import KeyValueList from "../../presentational/KeyValueList/KeyValueList";
import Row50 from "../../presentational/Row50/Row50";
import SliderAndInput from "../../presentational/SliderAndInput/SliderAndInput";
import ColorWrapper from "../../presentational/ColorWrapper/ColorWrapper";

import { setEffectName, setEffectType, setEffectProperty, deleteEffect } from "../../../actions/effectActions";
import { AVAILABLE_EFFECTS, EFFECT_PROPERTIES, COMMON_PROPERTIES } from "../../../constants/availableEffects";
import { MIN_VALUE, MAX_VALUE } from "../../../constants/generic";
import NormalButton from "../../presentational/NormalButton/NormalButton";
import { setCardPreference } from "../../../slices/uiSlice";

function EffectCard({ id }) {
    const dispatch = useDispatch();

    const effect = useSelector(state => _.find(state.effects.configuredEffects, ["id", id]));
    // Protect against effect being deleted before unmount
    if (!effect) return null;

    const name = effect.name;
    const effectType = effect.type;
    const effectPropertyScheme = [...COMMON_PROPERTIES, ..._.get(EFFECT_PROPERTIES, `${effect.type}.effectProperties`, [])];
    const effectProperties = effect.effectProperties;

    // UI Local State from Redux for this card
    const useColorPicker = useSelector(state =>
        (state.ui.preferences[id] && state.ui.preferences[id].useColorPicker) ?? true
    );

    const handleCardTitleChange = (newTitle) => {
        dispatch(setEffectName(id, newTitle));
    };


    const handleEffectTypeChange = (item, typeIndex) => {
        dispatch(setEffectType(id, item.data));

        const newEffectPropertyScheme =
            [...COMMON_PROPERTIES, ..._.get(EFFECT_PROPERTIES, `${item.data}.effectProperties`, [])];

        const newEffectProperties = {
            effect: {}
        };

        const processPropertiesSchemeItem = (item, path = "effect") => {
            const currentPath = `${path}.${item.name}`;
            let value;

            if (item.type === "int") {
                value = item.hasOwnProperty('default') ? item.default : 0;

            } else if (item.type === "bool") {
                value = item.hasOwnProperty('default') ? item.default : true;

            } else if (item.type === "array") {
                value = item.hasOwnProperty('default') ? item.default : [0, 0, 0];

            } else if (item.type === "object") {
                _.forEach(item.properties, (prop) => processPropertiesSchemeItem(prop, currentPath));

                return;
            }

            _.set(newEffectProperties, currentPath, value);
        };

        _.forEach(newEffectPropertyScheme, (prop) => processPropertiesSchemeItem(prop, "effect"));

        dispatch(setEffectProperty(id, "effect", newEffectProperties.effect));
    };

    const handleEffectDelete = () => {
        dispatch(deleteEffect(id));
    };

    const toggleColorPicker = () => {
        dispatch(setCardPreference({
            id,
            key: 'useColorPicker',
            value: !useColorPicker
        }));
    };

    const hasColorProperties = (scheme) => {
        return _.some(scheme, item => {
            if (item.specificType === "color") return true;
            if (item.type === "object" && item.properties) {
                return hasColorProperties(item.properties);
            }
            return false;
        });
    };

    const renderEffectProperties = (propertiesScheme, rootPath = "") => {
        return _.map(propertiesScheme, params => {

            const currentPath = `${rootPath}.${params.name}`;

            if (params.specificType === "color") {
                // Validation
                const hasRed = _.find(params.properties, { name: 'red' });
                const hasGreen = _.find(params.properties, { name: 'green' });
                const hasBlue = _.find(params.properties, { name: 'blue' });

                if (!hasRed || !hasGreen || !hasBlue) {
                    return (
                        <div key={currentPath} style={{ color: 'red', padding: '10px' }}>
                            Error: Invalid color schema for {params.name}. Missing red, green, or blue property.
                        </div>
                    );
                }

                if (useColorPicker) {
                    const red = _.get(effectProperties, `${currentPath}.red`, 0);
                    const green = _.get(effectProperties, `${currentPath}.green`, 0);
                    const blue = _.get(effectProperties, `${currentPath}.blue`, 0);

                    const handleColorChange = (color) => {
                        // Note: The structure in store mirrors this.
                        dispatch(setEffectProperty(id, currentPath, {
                            red: color.r,
                            green: color.g,
                            blue: color.b
                        }));
                    };

                    return (
                        <React.Fragment key={currentPath}>
                            <Row50>
                                <div>{params.name}</div>
                                <div></div>
                            </Row50>
                            <ColorWrapper
                                r={red}
                                g={green}
                                b={blue}
                                onChange={handleColorChange}
                            />
                        </React.Fragment>
                    );
                }
                // If not using color picker, fall through to object rendering
            }

            // TODO: Support bool and array fields
            if (params.type === "int") {
                const min = params.hasOwnProperty('min') ? params.min : MIN_VALUE;
                const max = params.hasOwnProperty('max') ? params.max : MAX_VALUE;
                const defaultValue = params.hasOwnProperty('default') ? params.default : (min > 0 ? min : 0);

                return (
                    <CardAdjustmentRow
                        key={currentPath}>
                        <div>{params.name}</div>

                        <SliderAndInput
                            minValue={min}
                            maxValue={max}
                            value={_.get(effectProperties, currentPath, defaultValue)}
                            onChange={data => dispatch(setEffectProperty(id, currentPath, data.value))} />
                    </CardAdjustmentRow>
                );

            } else if (params.type === "object") {
                return [
                    <Divider key={`${currentPath}-1`} />,
                    // TODO: Implement proper label component for card.
                    <Row50 key={`${currentPath}-2`}>
                        <div>{params.name}</div>
                        <div></div>
                    </Row50>,
                    renderEffectProperties(params.properties, currentPath)
                ];

            }
        });
    };

    const effectOptions = _.map(AVAILABLE_EFFECTS, effect => ({
        data: effect,
        label: effect
    }));

    const effectTypeIndex = _.findIndex(effectOptions, ["data", effectType]);
    const showColorPickerToggle = hasColorProperties(effectPropertyScheme);

    return (
        <BaseCard
            title={name}
            autoHeight={true}
            editableTitle
            onTitleChange={handleCardTitleChange} >

            <Row50>
                <div>Effect:</div>

                <Dropdown
                    data={effectOptions}
                    selectedItemIndex={effectTypeIndex}
                    onChange={handleEffectTypeChange} />
            </Row50>

            <Divider />

            {showColorPickerToggle && (
                <React.Fragment>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <NormalButton
                            onClick={toggleColorPicker}
                            style={{ width: '100%' }}>
                            {useColorPicker ? "Switch to Manual Sliders" : "Switch to Color Picker"}
                        </NormalButton>
                    </div>
                    <Divider />
                </React.Fragment>
            )}

            {renderEffectProperties(effectPropertyScheme, "effect")}

            <Divider />

            <NormalButton
                onClick={handleEffectDelete}
                css={{ cancelButton: true }} >

                Delete
            </NormalButton>
        </BaseCard>
    );
}

EffectCard.propTypes = {
    id: PropTypes.string.isRequired
};

EffectCard.defaultProps = {
};

export default EffectCard;
