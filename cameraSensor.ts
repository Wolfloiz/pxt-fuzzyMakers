//% block="Sensor Camera"color="#ff6600" weight=20 icon="\uf085"
//% advanced=true
namespace Camera {
    // sentry_reg
    const kRegDeviceId = 0x01
    const kRegSensorConfig1 = 0x04
    const kRegLock = 0x05
    const kRegFrameCount = 0x1F
    const kRegVisionId = 0x20
    const kRegVisionConfig1 = 0x21
    const kRegParamNum = 0x23
    const kRegParamId = 0x24
    const kRegsentry_object_tNumber = 0x34
    const kRegsentry_object_tId = 0x35

    const SENTRY_DEVICE_ID = 0x04

    const SENTRY_MAX_RESULT = 25

    const SENTRY_OK = 0x00
    const SENTRY_FAIL = 0x01
    const SENTRY_READ_TIMEOUT = 0x03
    const SENTRY_CHECK_ERROR = 0x04
    const SENTRY_UNKNOWN_PROTOCOL = 0x11

    class sentry_object_t {
        data1: number
        data2: number
        data3: number
        data4: number
        data5: number
        bytestr: string
    }

    let _vision_states: sentry_vision_state_t[] = [null, null, null, null, null, null, null, null, null, null, null, null];

    export class sentry_vision_state_t {
        frame: number
        detect: number
        sentry_objects: sentry_object_t[]

        constructor() {
            this.sentry_objects = [];
            for (let i = 0; i < SENTRY_MAX_RESULT; i++) {
                this.sentry_objects[i] = new sentry_object_t();
            }
        }
    }

    class SentryI2CMethod {

        address: number

        private i2cwrite(reg: number, value: number) {
            let buf = pins.createBuffer(2);
            buf[0] = reg;
            buf[1] = value;

            let ret = pins.i2cWriteBuffer(this.address, buf);

            //console.log("i2cwrite " + this.address.toString() + " reg:" + reg.toString() + "\t" + value.toString() + "\n")

            return ret;
        }

        private i2cread(reg: number) {
            pins.i2cWriteNumber(this.address, reg, NumberFormat.UInt8BE, true);
            let value = pins.i2cReadNumber(this.address, NumberFormat.UInt8BE);

            //console.log("i2cread " + this.address.toString() + " reg:" + reg.toString() + "\t" + value.toString() + "\n")

            return value;
        }

        private Get_u16(reg: number): number {
            return this.Get(reg) << 8 | this.Get(reg + 1)
        }

        Set(reg_address: number, value: number): number {
            this.i2cwrite(reg_address, value);
            return SENTRY_OK;
        }

        Get(reg_address: number): number {
            let value = this.i2cread(reg_address);

            return value;
        }

        Read(vision_type: sentry_vision_e): number {
            let err = SENTRY_OK;

            err = this.Set(kRegVisionId, vision_type);

            if (err) return err;

            _vision_states[vision_type - 1].frame = this.Get(kRegFrameCount)
            _vision_states[vision_type - 1].detect = this.Get(kRegsentry_object_tNumber)

            if (_vision_states[vision_type - 1].detect <= 0) {
                return SENTRY_OK
            }

            if (SENTRY_MAX_RESULT < _vision_states[vision_type - 1].detect) {
                _vision_states[vision_type - 1].detect = SENTRY_MAX_RESULT;
            }

            if (sentry_vision_e.kVisionQrCode == vision_type) {
                _vision_states[vision_type - 1].detect = 1;
            }

            for (let i = 0; i < _vision_states[vision_type - 1].detect; i++) {
                err = this.Set(kRegsentry_object_tId, i + 1);
                if (err) return err;

                _vision_states[vision_type - 1].sentry_objects[i].data1 = this.Get_u16(0x80)
                _vision_states[vision_type - 1].sentry_objects[i].data2 = this.Get_u16(0x82)
                _vision_states[vision_type - 1].sentry_objects[i].data3 = this.Get_u16(0x84)
                _vision_states[vision_type - 1].sentry_objects[i].data4 = this.Get_u16(0x86)
                _vision_states[vision_type - 1].sentry_objects[i].data5 = this.Get_u16(0x88)

                if (sentry_vision_e.kVisionQrCode == vision_type) {
                    let bytec = 0;
                    let sentry_object_t_id = 0;
                    let offset = 0;
                    let bytestr: string = "";

                    for (let i = 0; i < _vision_states[vision_type - 1].sentry_objects[0].data5; i++) {
                        sentry_object_t_id = (i / 5 + 2) | 0;
                        offset = i % 5;
                        if (0 == i % 5) {
                            err = this.Set(kRegsentry_object_tId, sentry_object_t_id)
                            if (err) return err;
                        }

                        bytec = this.Get(0x81 + 2 * offset)

                        bytestr += String.fromCharCode(bytec)
                    }

                    _vision_states[vision_type - 1].sentry_objects[0].bytestr = bytestr;
                }
            }

            return SENTRY_OK
        }

