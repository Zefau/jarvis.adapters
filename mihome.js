import { parseDefault } from '../adapters';

export default 'mihome';
export const namespace = 'mihome';

export const deviceObjectType = 'channel';
export const devicePattern = 'devices\\.(.*)_(.*)';

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
