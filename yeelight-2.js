import { parseDefault } from '../adapters';

export default 'Yeelight 2';
export const namespace = 'yeelight-2';

export const deviceObjectType = 'device';

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