        SetParam(vision_id: number, param: sentry_object_t, param_id: number): number {
            let err = SENTRY_OK
            err = this.Set(kRegVisionId, vision_id)
            if (err) return err;

            err = this.Set(kRegParamId, param_id)
            if (err) return err;

            this.Set(0x70, (param.data1 >> 8) & 0xFF)
            this.Set(0x71, param.data1 & 0xFF)
            this.Set(0x72, (param.data2 >> 8) & 0xFF)
            this.Set(0x73, param.data2 & 0xFF)
            this.Set(0x74, (param.data3 >> 8) & 0xFF)
            this.Set(0x75, param.data3 & 0xFF)
            this.Set(0x76, (param.data4 >> 8) & 0xFF)
            this.Set(0x77, param.data4 & 0xFF)
            this.Set(0x78, (param.data5 >> 8) & 0xFF)
            this.Set(0x79, param.data5 & 0xFF)

            return SENTRY_OK;
        }
    }

    class SentryUartMethod {
        address: number

        private get_error_code(code: number) {
            let value = SENTRY_FAIL;

            switch (code) {
                case protocol.SENTRY_PROTOC_OK:
                    value = SENTRY_OK;
                    break;
                case protocol.SENTRY_PROTOC_RESULT_NOT_END:
                    value = SENTRY_OK;
                    break;
                case protocol.SENTRY_PROTOC_TIMEOUT:
                    value = SENTRY_READ_TIMEOUT;
                    break;
                case protocol.SENTRY_PROTOC_CHECK_ERROR:
                    value = SENTRY_CHECK_ERROR;
                    break;
                case protocol.SENTRY_PROTOC_LENGTH_ERROR:
                case protocol.SENTRY_PROTOC_UNSUPPORT_COMMAND:
                case protocol.SENTRY_PROTOC_UNSUPPORT_REG_ADDRESS:
                case protocol.SENTRY_PROTOC_UNSUPPORT_REG_VALUE:
                    value = SENTRY_UNKNOWN_PROTOCOL;
                    break;
                default: break;
            }

            return value;
        }

        Set(reg_address: number, value: number): number {
            let pkg: number[] = [this.address, protocol.SENTRY_PROTOC_COMMADN_SET, reg_address, value];

            let err = protocol.writepkg(pkg);
            if (!err) {
                return SENTRY_FAIL;
            }

            pkg = protocol.readpkg();
            return this.get_error_code(pkg[3]);

        }

        Get(reg_address: number): number {
            let pkg: number[] = [this.address, protocol.SENTRY_PROTOC_COMMADN_GET, reg_address];

            let err = protocol.writepkg(pkg);
            let value = 0;
            if (!err) {
                return value;
            }

            pkg = protocol.readpkg();
            value = this.get_error_code(pkg[3]);

            return pkg[5];
        }

