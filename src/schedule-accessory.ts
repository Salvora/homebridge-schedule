import {
	AccessoryConfig,
	AccessoryPlugin,
	API,
	CharacteristicEventTypes,
	CharacteristicGetCallback,
	CharacteristicSetCallback,
	CharacteristicValue,
	HAP,
	Logging,
	Service,
} from 'homebridge';

let hap: HAP;

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
	hap = api.hap;
	api.registerAccessory('ScheduleAccessory', ScheduleAccessory);
};

class ScheduleAccessory implements AccessoryPlugin {
	private readonly log: Logging;
	private readonly name: string;
	private scheduleOn = false;

	private readonly switchService: Service;
	private readonly informationService: Service;

	constructor(log: Logging,
		config: AccessoryConfig) {
		this.log = log;
		this.name = config.name;

		this.switchService = new hap.Service.Switch(this.name);

		this.switchService.getCharacteristic(hap.Characteristic.On)
			.on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
				this.log.info('Schedule: ' + (this.scheduleOn ? 'ON' : 'OFF'));
				callback(undefined, this.scheduleOn);
			})
			.on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
				this.scheduleOn = value as boolean;
				this.log.info('Schedule was set to: ' + (this.scheduleOn ? 'ON' : 'OFF'));
				callback();
			});

		this.informationService = new hap.Service.AccessoryInformation()
			.setCharacteristic(hap.Characteristic.Manufacturer, 'Homebridge Schedule')
			.setCharacteristic(hap.Characteristic.Model, config.interval);

		log.info('Initialization complete');
	}

	/*
	 * This method is called directly after creation of this instance.
	 * It should return all services which should be added to the accessory.
	 */
	getServices(): Service[] {
		return [
			this.informationService,
			this.switchService,
		];
	}
}