import _ from "lodash";

const defaultOptions = {
    baseUrl: "http://localhost:3001/v1"
};

export const createTlightApiMiddleware = (options = defaultOptions) => {

    const apiActions = apiActionsFactory({
        baseUrl: options.baseUrl
    });

    return store => next => action => {

        if (!isApiAction(action)) {
            return next(action);
        }

        const apiAction = action.payload.action;
        const apiParams = _.get(action.payload, "params", undefined);

        // TODO: check if there's really such an action available!
        return apiActions[apiAction](apiParams);
    }
};

function isApiAction({ type }) {
    if (type !== "TLIGHT_API") {
        return false;
    }

    return true;
}

const apiActionsFactory = (opts) => ({
    fetchNodeData: () => fetch(opts.baseUrl + "/lights/nodes"),
    postNodeValues: params => postNodeValues(params, opts),
    postNodeValuesThrottled: _.throttle(params => postNodeValues(params, opts), 100, { leading: true, trailing: true }),
    postLightValues: params => postLightValues(params, opts),
    postLightValuesThrottled: _.throttle(params => postLightValues(params, opts), 500, { leading: true, trailing: true }),
    postEffectSetup: params => postEffectSetup(params, opts)
});

function postNodeValues({ nodeId, values }, { baseUrl }) {
    if (_.isUndefined(nodeId) || _.isUndefined(values)) {
        throw new Error("NodeId or values not given!");
    }

    return fetch(baseUrl + "/lights/nodes/" + nodeId, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
            id: nodeId,
            state: nodeStateFromValues(values)
        })
    });
}

function postLightValues({ nodeId, lightId, values }, { baseUrl }) {
    console.log("TODO: Actual request");

    // return Promise.resolve();



    return fetch(baseUrl + "/lights/nodes/" + nodeId, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
            id: nodeId,
            state: {
                mode: "INDIVIDUAL"
            },
            individualData: [
                {
                    id: _.split(lightId, "-", 2)[1],
                    ...lightDataFromValues(values)
                }
            ]
        })
    });
}

function postEffectSetup({ nodeId, body }, { baseUrl }) {
    return fetch(`${baseUrl}/lights/nodes/${nodeId}/plugin/source`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(body)
    });
}

function lightDataFromValues(values) {
    let lightData = {};

    if (_.has(values, "brightness")) {
        lightData.brightness = values.brightness;
    }

    if (_.has(values, "red")) {
        if (_.has(lightData, "color")) {
            lightData.color.red = values.red;

        } else {
            lightData.color = {
                red: values.red
            };
        }
    }

    if (_.has(values, "green")) {
        if (_.has(lightData, "color")) {
            lightData.color.green = values.green;

        } else {
            lightData.color = {
                green: values.green
            };
        }
    }

    if (_.has(values, "blue")) {
        if (_.has(lightData, "color")) {
            lightData.color.blue = values.blue;

        } else {
            lightData.color = {
                blue: values.blue
            };
        }
    }

    console.log("Sengind light data...");
    console.log(lightData);
    console.log(values);

    return lightData;
}

function nodeStateFromValues(values) {
    let valueKeys = _.keys(values);
    let nodeState = {};

    if (_.includes(valueKeys, "mode")) {
        nodeState.mode = values.mode;
    }

    if (_.includes(valueKeys, "brightness")) {
        nodeState.brightness = values.brightness;
    }

    if (_.includes(valueKeys, "red")) {
        if (_.has(nodeState, "color")) {
            nodeState.color.red = values.red;

        } else {
            nodeState.color = {
                red: values.red
            };
        }
    }

    if (_.includes(valueKeys, "green")) {
        if (_.has(nodeState, "color")) {
            nodeState.color.green = values.green;

        } else {
            nodeState.color = {
                green: values.green
            };
        }
    }

    if (_.includes(valueKeys, "blue")) {
        if (_.has(nodeState, "color")) {
            nodeState.color.blue = values.blue;

        } else {
            nodeState.color = {
                blue: values.blue
            };
        }
    }

    return nodeState;
}

export const tlightApiMiddleware = createTlightApiMiddleware();