        Read(vision_type: sentry_vision_e): number {
            let pkg: number[] = [this.address, protocol.SENTRY_PROTOC_GET_RESULT, vision_type, 0, 0];
            let err = protocol.writepkg(pkg);
            let value = 0;
            _vision_states[vision_type - 1].detect = 0;

            if (!err) {
                return SENTRY_FAIL;
            }

            for (; ;) {
                pkg = protocol.readpkg();

                value = this.get_error_code(pkg[3]);

                if (SENTRY_OK == value && pkg[4] == protocol.SENTRY_PROTOC_GET_RESULT) {
                    if (vision_type == pkg[6]) {
                        _vision_states[vision_type - 1].frame = pkg[5];
                        let start_id = pkg[7];
                        let stop_id = pkg[8];
                        if (stop_id == 0) return SENTRY_OK;

                        for (let i = start_id - 1, j = 0; i < stop_id; i++, j++) {
                            _vision_states[vision_type - 1].sentry_objects[i].data1 = pkg[10 * j + 9] << 8 | pkg[10 * j + 10];
                            _vision_states[vision_type - 1].sentry_objects[i].data2 = pkg[10 * j + 11] << 8 | pkg[10 * j + 12];
                            _vision_states[vision_type - 1].sentry_objects[i].data3 = pkg[10 * j + 13] << 8 | pkg[10 * j + 14];
                            _vision_states[vision_type - 1].sentry_objects[i].data4 = pkg[10 * j + 15] << 8 | pkg[10 * j + 16];
                            _vision_states[vision_type - 1].sentry_objects[i].data5 = pkg[10 * j + 17] << 8 | pkg[10 * j + 18];
                            _vision_states[vision_type - 1].detect++;

                            if (sentry_vision_e.kVisionQrCode == vision_type) {
                                let bytec = 0;
                                let bytestr: string = "";

                                for (let i = 0; i < _vision_states[vision_type - 1].sentry_objects[0].data5; i++) {
                                    bytec = pkg[20 + 2 * i];
                                    bytestr += String.fromCharCode(bytec)
                                }

                                _vision_states[vision_type - 1].sentry_objects[0].bytestr = bytestr;

                                break;
                            }
                        }

                        if (pkg[3] == protocol.SENTRY_PROTOC_RESULT_NOT_END) {
                            continue;
                        } else {
                            return SENTRY_OK
                        }
                    }

                }

                return SENTRY_FAIL;
            }
        }

        SetParam(vision_id: number, param: sentry_object_t, param_id: number): number {
            let pkg: number[] = [this.address, protocol.SENTRY_PROTOC_SET_PARAM, vision_id, param_id, param_id];

            pkg.push((param.data1 >> 8) & 0xFF); pkg.push(param.data1 & 0xff);
            pkg.push((param.data1 >> 8) & 0xFF); pkg.push(param.data1 & 0xff);
            pkg.push((param.data1 >> 8) & 0xFF); pkg.push(param.data1 & 0xff);
            pkg.push((param.data1 >> 8) & 0xFF); pkg.push(param.data1 & 0xff);
            pkg.push((param.data1 >> 8) & 0xFF); pkg.push(param.data1 & 0xff);

            let err = protocol.writepkg(pkg);
            if (!err) {
                return SENTRY_FAIL;
            }

            pkg = protocol.readpkg();
            return this.get_error_code(pkg[3]);
        }
    }

    class SentryMethod {
        _address: number;
        _stream: SentryI2CMethod | SentryUartMethod;
        _mode: sentry_mode_e;

        img_w = 0;
        img_h = 0;
        constructor(addr: number) {
            this._address = addr
            this._mode = sentry_mode_e.kUnknownMode;
        }

        Begin(mode: sentry_mode_e): number {
            if (mode == sentry_mode_e.kUnknownMode) {
                mode = sentry_mode_e.kI2CMode;
            }

            if (this._mode != mode) {
                this._mode = mode;
                if (mode == sentry_mode_e.kI2CMode) {
                    this._stream = new SentryI2CMethod();
                } else {
                    this._stream = new SentryUartMethod();
                }
                this._stream.address = this._address;
            }

            if (this.SensorInit()) {
                return SENTRY_FAIL;
            }

            return SENTRY_OK;
        }

