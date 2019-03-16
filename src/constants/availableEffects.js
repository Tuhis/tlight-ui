export const AVAILABLE_EFFECTS = [
    "sACN",
    "SmoothColors"
];

export const COMMON_PROPERTIES = [
    {
        name: "lightCount",
        description: "Number of lights/channels this effect should create",
        type: "int",
        required: true
    },
    {
        name: "colors",
        description: "Color support",
        type: "bool",
        required: true
    }
];

export const EFFECT_PROPERTIES = {
    sACN: {
        displayName: "Empty Epsilon",
        description: "sACN client for integrating the TLight to 3rd party systems, such as Empty Epsilon.",
        effectProperties: [{
            name: "pluginOpts",
            type: "object",
            required: true,
            properties: [
                {
                    name: "startChannel",
                    description: "sACN channel to from witch onwards to start listening",
                    type: "int",
                    required: true
                }
            ]
        }]
    },
    // TODO: SmoothColors will be reworked on the backend side to have better params...
    SmoothColors: {
        displayName: "Smooth Colors",
        description: "Smoothly changing color effect.",
        effectProperties: [{
            name: "pluginOpts",
            type: "object",
            required: true,
            properties: [
                {
                    name: "startChannel",
                    description: "From what channel/light id onwards to send color data. To be used with DMX lights.",
                    type: "int",
                    required: false
                },
                {
                    name: "effectOpts",
                    description: "Effect specific options",
                    type: "object",
                    required: true,
                    properties: [
                        {
                            name: "duration",
                            description: "The time it takes to go from start color to end in seconds",
                            type: "int",
                            min: 1,
                            max: 255,
                            required: true
                        },
                        {
                            name: "startColor",
                            description: "Start color of the effect. Give this when colors are supported.",
                            type: "object",
                            required: false,
                            properties: [
                                {
                                    name: "red",
                                    description: "Red value 0-255",
                                    type: "int",
                                    min: 0,
                                    max: 255,
                                    required: false
                                },
                                {
                                    name: "green",
                                    description: "Green value 0-255",
                                    type: "int",
                                    min: 0,
                                    max: 255,
                                    required: false
                                },
                                {
                                    name: "blue",
                                    description: "Blue value 0-255",
                                    type: "int",
                                    min: 0,
                                    max: 255,
                                    required: false
                                }
                            ]
                        },
                        {
                            name: "endColor",
                            description: "End color of the effect. Give this when colors are supported.",
                            type: "object",
                            required: false,
                            properties: [
                                {
                                    name: "red",
                                    description: "Red value 0-255",
                                    type: "int",
                                    min: 0,
                                    max: 255,
                                    required: false
                                },
                                {
                                    name: "green",
                                    description: "Green value 0-255",
                                    type: "int",
                                    min: 0,
                                    max: 255,
                                    required: false
                                },
                                {
                                    name: "blue",
                                    description: "Blue value 0-255",
                                    type: "int",
                                    min: 0,
                                    max: 255,
                                    required: false
                                }
                            ]
                        },
                        {
                            name: "startBrightness",
                            description: "Start brightness",
                            type: "array",
                            required: false
                        },
                        {
                            name: "endBrightness",
                            description: "End brightness",
                            type: "array",
                            required: false
                        }
                    ]
                }
            ]
        }]
    }
}
