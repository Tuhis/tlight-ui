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

import { setEffectName, setEffectType, setEffectProperty } from "../../../actions/effectActions";
import { AVAILABLE_EFFECTS, EFFECT_PROPERTIES, COMMON_PROPERTIES } from "../../../constants/availableEffects";
import { MIN_VALUE, MAX_VALUE } from "../../../constants/generic";

class EffectCard extends React.Component {

    tmp = {}

    handleCardTitleChange = (newTitle) => {
        this.props.onEffectNameChange(this.props.id, newTitle);
    }

    handleEffectTypeChange = (item, typeIndex) => {
        this.props.onEffectTypeChange(this.props.id, item.data);
    }

    renderEffectProperties(effectProperties, rootPath = "") {
        return _.map(effectProperties, params => {

            const currentPath = `${rootPath}.${params.name}`;

            // TODO: Support bool and array fields
            if (params.type === "int") {
                // TODO: handle given min and max values

                _.set(this.tmp, currentPath, 0);

                return (
                    <CardAdjustmentRow
                        key={currentPath}>
                        <div>{params.name}</div>

                        <SliderAndInput
                            minValue={MIN_VALUE}
                            maxValue={MAX_VALUE}
                            value={_.get(this.props.effectProperties, currentPath, 0)}
                            onChange={data => this.props.onEffectPropertyChange(this.props.id, currentPath, data.value)} />
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
                    this.renderEffectProperties(params.properties, currentPath)
                ];

            }
        });
    }

    render() {
        const effectOptions = _.map(AVAILABLE_EFFECTS, effect => ({
            data: effect,
            label: effect
        }));

        const effectTypeIndex = _.findIndex(effectOptions, ["data", this.props.effectType]);

        return (
            <BaseCard
                title={this.props.name}
                autoHeight={true}
                editableTitle
                onTitleChange={this.handleCardTitleChange} >

                <Row50>
                    <div>Effect:</div>

                    <Dropdown
                        data={effectOptions}
                        selectedItemIndex={effectTypeIndex}
                        onChange={this.handleEffectTypeChange} />
                </Row50>

                <Divider />

                {this.renderEffectProperties(this.props.effectPropertyScheme, "effect")}

            </BaseCard>
        );
    }
}

EffectCard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    effectType: PropTypes.string,
    effectPropertyScheme: PropTypes.array.isRequired,
    effectProperties: PropTypes.object.isRequired,
    onEffectNameChange: PropTypes.func.isRequired,
    onEffectTypeChange: PropTypes.func.isRequired,
    onEffectPropertyChange: PropTypes.func.isRequired
};

EffectCard.defaultProps = {
};

const mapStateToProps = (state, ownProps) => {
    const effectId = ownProps.id;
    const effect = _.find(state.effects.configuredEffects, ["id", effectId]);

    return {
        name: effect.name,
        effectType: effect.type,
        effectPropertyScheme: [...COMMON_PROPERTIES, ..._.get(EFFECT_PROPERTIES, `${effect.type}.effectProperties`, [])],
        effectProperties: effect.effectProperties
    };
};

const mapDispatchToProps = dispatch => ({
    onEffectNameChange: (id, name) => dispatch(setEffectName(id, name)),
    onEffectTypeChange: (id, type) => {
        dispatch(setEffectType(id, type));

        const effectPropertyScheme =
            [...COMMON_PROPERTIES, ..._.get(EFFECT_PROPERTIES, `${type}.effectProperties`, [])];

        const effectProperties = {
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

            _.set(effectProperties, currentPath, value);
        };

        _.forEach(effectPropertyScheme, (prop) => processPropertiesSchemeItem(prop, "effect"));

        dispatch(setEffectProperty(id, "effect", effectProperties.effect));
    },
    onEffectPropertyChange: (id, path, value) => dispatch(setEffectProperty(id, path, value))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EffectCard);
