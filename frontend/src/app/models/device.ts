export class Device {
    idModel: string;
    microcontroller: string;
    versionSoftware: string;
    ubication: string;
    nameModule: string;
    telemetry: {
        method: string,
        gprsDevice?: string,
        imei?: string,
        userWifi?: string,
        passwordWifi?: string,
        number?: string
    }
    Sensor: {
        model: string;
        size: number;
    }
    record: [
        time: Date,
        LpS: number,
        Mc: number,
    ]
}