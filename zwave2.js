import { validateStates, parseDefault, getRoom } from '../adapters';
import _rfdc from 'rfdc/default';

export default 'Z-Wave 2';
export const namespace = 'zwave2';

export const deviceObjectType = 'device';

/*
 * State Mapping
 */
const STATE_MAPPING = {
	
	// heating
	"thermostat": {
		"valve": {
			"state": ".Multilevel_Switch.currentValue",
            "unit": "%",
            "icon": "rotate-right"
		},
		"mode": {
			"state": ".Thermostat_Mode.mode",
			"action": ".Thermostat_Mode.mode",
            "icon": {
               "0": "radiator-off",
               "1": "radiator",
               "11": "radiator-disabled",
               "15": "radiator"
            }
		},
		"setTemperatureEnergySave": {
			"state": ".Thermostat_Setpoint.setpoint_energySaveHeating",
			"action": ".Thermostat_Setpoint.setpoint_energySaveHeating",
            "unit": "°C",
            "icon": "radiator-disabled"
		},
		"temperature": {
			"state": ".Multilevel_Sensor.airTemperature"
		},
		"setTemperature": {
			"state": ".Thermostat_Setpoint.setpoint_heating",
			"action": ".Thermostat_Setpoint.setpoint_heating"
		}
	}
}

/**
 *
 *
 */
export function parse(deviceStructure, options) {
	return new Promise(resolve => {
		const obj = deviceStructure.objects[deviceStructure.root];
		
		const device = {
			'name': obj.common.name,
			'function': 'other',
			'room': getRoom(deviceStructure),
			'states': {
				'reachability': '.alive',
				'battery': '.Battery.level',
				'firmware': '.Version.firmwareVersions'
			}
		}
		
		// state by function
		if (obj.native.type && obj.native.type.generic && STATE_MAPPING[obj.native.type.generic.toLowerCase()] !== undefined) {
			// device function
			const functionMapping = {
				'thermostat': 'heating'
			}
			
			device.function = functionMapping[obj.native.type.generic.toLowerCase()];
			
			// add states
			device.states = {
				...device.states,
				..._rfdc(STATE_MAPPING[obj.native.type.generic.toLowerCase()])
			}
			
			// validate states
			device.states = validateStates(device.states, deviceStructure);
			
			// resolve
			resolve(device);
		}
		
		// no pre-defined function, thus parse it all
		else {
			parseDefault(deviceStructure, options, device).then(resolve);
		}
	});
}
