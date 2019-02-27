import React from "react";
import PropTypes from "prop-types";
import styles from "./SliderAndInput.module.css";
import _ from "lodash";
import NumericInputBox from "../NumericInputBox/NumericInputBox";
import Slider from "../Slider/Slider";

export class SliderAndInput extends React.Component {

    constructor(props) {
        super();

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.state.value) {

            if (_.isNaN(Number(nextProps.value))) {
                throw new Error("Invalid type! Expected number!");
            }

            this.setState({
                value: nextProps.value
            });
        }
    }

    handleChange({value}) {
        this.props.onChange({
            value: value
        });

        this.setState({
            value: value
        });
    }

    render() {
        return (
            <div className={styles["row"]}>
                <div>
                    <Slider
                        minValue={this.props.minValue}
                        maxValue={this.props.maxValue}
                        value={this.state.value}
                        onChange={this.handleChange} />
                </div>

                <div>
                    <NumericInputBox
                        minValue={this.props.minValue}
                        maxValue={this.props.maxValue}
                        value={this.state.value}
                        onChange={this.handleChange} />
                </div>
            </div>
        );
    }
};

SliderAndInput.propTypes = {
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

SliderAndInput.defaultProps = {
    minValue: 1,
    maxValue: 100,
    value: 50,
    onChange: _.noop
};

export default SliderAndInput;
