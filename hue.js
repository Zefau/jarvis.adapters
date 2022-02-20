import { validateStates, parseDefault } from '../adapters'
const clone = require('rfdc')()

export default 'hue'
export const namespace = 'hue'

export const deviceObjectType = 'channel';

/*
 * State Mapping
 */
const STATE_MAPPING = {

	// lights
	"light": {
		"power": {
			"state": ".on",
			"action": ".on"
		},
		"level": {
			"state": ".level",
			"action": ".level"
		},
		"colorTemperature": {
			"state": ".ct",
			"action": ".ct"
		},
		"hue": {
			"state": ".hue",
			"action": ".hue"
		},
		"reachability": {
			"state": ".reachable"
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
	return new Promise(resolve => {
		const device = {
			'name': deviceStructure.objects[deviceStructure.root].common.name,
			'function': 'light',
			'states': clone(STATE_MAPPING.light)
		}
		
		// validate states
		device.states = validateStates(device.states, deviceStructure);
		
		// no light, thus inherit all states
		if (device.states.level !== undefined || device.states.colorTemperature !== undefined || device.states.hue !== undefined) {
			parseDefault(deviceStructure, options).then(resolve);
		}
		else {
			resolve(device);
		}
	});
}
