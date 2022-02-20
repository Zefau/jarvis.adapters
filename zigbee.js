import { parseDefault } from '../adapters';

export default 'Zigbee';
export const namespace = 'zigbee';

export const deviceObjectType = 'device';

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
