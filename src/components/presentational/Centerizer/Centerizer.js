import React from "react";
import _ from "lodash";
import styles from "./Centerizer.module.css";

export function Centerizer({
    vertical = false,
    horizontal = false,
    children
}) {
    return (
        <div className={`${styles.centerizer} ${vertical ? styles.vertical : ""} ${horizontal ? styles.horizontal : ""}`}>
            {<div className={styles.content}>{children}</div>}
        </div>
    );
}
