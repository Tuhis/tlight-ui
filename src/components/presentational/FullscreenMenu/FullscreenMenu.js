import React from "react";
import PropTypes from "prop-types";
import styles from "./FullscreenMenu.module.css";
import { Centerizer } from "../Centerizer/Centerizer";

export const FullscreenMenu = ({ open, onToggle, children }) => {
    return (
        <React.Fragment>
            <div
                className={styles.menubutton}
                onClick={() => onToggle(!open)}>

                <div className={styles["menu-icon"]}>
                    <div />
                    <div />
                    <div />
                </div>
            </div>

            {
                open &&
                <div
                    className={styles["fullscreen-container"]}
                    onClick={() => onToggle(false)}>

                    <Centerizer
                        horizontal>
                        <div onClick={e => e.stopPropagation()}>
                            {/* TODO: Wrap children in container div and set max and min width on it */}
                            {children}
                        </div>
                    </Centerizer>
                </div>
            }
        </React.Fragment>
    );
};

FullscreenMenu.propTypes = {
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    children: PropTypes.node
};

