import { parseDefault } from '../adapters'

export default 'innogy / Livisi SmartHome'
export const namespace = 'innogy-smarthome'

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
