import { parseDefault } from '../adapters';

export default 'Lifx';
export const namespace = 'lifx';

export const deviceObjectType = 'channel';

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
