import { parseDefault } from '../adapters';

export default 'Wifilight';
export const namespace = 'wifilight';

export const deviceObjectType = 'device';

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