        SensorInit() {
            let err = SENTRY_OK;

            /* Check sensor startup*/
            err = this.SensorStartupCheck();
            if (err) return err;
            /* Check sentry protocol version */
            err = this.ProtocolVersionCheck();
            if (err) return err;
            /* Sensor set default if version is correction. */
            err = this.SensorSetDefault();
            if (err) return err;
            /* Get sensor image shape. */
            err = this.GetImageShape();
            if (err) return err;

            return SENTRY_OK;
        }

        SensorStartupCheck() {
            let err_count = 0;
            let start_up = 0;
            while (true) {
                if (++err_count > 100) return SENTRY_FAIL;  // set max retry times

                start_up = this._stream.Get(kRegSensorConfig1);
                if (start_up & 0x01) break;

                basic.pause(200);
            }

            return SENTRY_OK;
        }

        ProtocolVersionCheck() {
            let err = SENTRY_OK;
            let err_count = 0;
            let device_id = 0;
            while (true) {
                if (++err_count > 3) return SENTRY_UNKNOWN_PROTOCOL;
                device_id = this._stream.Get(kRegDeviceId);

                if (device_id == SENTRY_DEVICE_ID) break;
            }
            return err;
        }

        SensorSetDefault() {
            let sensor_config_reg_value = this._stream.Get(kRegSensorConfig1);
            sensor_config_reg_value |= 0x08;
            let err = this._stream.Set(kRegSensorConfig1, sensor_config_reg_value);
            while (true) {
                sensor_config_reg_value = this._stream.Get(kRegSensorConfig1);
                if (err) return err;

                if (!(sensor_config_reg_value & 0x08)) break;
            }
            return err;
        }

        GetImageShape() {
            this.img_w = this._stream.Get(0x1B) << 8 | this._stream.Get(0x1C);
            this.img_h = this._stream.Get(0x1D) << 8 | this._stream.Get(0x1E);
            return SENTRY_OK
        }

        VisionSetStatus(vision_type: sentry_vision_e, enable: SentryStatus) {
            let err = SENTRY_OK;
            let vision_config1 = 0;

            err = this._stream.Set(kRegVisionId, vision_type);
            if (err) return err;

            vision_config1 = this._stream.Get(kRegVisionConfig1);

            let status = vision_config1 & 0x01
            if (status != enable) {
                vision_config1 &= 0xfe
                vision_config1 |= enable & 0x01;
            }

            err = this._stream.Set(kRegVisionConfig1, vision_config1);
            if (err) return err;

            if (enable && _vision_states[vision_type - 1] == null) {
                _vision_states[vision_type - 1] = new sentry_vision_state_t();
            }

            return SENTRY_OK;
        }

        GetValue(vision_type: sentry_vision_e, obj_info: sentry_obj_info_e, obj_id: number = 1) {

            if (obj_info == sentry_obj_info_e.kStatus) {
                while (this.UpdateResult(vision_type));
            }

            return this.read(vision_type, obj_info, obj_id)
        }

        GetQrCodeValue(): string {

            if (_vision_states[sentry_vision_e.kVisionQrCode - 1] == null) return "";

            return _vision_states[sentry_vision_e.kVisionQrCode - 1].sentry_objects[0].bytestr;
        }

        SetParamNum(vision_type: sentry_vision_e, max_num: number) {
            let err = SENTRY_OK;

            err = this._stream.Set(kRegVisionId, vision_type);
            if (err) return err;

            err = this._stream.Set(kRegParamNum, max_num);

            return err;
        }

        SetParam(vision_type: sentry_vision_e, param: sentry_object_t, param_id: number = 1) {
            if (param_id < 1 || param_id > SENTRY_MAX_RESULT)
                return SENTRY_FAIL;

            return this._stream.SetParam(vision_type, param, param_id)
        }

        _SensorLockkReg(lock: SentryStatus) {
            let err = SENTRY_OK;
            let status = 0;

            for (; ;) {
                status = this._stream.Get(kRegLock);
                if (status == lock) {
                    return SENTRY_OK;
                }
                err = this._stream.Set(kRegLock, lock);
                if (err) return err;
            }
        }

