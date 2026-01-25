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

import { setEffectName, setEffectType, setEffectProperty, deleteEffect } from "../../../actions/effectActions";
import { AVAILABLE_EFFECTS, EFFECT_PROPERTIES, COMMON_PROPERTIES } from "../../../constants/availableEffects";
import { MIN_VALUE, MAX_VALUE } from "../../../constants/generic";
import NormalButton from "../../presentational/NormalButton/NormalButton";

function EffectCard({ id }) {
    const dispatch = useDispatch();

    const effect = useSelector(state => _.find(state.effects.configuredEffects, ["id", id]));
    const name = effect.name;
    const effectType = effect.type;
    const effectPropertyScheme = [...COMMON_PROPERTIES, ..._.get(EFFECT_PROPERTIES, `${effect.type}.effectProperties`, [])];
    const effectProperties = effect.effectProperties;

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
                value = 0;

            } else if (item.type === "bool") {
                value = true;

            } else if (item.type === "array") {
                value = [0, 0, 0];

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

    const renderEffectProperties = (propertiesScheme, rootPath = "") => {
        return _.map(propertiesScheme, params => {

            const currentPath = `${rootPath}.${params.name}`;

            // TODO: Support bool and array fields
            if (params.type === "int") {
                // TODO: handle given min and max values

                return (
                    <CardAdjustmentRow
                        key={currentPath}>
                        <div>{params.name}</div>

                        <SliderAndInput
                            minValue={MIN_VALUE}
                            maxValue={MAX_VALUE}
                            value={_.get(effectProperties, currentPath, 0)}
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
