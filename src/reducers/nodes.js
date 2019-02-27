import _ from "lodash";

// const initialState = {
//     "0": {
//         "id": 0,
//         "name": "ArduinoTlight-0",
//         "type": "ledstrip",
//         "state": {
//             "mode": "SINGLE",
//             "animation": "",
//             "brightness": 127,
//             "color": {
//                 "red": 20,
//                 "green": 255,
//                 "blue": 180
//             }
//         },
//         "features": {
//             "count": 104,
//             "addressable": true,
//             "animatable": true,
//             "color": true,
//             "animations": [
//                 "rainbow"
//             ]
//         }

//     },
//     "1": {
//         "id": 1,
//         "name": "DmxSerialArduino-1",
//         "type": "dmx",
//         "state": {
//             "mode": "EXTERNAL",
//             "animation": "",
//             "color": {
//                 "red": 255,
//                 "green": 255,
//                 "blue": 255
//             }
//         },
//         "features": {
//             "count": 255,
//             "addressable": true,
//             "animatable": true,
//             "color": false,
//             "animations": []
//         }
//     }
// };

const nodes = (state = {}, action) => {
    switch (action.type) {
        case "NODES_RECEIVED":
            return {
                ...state,
                ..._.keyBy(action.payload.nodes, "id")
            };

        default:
            return state;
    }
}

export default nodes;