        UpdateResult(vision_type: sentry_vision_e) {
            if (vision_type >= sentry_vision_e.kVisionMaxType)
                return 0;

            let frame = this._stream.Get(kRegFrameCount);

            while (SENTRY_OK != this._SensorLockkReg(SentryStatus.Disable));

            if (frame == _vision_states[vision_type - 1].frame) return SENTRY_FAIL;

            while (SENTRY_OK != this._SensorLockkReg(SentryStatus.Enable));

            let err = this._stream.Read(vision_type);

            while (SENTRY_OK != this._SensorLockkReg(SentryStatus.Disable));

            return err;
        }

        private read(vision_type: sentry_vision_e, obj_info: sentry_obj_info_e, obj_id: number = 1) {

            if (obj_id > SENTRY_MAX_RESULT || obj_id < 1)
                return 0;

            if (null == _vision_states[vision_type - 1] || (vision_type - 1) >= sentry_vision_e.kVisionMaxType)
                return 0;

            obj_id = obj_id - 1;

            switch (obj_info) {
                case sentry_obj_info_e.kStatus:
                    return _vision_states[vision_type - 1].detect;
                case sentry_obj_info_e.kXValue:
                    return _vision_states[vision_type - 1].sentry_objects[obj_id].data1;
                case sentry_obj_info_e.kYValue:
                    return _vision_states[vision_type - 1].sentry_objects[obj_id].data2;
                case sentry_obj_info_e.kWidthValue:
                    return _vision_states[vision_type - 1].sentry_objects[obj_id].data3;
                case sentry_obj_info_e.kHeightValue:
                    return _vision_states[vision_type - 1].sentry_objects[obj_id].data4;
                case sentry_obj_info_e.kLabel:
                    return _vision_states[vision_type - 1].sentry_objects[obj_id].data5;
                case sentry_obj_info_e.kGValue:
                    return _vision_states[vision_type - 1].sentry_objects[obj_id].data1;
                case sentry_obj_info_e.kRValue:
                    return _vision_states[vision_type - 1].sentry_objects[obj_id].data2;
                case sentry_obj_info_e.kBValue:
                    return _vision_states[vision_type - 1].sentry_objects[obj_id].data3;
                default:
                    return 0;
            }
        }

        VisionSetDefault(vision_type: sentry_vision_e) {
            return this._stream.Set(kRegVisionId, vision_type);
        }
    }

    let pSentry: SentryMethod = null;

    /**
     * Inicia camera
     */
    //% blockId=Sentry_begin block="inicializar camera %mode |endereço %addr"
    //% mode.defl=sentry_mode_e.kI2CMode
    //% group="Configuração"
    export function Begin(mode: sentry_mode_e, addr: sentry_addr_e) {
        if (pSentry == null) {
            pSentry = new SentryMethod(addr)
            while (pSentry.Begin(mode) != SENTRY_OK);
        }
    }

    /**
     * Habilita visão da camera.
    */
    //% blockId=Sentry_vision_Set block="definir camera %enable|algoritmo%vision_type "
    //% group="Configuração"
    export function VisionSetStatus(status: SentryStatus, vision_type: sentry_vision_e) {
        while (pSentry.VisionSetStatus(vision_type, status) != SENTRY_OK);
    }

    /**
    * define o número de parâmetros de visão.
    * @param vision_type: tipo de visão.
    * @param max_num número máximo de parâmetros.
    */
    //% blockId=Sentry_vision_SetParamNum block="definir algoritmo camera %vision_type|maior número %max_num "
    //% max_num.min=1 max_num.max=25 max_num.defl=1
    //% group="AlgorithmSettings" advanced=true
    export function SetParamNum(vision_type: sentry_vision_e, max_num: number) {
        while (pSentry.SetParamNum(vision_type, max_num) != SENTRY_OK);
    }

