export class Device {
    microcontroller: string;
    versionSoftware: string;
    telemetry: {
        method: string,
        gprsDevice?: string,
        imei?: string,
        userWifi?: string,
        passwordWifi?: string,
        number?: string
    }
}