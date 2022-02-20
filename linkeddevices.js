import { parseDefault } from '../adapters';

export default 'Linked Devices';
export const namespace = 'linkeddevices';

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