    /**
    * define os parâmetros de cor. ROI -> região de interesse.
    * @param x posição X do centro da ROI.
    * @param y posição Y do centro da ROI.
    * @param w largura da ROI.
    * @param h altura da ROI.
    */
    //% blockId=Sentry_vision_color_param block="definir algoritmo de Cor ROI centro x%x| y%y| peso%w| altura%h ||indice de parametro %param_id"
    //% param_id.min=1 param_id.max=25 param_id.defl=1
    //% inlineInputMode=inline
    //% group="AlgorithmSettings" advanced=true
    export function SetColorParam(x: number, y: number, w: number, h: number, param_id: number = 1) {
        let prama = new sentry_object_t();
        prama.data1 = x;
        prama.data2 = y;
        prama.data3 = w;
        prama.data4 = h;
        while (pSentry.SetParam(sentry_vision_e.kVisionColor, prama, param_id) != SENTRY_OK);
    }

    /**
     * parâmetros de blob.
     * @param w largura mínima detectada.
     * @param h altura mínima detectada.
    * @param l rótulo detectado.
    */
    //% blockId=Sentry_vision_bold_param block="definir algoritmo de blob peso mínimo%w| altura %h| rótulo%l ||índice de parâmetro %param_id"
    //% param_id.min=1 param_id.max=25 param_id.defl=1
    //% inlineInputMode=inline
    //% group="AlgorithmSettings" advanced=true
    export function SetBoldParam(w: number, h: number, l: color_label_e, param_id: number = 1) {
        let prama = new sentry_object_t();
        prama.data3 = w;
        prama.data4 = h;
        prama.data5 = l;
        while (pSentry.SetParam(sentry_vision_e.kVisionBlob, prama, param_id) != SENTRY_OK);
    }
    /**
    * parâmetros personalizados.
    * @param param1 primeiro parâmetro.
    * @param param2 segundo parâmetro.
    * @param param3 terceiro parâmetro.
    * @param param4 quarto parâmetro.
    * @param param5 quinto parâmetro.
    */
    //% blockId=Sentry_vision_custom_param block="definir camera %vision_type|  param1%param1| param2%param2| param3%param3| param4%param4| param5%param5 || índice  %param_id  "
    //% param_id.min=1 param_id.max=25 param_id.defl=1
    //% vision_type.defl=sentry_vision_e.kVisionCustom
    //% inlineInputMode=inline
    //% group="AlgorithmSettings" advanced=true
    export function SetCustomParam(vision_type: sentry_vision_e, param1: number, param2: number, param3: number, param4: number, param5: number, param_id: number = 1) {
        let prama = new sentry_object_t();
        prama.data1 = param1;
        prama.data2 = param2;
        prama.data3 = param3;
        prama.data4 = param4;
        prama.data5 = param5;
        while (pSentry.SetParam(vision_type, prama, param_id) != SENTRY_OK);
    }
    /**
    * obtém o número de detecções da visão
    * @param type tipo de visão
    */
    //% blockId=Sentry_detected block="Camera algoritmo de %vision_type detectou o número " color="#2E8B57"
    //% group="Funções" advanced=false
    export function Detected(vision_type: sentry_vision_e): number {
        return pSentry.GetValue(vision_type, sentry_obj_info_e.kStatus)
    }

