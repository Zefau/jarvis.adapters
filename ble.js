import { parseDefault } from '../adapters'

export default 'Bluetooth (ble)'
export const namespace = 'ble'

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
