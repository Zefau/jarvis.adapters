import { validateStates, detectFunction, detectStateElements, getRoom } from '../adapters';
import _rfdc from 'rfdc/default';

export default 'hue-extended'
export const namespace = 'hue-extended'

export const deviceObjectType = 'channel';
export const devicePattern = '(lights|groups|sensors)+\\.(\\d{3}\\-[^.]+)$|([^.]+\\-\\d{3})$';

/*
 * State Mapping
 */
const STATE_MAPPING = {

	// lights
	"light": {
		"power": {
			"state": ".action.on",
			"action": ".action.on"
		},
		"level": {
			"state": ".action.level",
			"action": ".action.level"
		},
		"colorTemperature": {
			"state": ".action.colorTemperature",
			"action": ".action.colorTemperature"
		},
		"hue": {
			"state": ".action.hue",
			"action": ".action.hue"
		},
		"hex": {
			"state": ".action.hex",
			"action": ".action.hex"
		}
	}
}

/**
 *
 *
 * @param	{Object}	deviceStructure
 * @param	{String}	deviceStructure.root		root state
 * @param	{Array}		deviceStructure.states		all states
 * @param	{Object}	deviceStructure.values		all states with its value
 * @return	{Object}	device
 */
export function parse(deviceStructure, options) {
	return new Promise((resolve, reject) => {
		let device = {}
		device.name = (deviceStructure.states[deviceStructure.root + '.name'] && deviceStructure.states[deviceStructure.root + '.name'].val) || deviceStructure.root.substr(deviceStructure.root.lastIndexOf('.') + 1);
		device.states = {}
		
		// group or light
		if (deviceStructure.root.indexOf('.groups.') > -1 || deviceStructure.root.indexOf('.lights.') > -1) {
			device = {
				...device,
				'function': 'light',
				'room': getRoom(deviceStructure),
				'states': {
					..._rfdc(STATE_MAPPING.light),
					'reachability': '.state.reachable'
				}
			}
			
			// validate states
			device.states = validateStates(device.states, deviceStructure);
			
			// resolve
			resolve(device);
		}
		
		// sensor
		else if (deviceStructure.root.indexOf('.sensors.') > -1) {
			// inherit all states of config, state and action channel
			deviceStructure.list.forEach(s => {
				if (s.indexOf('.config.') > -1 || s.indexOf('.state.') > -1 || s.indexOf('.action.') > -1) {
					const stateKey = s.substr(s.lastIndexOf('.') + 1);
					device.states[stateKey] = detectStateElements(s, deviceStructure);
				}
			});
			
			// detect function
			device = detectFunction(device);
			
			// resolve
			resolve(device);
		}
		
		// not supported
		else {
			resolve({});
		}
	});
}
