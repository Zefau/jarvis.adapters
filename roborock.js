import { v5 as uuid } from 'uuid';
import _rfdc from 'rfdc/default';

import Connection from 'src/controllers/Connection';
import { validateStates, getRoom } from '../adapters';

import { allSettled } from 'src/helpers/utils';

export default 'roborock';
export const namespace = 'roborock';

/*
 * State Mapping
 */
const STATE_MAPPING = {
	// cleaningInfo
	"cleaningInfoTotalTime": {
		"state": ".cleaningInfo.0"
	},
	"cleaningInfoTotalArea": {
		"state": ".cleaningInfo.1"
	},
	"cleaningInfoCycles": {
		"state": ".cleaningInfo.2"
	},
	"cleaningInfoRecords": {
		"state": ".cleaningInfo.3"
	},
	"cleaningInfoJson": {
		"state": ".cleaningInfo.JSON"
	},
	
	// commands
	"commandAppCharge": {
		"state": ".commands.app_charge",
		"action": ".commands.app_charge",
		"actionElement": "IconButtonAction"
	},
	"commandAppGoToTarget": {
		"state": ".commands.app_goto_target",
		"action": ".commands.app_goto_target",
		"actionElement": "InputAction"
	},
	"commandAppPause": {
		"state": ".commands.app_pause",
		"action": ".commands.app_pause",
		"actionElement": "IconButtonAction"
	},
	"commandAppSegmentClean": {
		"state": ".commands.app_segment_clean",
		"action": ".commands.app_segment_clean",
		"actionElement": "IconButtonAction"
	},
	"commandAppSpot": {
		"state": ".commands.app_spot",
		"action": ".commands.app_spot",
		"actionElement": "IconButtonAction"
	},
	"commandAppStart": {
		"state": ".commands.app_start",
		"action": ".commands.app_start",
		"actionElement": "IconButtonAction"
	},
	"commandAppStop": {
		"state": ".commands.app_stop",
		"action": ".commands.app_stop",
		"actionElement": "IconButtonAction"
	},
	"commandAppZonedClean": {
		"state": ".commands.app_zoned_clean",
		"action": ".commands.app_zoned_clean",
		"actionElement": "InputAction"
	},
	"commandFindMe": {
		"state": ".commands.find_me",
		"action": ".commands.find_me",
		"actionElement": "IconButtonAction"
	},
	"commandResumeSegmentClean": {
		"state": ".commands.resume_segment_clean",
		"action": ".commands.resume_segment_clean",
		"actionElement": "IconButtonAction"
	},
	"commandResumeZonedClean": {
		"state": ".commands.resume_zoned_clean",
		"action": ".commands.resume_zoned_clean",
		"actionElement": "IconButtonAction"
	},
	"commandStopZonedClean": {
		"state": ".commands.stop_zoned_clean",
		"action": ".commands.stop_zoned_clean",
		"actionElement": "IconButtonAction"
	},
	"commandSetCustomMode": {
		"state": ".commands.set_custom_mode",
		"action": ".commands.set_custom_mode",
		"actionElement": "DropdownAction",
		"display": {
			"101": "Quiet",
			"102": "Balanced",
			"103": "Turbo",
			"104": "Max",
			"105": "Off"
		}
	},
	"commandSetMopMode": {
		"state": ".commands.set_mop_mode",
		"action": ".commands.set_mop_mode",
		"actionElement": "DropdownAction",
		"display": {
			"300": "Standard",
			"301": "Deep",
			"303": "Deep+"
		}
	},
	
	// consumables
	"consumableDustCollectionWorkTimes": {
		"state": ".consumables.dust_collection_work_times",
		"action": ".reset_consumables.dust_collection_work_times",
		"actionElement": "IconButtonAction"
	},
	"consumableFilterElementWorkTime": {
		"state": ".consumables.filter_element_work_time",
		"action": ".reset_consumables.filter_element_work_time",
		"actionElement": "IconButtonAction"
	},
	"consumableFilterLife": {
		"state": ".consumables.filter_life"
	},
	"consumableFilterWorkTime": {
		"state": ".consumables.filter_work_time",
		"action": ".reset_consumables.filter_work_time",
		"actionElement": "IconButtonAction"
	},
	"consumableMainBrushLife": {
		"state": ".consumables.main_brush_life"
	},
	"consumableMainBrushWorkTime": {
		"state": ".consumables.main_brush_work_time",
		"action": ".reset_consumables.main_brush_work_time",
		"actionElement": "IconButtonAction"
	},
	"consumableSideBrushLife": {
		"state": ".consumables.side_brush_life"
	},
	"consumableSideBrushWorkTime": {
		"state": ".consumables.side_brush_work_time",
		"action": ".reset_consumables.side_brush_work_time",
		"actionElement": "IconButtonAction"
	},
	"consumableSensorDirtyTime": {
		"state": ".consumables.sensor_dirty_time",
		"action": ".reset_consumables.sensor_dirty_time",
		"actionElement": "IconButtonAction"
	},
	
	
	// device info
	"deviceInfoActiveTime": {
		"state": ".deviceInfo.activeTime"
	},
	"deviceInfoFirmwareUpdate": {
		"state": ".deviceInfo.f"
	},
	"deviceInfoFirmwareVersion": {
		"state": ".deviceInfo.fv"
	},
	"deviceInfoName": {
		"state": ".deviceInfo.name"
	},
	"deviceInfoOnline": {
		"state": ".deviceInfo.online"
	},
	
	// device status
	"deviceStatusAdbumper": {
		"state": ".deviceStatus.adbumper_status"
	},
	"deviceStatusDockError": {
		"state": ".deviceStatus.dock_error_status"
	},
	"deviceStatusDustCollectionAuto": {
		"state": ".deviceStatus.auto_dust_collection"
	},
	"deviceStatusDustCollectionStatus": {
		"state": ".deviceStatus.dust_collection_status"
	},
	"deviceStatusBattery": {
		"state": ".deviceStatus.battery",
		"unit": "%"
	},
	"deviceStatusCarpetMode": {
		"state": ".deviceStatus.carpet_mode"
	},
	"deviceStatusCleanArea": {
		"state": ".deviceStatus.clean_area",
		"unit": " m²"
	},
	"deviceStatusCleanTime": {
		"state": ".deviceStatus.clean_time",
		"unit": " min"
	},
	"deviceStatusDebugMode": {
		"state": ".deviceStatus.debug_mode"
	},
	"deviceStatusDnD": {
		"state": ".deviceStatus.dnd_enabled"
	},
	"deviceStatusDockType": {
		"state": ".deviceStatus.dock_type"
	},
	"deviceStatusErrorCode": {
		"state": ".deviceStatus.error_code",
		"display": {
			"0": "No error",
			"1": "Laser sensor fault",
			"2": "Collision sensor fault",
			"3": "Wheel floating",
			"4": "Cliff sensor fault",
			"5": "Main brush blocked",
			"6": "Side brush blocked",
			"7": "Wheel blocked",
			"8": "Device stuck",
			"9": "Dust bin missing",
			"10": "Filter blocked",
			"11": "Magnetic field detected",
			"12": "Low battery",
			"13": "Charging problem",
			"14": "Battery failure",
			"15": "Wall sensor fault",
			"16": "Uneven surface",
			"17": "Side brush failure",
			"18": "Suction fan failure",
			"19": "Unpowered charging station",
			"20": "Unknown Error",
			"21": "Laser pressure sensor problem",
			"22": "Charge sensor problem",
			"23": "Dock problem",
			"24": "No-go zone or invisible wall detected",
			"254": "Bin full",
			"255": "Internal error",
			"-1": "Unknown Error"
		}
	},
	"deviceStatusFanPower": {
		"state": ".deviceStatus.fan_power",
		"display": {
			"101": "Quiet",
			"102": "Balanced",
			"103": "Turbo",
			"104": "Max",
			"105": "Off"
		}
	},
	"deviceStatusInCleaning": {
		"state": ".deviceStatus.in_cleaning"
	},
	"deviceStatusInFreshTime": {
		"state": ".deviceStatus.in_fresh_state"
	},
	"deviceStatusInReturning": {
		"state": ".deviceStatus.in_returning"
	},
	"deviceStatusIsExploring": {
		"state": ".deviceStatus.is_exploring"
	},
	"deviceStatusIsLocating": {
		"state": ".deviceStatus.is_locating"
	},
	"deviceStatusLabStatus": {
		"state": ".deviceStatus.lab_status"
	},
	"deviceStatusLockStatus": {
		"state": ".deviceStatus.lock_status"
	},
	"deviceStatusMapPresent": {
		"state": ".deviceStatus.map_present"
	},
	"deviceStatusMapStatus": {
		"state": ".deviceStatus.map_status"
	},
	"deviceStatusMopForbbiden": {
		"state": ".deviceStatus.mop_forbidden_enable"
	},
	"deviceStatusMopMode": {
		"state": ".deviceStatus.mop_mode"
	},
	"deviceStatusState": {
		"state": ".deviceStatus.state",
		"display": {
			"0": "Unknown",
			"1": "Initiating",
			"2": "Sleeping",
			"3": "Idle",
			"4": "Remote Control",
			"5": "Cleaning",
			"6": "Returning Dock",
			"7": "Manual Mode",
			"8": "Charging",
			"9": "Charging Error",
			"10": "Paused",
			"11": "Spot Cleaning",
			"12": "In Error",
			"13": "Shutting Down",
			"14": "Updating",
			"15": "Docking",
			"16": "Go To",
			"17": "Zone Clean",
			"18": "Room Clean",
			"22": "Empying dust container",
			"23": "Washing the mop",
			"26": "Going to wash the mop",
			"28": "In call",
			"29": "Mapping",
			"100": "Fully Charged"
		}
	},
	"deviceStatusBoxCarriage": {
		"state": ".deviceStatus.water_box_carriage_status"
	},
	"deviceStatusBoxMode": {
		"state": ".deviceStatus.water_box_mode"
	},
	"deviceStatusBoxStatus": {
		"state": ".deviceStatus.water_box_status"
	},
	"deviceStatusWaterShortage": {
		"state": ".deviceStatus.water_shortage_status"
	},
	
	// map
	"map": {
		"state": ".map.mapBase64",
	}
}

/**
 *
 *
 */

export function parse(deviceStructure, options) {
	return new Promise(resolve => {
		const device = {
			'name': deviceStructure.objects[deviceStructure.root].common.name,
			'function': 'vacuum',
			'room': getRoom(deviceStructure),
			'states': _rfdc(STATE_MAPPING)
		}
		
		// validate states
		device.states = validateStates(device.states, deviceStructure);
		resolve(device);
	});
}