    /**
    * obtém os dados de vision sentry_object_t; esta função atualiza automaticamente o sentry_object_t.
    * @param vision_type tipo de visão.
    * @param obj_info informação do objeto.
    * @param obj_id índice do objeto.
    */
    //% blockId=Sentry_get_value block=" Camera algoritmo de %vision_type| reconhecimento %obj_info|| índice %obj_id " color="#2E8B57"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Funções"
    export function GetValue(vision_type: sentry_vision_e, obj_info: sentry_gen_info_e, obj_id: number = 1): number {
        return <number>pSentry.GetValue(<number>vision_type, <number>obj_info, obj_id);
    }
    //% blockId=Sentry_get_custom_value block=" Camera algoritmo de %vision_type| obtêm %obj_info|| índice %obj_id " color="#2E8B57"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% vision_type.defl=sentry_vision_e.kVisionCustom
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Funções"
    export function GetCustomValue(vision_type: sentry_vision_e, obj_info: sentry_custom_info_e, obj_id: number = 1): number {
        return <number>pSentry.GetValue(<number>vision_type, <number>obj_info, obj_id);
    }
    /**
     * obtém o resultado do reconhecimento de cor.
    * @param obj_info tipo de parâmetro
    * @param obj_id índice do objeto
    */
    //% blockId=Sentry_get_color_value block=" Camera algoritmo reconhecimento de Cor  %obj_info || índice %obj_id" color="#2E8B57""
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Funções"
    export function ColorRcgValue(obj_info: sentry_color_info_e, obj_id: number = 1): number {
        return pSentry.GetValue(sentry_vision_e.kVisionColor, <number>obj_info, obj_id)
    }
    /**
    * obtém o valor da linha detectada pela visão.
    * @param obj_info tipo de parâmetro
    * @param obj_id índice do objeto
     */
    //% blockId=Sentry_get_Line_value block=" Camera algoritmo reconhecimennto de linha | %obj_info || índice %obj_id " color="#2E8B57"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Funções"
    export function LineValue(obj_info: sentry_Line_info_e, obj_id: number = 1): number {
        return pSentry.GetValue(sentry_vision_e.kVisionLine, <number>obj_info, obj_id)
    }

    /**
    * obtém o resultado do reconhecimento de cor.
    * @param obj_info tipo de parâmetro
    */
    //% blockId=Sentry_get_qrRcg_value  block="Camera reconhecimento de QrCode |%obj_info " color="#2E8B57"
    //% group="Funções"
    export function QrRcgValue(obj_info: sentry_qr_info_e): number {
        return pSentry.GetValue(sentry_vision_e.kVisionQrCode, <number>obj_info)
    }

    /**
    * obtém o valor detectado do QrCode.
    */
    //% blockId=Sentry_get_qr_value block=" Camera valor QrCode " color="#2E8B57"
    //% group="Funções"
    export function GetQrCodeValue(): string {
        return pSentry.GetQrCodeValue()
    }

    /**
    * Cor detectada
    * @param lable rótulo da cor
    * @param obj_id índice do objeto
    */
    //% blockId=Sentry_detected_color block=" Camera detectou cor %lable || índice %obj_id " color="#2E8B57"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Funções"
    export function DetectedColor(lable: color_label_e, obj_id: number = 1): boolean {
        return (pSentry.GetValue(sentry_vision_e.kVisionColor, sentry_obj_info_e.kLabel, obj_id) == lable)
    }

    /**
    * Blob detectado
    * @param lable rótulo do blob
    * @param obj_id índice do objeto
    */
    //% blockId=Sentry_detected_blob block=" Camera detectou blob %lable || índice %obj_id " color="#2E8B57"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Funções"
    export function DetectedBlob(lable: color_label_e, obj_id: number = 1): boolean {
        return (pSentry.GetValue(sentry_vision_e.kVisionBlob, sentry_obj_info_e.kLabel, obj_id) == lable)
    }

    /**
    * Cartão detectado
    * @param lable rótulo do cartão
    * @param obj_id índice do objeto
    */
    //% blockId=Sentry_detected_card block=" Camera detectou cartão %lable || índice %obj_id " color="#2E8B57"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Funções"
    export function DetectedCard(lable: card_label_e, obj_id: number = 1): boolean {
        return (pSentry.GetValue(sentry_vision_e.kVisionCard, sentry_obj_info_e.kLabel, obj_id) == lable)
    }

    /**
    * 20 Classes detectadas
    * @param lable rótulo das 20 Classes
    * @param obj_id índice do objeto
    */
    //% blockId=Sentry_detected_class20 block=" Camera detectou 20Class %lable || index %obj_id " color="#2E8B57"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Funções"
    export function Detected20Class(lable: class20_label_e, obj_id: number = 1): boolean {
        return (pSentry.GetValue(sentry_vision_e.kVision20Classes, sentry_obj_info_e.kLabel, obj_id) == lable)
    }
}

