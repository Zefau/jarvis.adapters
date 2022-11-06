import { parseDefault } from '../adapters';

export default 'Zigbee2MQTT';
export const namespace = 'zigbee2mqtt';

export const deviceObjectType = 'device';

/**
 *
 */
export function parse(deviceStructure, options) {
	return parseDefault(deviceStructure, options);
}