namespace protocol {
    /* Protocol Error Type */
    export const SENTRY_PROTOC_OK = 0xE0
    export const SENTRY_PROTOC_FAIL = 0xE1
    export const SENTRY_PROTOC_UNKNOWN = 0xE2
    export const SENTRY_PROTOC_TIMEOUT = 0xE3
    export const SENTRY_PROTOC_CHECK_ERROR = 0xE4
    export const SENTRY_PROTOC_LENGTH_ERROR = 0xE5
    export const SENTRY_PROTOC_UNSUPPORT_COMMAND = 0xE6
    export const SENTRY_PROTOC_UNSUPPORT_REG_ADDRESS = 0xE7
    export const SENTRY_PROTOC_UNSUPPORT_REG_VALUE = 0xE8
    export const SENTRY_PROTOC_READ_ONLY = 0xE9
    export const SENTRY_PROTOC_RESTART_ERROR = 0xEA
    export const SENTRY_PROTOC_RESULT_NOT_END = 0xEC

    /* Protocol */
    export const SENTRY_PROTOC_START = 0xFF
    export const SENTRY_PROTOC_END = 0xED
    export const SENTRY_PROTOC_COMMADN_SET = 0x01
    export const SENTRY_PROTOC_COMMADN_GET = 0x02
    export const SENTRY_PROTOC_SET_PARAM = 0x21
    export const SENTRY_PROTOC_GET_RESULT = 0x23
    export const SENTRY_PROTOC_MESSAGE = 0x11

    let readbuff: Buffer = pins.createBuffer(0);
    //% block
    //% blockHidden=true
    export function readpkg(timeout: number = 1000): number[] {
        let protocol_buf: number[] = [];
        let start_receive = false;
        let timeout_t = timeout;

        serial.setRxBufferSize(255);
        for (; ;) {
            if (readbuff.length < 1) {
                readbuff = serial.readBuffer(0);
            }

            if (readbuff.length > 0) {

                for (let index = 0; index < readbuff.length; ++index) {
                    let value = readbuff.getUint8(index)
                    switch (value) {
                        case SENTRY_PROTOC_START:
                            start_receive = true;
                            break;
                        case SENTRY_PROTOC_END:

                            if (start_receive && (protocol_buf.length + 1) == protocol_buf[1]) {
                                value = protocol_buf[0];

                                for (let i = 1; i < protocol_buf.length - 1; ++i) {
                                    value += protocol_buf[i];
                                }

                                value &= 0xff;
                                if (protocol_buf[protocol_buf.length - 1] != value) {
                                    protocol_buf[2] = SENTRY_PROTOC_CHECK_ERROR;
                                }

                                if (readbuff.length - index > 1) {
                                    readbuff = readbuff.slice(index, readbuff.length - index);
                                } else {
                                    readbuff = pins.createBuffer(0);
                                }

                                return protocol_buf;
                            }
                            break;
                        default: break;
                    }

                    if (start_receive) {
                        protocol_buf.push(value);
                    }
                }

                timeout_t = timeout;
                if (readbuff.length) {
                    readbuff = pins.createBuffer(0);
                }

            }
            else {
                basic.pause(5);
                timeout_t -= 5;
            }

            if (timeout_t < 0) {
                return [0, 0, 0, SENTRY_PROTOC_TIMEOUT, 0, 0];
            }
        }
    }

    //% block
    //% blockHidden=true
    export function writepkg(pkg: number[]): boolean {
        if (pkg.length > 0) {
            let protocol_buf: number[] = [SENTRY_PROTOC_START, 4];
            protocol_buf[1] += pkg.length;

            let value = SENTRY_PROTOC_START + protocol_buf[1];

            for (let index = 0; index < pkg.length; ++index) {
                value += pkg[index];
                protocol_buf.push(pkg[index]);
            }

            value &= 0xff;
            protocol_buf.push(value);
            protocol_buf.push(SENTRY_PROTOC_END);

            let buff = pins.createBufferFromArray(protocol_buf)

            serial.writeBuffer(buff);
            return true;
        } else {
            return false;
        }
    }
}