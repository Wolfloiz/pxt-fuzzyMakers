declare const enum sengo_vision_e_1 {
    //% block="Blob"
    kVisionBlob = 2,
    //% block="AprilTag"
    kVisionAprilTag = 3,
    //% block="Aprendizagem"
    kVisionLearning = 5,
    //% block="Cartão"
    kVisionCard = 6,
    //% block="Rosto"
    kVisionFace = 7,
    //% block="20Classes"
    kVision20Classes = 8,
    //% block="Movimentação"
    kVisionMotionDetect = 11,
}

declare const enum sengo_vision_e_2 {
    //% block="Cor"
    kVisionColor = 1,
    //% block="Blob"
    kVisionBlob = 2
}

declare const enum sengo_vision_e_3 {
    //% block="Aprendizagem"
    kVisionLearning = 5,
    //% block="Rosto"
    kVisionFace = 7,
}

declare const enum sentry_led_color_e {
    //% block="desligado"
    kLedClose = 0,
    //% block="Vermelho"
    kLedRed = 1,
    //% block="Verde"
    kLedGreen = 2,
    //% block="Amarelo"
    kLedYellow = 3,
    //% block="Azul"
    kLedBlue = 4,
    //% block="Roxo"
    kLedPurple = 5,
    //% block="Ciano"
    kLedCyan = 6,
    //% block="Branco"
    kLedWhite = 7,
}

declare const enum sentry_camera_white_balance_e {
    //% block="Auto"
    kAutoWhiteBalance = 0,
    //% block="Travado"
    kLockWhiteBalance = 1,
    //% block="Luz Branca"
    kWhiteLight = 2,
    //% block="Luz Amarela"
    kYellowLight = 3,
    //% blockHidden=true
    //% block="Calibração"
    kWhiteBalanceCalibrating = 4,
}

declare const enum sentry_mode_e {
    //% block="Serial"
    kSerialMode = 0,
    //% block="I2C"
    kI2CMode = 1,
    //% blockHidden=true
    kUnknownMode,
}

declare const enum sengo2_status {
    //% block="Habilitar"
    Enable = 1,
    //% block="Desabilitar"
    Disable = 0,
}

declare const enum sentry_obj_info_e {
    //% block="estado"
    //% blockHidden=true
    kStatus = 0,
    //% block="coordenada X"
    kXValue = 1,
    //% block="coordenada Y"
    kYValue = 2,
    //% block="largura"
    kWidthValue = 3,
    //% block="altura"
    kHeightValue = 4,
    //% block="rótulo"
    kLabel = 5,
    //% block="valor do canal vermelho"
    //% blockHidden=true
    kRValue = 6,
    //% block="valor do canal verde"
    //% blockHidden=true
    kGValue = 7,
    //% block="valor do canal azul"
    //% blockHidden=true
    kBValue = 8,
}

declare const enum sentry_color_info_e {
    //% block="rótulo"
    kLabel = 5,
    //% block="valor do canal vermelho"
    kRValue = 6,
    //% block="valor do canal verde"
    kGValue = 7,
    //% block="valor do canal azul"
    kBValue = 8,
}

declare const enum sentry_Line_info_e {
    //% block="coordenada X do ponto final"
    kXValue = 1,
    //% block="coordenada Y do ponto final"
    kYValue,
    //% block="coordenada X do ponto inicial"
    kWidthValue,
    //% block="coordenada Y do ponto inicial"
    kHeightValue,
    //% block="ângulo de inclinação"
    kLabel,
}

declare const enum sentry_Custom_info_e {
    //% block="valor de retorno 1"
    kXValue = 1,
    //% block="valor de retorno 2"
    kYValue,
    //% block="valor de retorno 3"
    kWidthValue,
    //% block="valor de retorno 4"
    kHeightValue,
    //% block="valor de retorno 5"
    kLabel,
}

declare const enum sentry_qr_info_e {
    //% block="coordenada X"
    kXValue = 1,
    //% block="coordenada Y"
    kYValue,
    //% block="largura"
    kWidthValue,
    //% block="altura"
    kHeightValue,
}

declare const enum vison_id_op_e {
    //% block="salvar dados como"
    VisionIdSave = 100,
    //% block="excluir dados"
    VisionIdClear = 0,
}

declare const enum sengo2_addr_e {
    //% block="0x60"
    ADDR1 = 0x60,
    //% block="0x61"
    //% blockHidden=true
    ADDR2 = 0x61,
    //% block="0x62"
    //% blockHidden=true
    ADDR3 = 0x62,
    //% block="0x63"
    //% blockHidden=true
    ADDR4 = 0x63,
}

//% block="Sensor Câmera"color="#ff6600" weight=20 icon="\uf085"
//% advanced=true
namespace Camera {
    const SENTRY_OK = 0x00;

    //% shim=tosee_sentry::sengo2_Begin
    function sengo2_Begin(mode: number, addr: number, buad: number, user_serial: number): number {
        console.log("camera_Begin " + addr.toString());
        return 0;
    }

    //% shim=tosee_sentry::sengo2_LedSetColor
    function sengo2_LedSetColor(
        detected_color: number,
        undetected_color: number,
        leval: number
    ): number {
        console.log("camera_LedSetColor " + detected_color.toString());
        return 0;
    }

    //% shim=tosee_sentry::sengo2_CameraSetAwb
    function sengo2_CameraSetAwb(wb: number): number {
        console.log("camera_CameraSetAwb " + wb.toString());
        return 0;
    }

    //% shim=tosee_sentry::sengo2_SetParamNum
    function sengo2_SetParamNum(vision_type: number, max_num: number): number {
        console.log("camera_SetParamNum " + vision_type.toString());
        return 0;
    }

    //% shim=tosee_sentry::sengo2_VisionSetMode
    function sengo2_VisionSetMode(vision_type: number, mode: number): number {
        console.log("camera_VisionSetMode " + vision_type.toString());
        return 0;
    }

    //% shim=tosee_sentry::sengo2_SetParam
    function sengo2_SetParam(
        vision_type: number,
        param: Buffer,
        param_id: number = 1
    ): number {
        console.log("camera_SetParam " + param.toHex());
        return 0;
    }

    //% shim=tosee_sentry::sengo2_VisionSetStatus
    function sengo2_VisionSetStatus(
        status: number,
        vision_type: number
    ): number {
        console.log("camera_VisionSetStatus " + vision_type.toString());
        return 0;
    }

    //% shim=tosee_sentry::sengo2_GetValue
    function sengo2_GetValue(
        vision_type: number,
        object_info: number = 0,
        obj_id: number = 1
    ): number {
        console.log("camera_GetValue " + vision_type.toString());
        return 0;
    }

    //% shim=tosee_sentry::sengo2_GetQrCodeValue
    function sengo2_GetQrCodeValue(): string {
        console.log("camera_GetQrCodeValue ");
        return "";
    }

    /**
    * Inicia Câmera
    */
    //% blockId=Sentry_begin block="Inicializar Câmera - Porta %mode - Endereço %addr"
    //% mode.defl=sentry_mode_e.kI2CMode
    //% group="Configuração"
    //% weight=100
    export function Begin(mode: sentry_mode_e, addr: sengo2_addr_e) {
        while (sengo2_Begin(mode, addr, 9600, 0) != SENTRY_OK);
    }

    /**
     * Define a cor dos LEDs.
     * @param id ID da Câmera
     * @param led tipo de LED.
     * @param detected_color cor do LED quando o sensor detectar o alvo.
     * @param undetected_color cor do LED quando o sensor não detectar o alvo.
     */
    //% blockId=Sengo2_led_set_color block="Definir cor dos LEDs da Câmera para %detected_color|quando detectar alvo, senão %undetected_color com brilho (1-15) %leval"
    //% detected_color.defl=sentry_led_color_e.kLedBlue
    //% undetected_color.defl=sentry_led_color_e.kLedRed
    //% leval.min=0 leval.max=15 leval.defl=1
    //% weight=99 inlineInputMode=inline
    //% group="Configuração"
    export function LedSetColor(
        detected_color: sentry_led_color_e,
        undetected_color: sentry_led_color_e,
        leval: number = 1
    ) {
        while (
            sengo2_LedSetColor(detected_color, undetected_color, leval) != SENTRY_OK
        );
    }

    /**
    * Define o balanço de branco da câmera.
    * @param id ID do Sentry
    * @param wb tipo de balanço de branco.
    */
    //% blockId=Sentry_camera_set_awb block="Configurar balanço de branco da Câmera para %wb"
    //% weight=99 inlineInputMode=inline
    //% group="Configuração"
    //% blockHidden=true
    export function CameraSetAwb(wb: sentry_camera_white_balance_e) {
        while (sengo2_CameraSetAwb(wb) != SENTRY_OK);
    }

    /**
    * Ativa ou desativa uma função de visão da Câmera.
    */
    //% blockId=Sengo2_vision_Set block="%enable modo %vision_type"
    //% group="Configuração"
    //% weight=98
    export function VisionSetStatus(
        status: sengo2_status,
        vision_type: sengo_vision_e
    ) {
        while (sengo2_VisionSetStatus(status, vision_type) != SENTRY_OK);
    }

    /**
     * Define o número máximo de conjuntos de parâmetros para a visão.
     * @param vision_type tipo de visão.
     * @param max_num número máximo de conjuntos de parâmetros.
    */
    //% blockId=Sengo2_vision_SetParamNum block="Definir quantidade de configurações do modo %vision_type: %max_num"
    //% max_num.min=1 max_num.max=25 max_num.defl=1
    //% group="Configuração"
    //% weight=97
    export function SetParamNum(vision_type: sengo_vision_e_2, max_num: number) {
        while (sengo2_SetParamNum(<number>vision_type, max_num) != SENTRY_OK);
    }

    /**
     * Parâmetros de cor.
     * @param x coordenada X do centro da área de interesse (ROI).
     * @param y coordenada Y do centro da área de interesse (ROI).
     * @param w largura da área de interesse.
     * @param h altura da área de interesse.
    */
    //% blockId=Sengo2_vision_color_param block="Definir parâmetros do modo cor: Coord X: %x | Coord. Y %y |Largura %w | Altura %h | ID %obj_id"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% x.defl=50
    //% y.defl=50
    //% w.defl=3
    //% h.defl=4
    //% inlineInputMode=inline
    //% group="Configuração"
    //% weight=96
    export function SetColorParam(
        x: number,
        y: number,
        w: number,
        h: number,
        obj_id: number = 1
    ) {
        let prama = pins.createBuffer(10);
        prama.setNumber(NumberFormat.UInt16BE, 0, x);
        prama.setNumber(NumberFormat.UInt16BE, 2, y);
        prama.setNumber(NumberFormat.UInt16BE, 4, w);
        prama.setNumber(NumberFormat.UInt16BE, 6, h);

        while (
            sengo2_SetParam(sengo_vision_e.kVisionColor, prama, obj_id) != SENTRY_OK
        );
    }

    /**
     * Parâmetros de detecção de Blob.
     * @param w largura mínima a detectar.
     * @param h altura mínima a detectar.
     * @param l rótulo da cor a detectar.
    */
    //% blockId=Sengo2_vision_blob_param block="Definir parâmetros do modo blob: largura mínima %w | altura mínima %h | cor %l | ID %obj_id"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% w.defl=3
    //% h.defl=4
    //% l.defl=color_label_e.kColorRed
    //% inlineInputMode=inline
    //% group="Configuração"
    //% weight=95
    export function SetBlobParam(
        w: number,
        h: number,
        l: color_label_e,
        obj_id: number = 1
    ) {
        let prama = pins.createBuffer(10);

        prama.setNumber(NumberFormat.UInt16BE, 4, w);
        prama.setNumber(NumberFormat.UInt16BE, 6, h);
        prama.setNumber(NumberFormat.UInt16BE, 8, l);

        while (
            sengo2_SetParam(sengo_vision_e.kVisionBlob, prama, obj_id) != SENTRY_OK
        );
    }

    /**
     * Define o número máximo de Blobs por cor.
     * @param vision_type tipo de visão.
     * @param mode número máximo de blobs por cor (1–5).
     */
    //% blockId=Sengo2_vision_SetMaxBlobParam block="Definir número máximo de blobs por cor (1–5): %mode"
    //% mode.min=1 mode.max=5 mode.defl=1
    //% group="Configuração"
    //% weight=94
    export function SetMaxBlobParam(mode: number) {
        while (sengo2_VisionSetMode(<number>sengo_vision_e.kVisionBlob, mode) != SENTRY_OK);
    }

    /**
     * Define o número máximo de AprilTags a serem detectados.
     * @param vision_type tipo de visão.
     * @param mode número máximo de AprilTags (formato padrão).
    */
    //% blockId=Sengo2_vision_SetMaxAprilTagParam block="Definir formato de AprilTag: %mode tags"
    //% group="Configuração"
    //% weight=93
    export function SetMaxAprilTagParam(mode: apriltag_vision_mode_e) {
        while (sengo2_VisionSetMode(<number>sengo_vision_e.kVisionAprilTag, <number>mode) != SENTRY_OK);
    }

    /**
     * Define o número máximo de linhas a serem detectadas.
     * @param vision_type tipo de visão.
     * @param mode número máximo de linhas (1–5).
    */
    //% blockId=Sengo2_vision_SetMaxLineParam block="Definir número máximo de segmentos (1-5) no modo linha: %mode"
    //% mode.min=1 mode.max=5 mode.defl=1
    //% group="Configuração"
    //% weight=92
    export function SetMaxLineParam(mode: number) {
        while (sengo2_VisionSetMode(<number>sengo_vision_e.kVisionLine, mode) != SENTRY_OK);
    }

    /**
     * Define o ID para um tipo de visão específico (por exemplo, rosto ou objeto).
     * @param vision_type tipo de visão.
     * @param l rótulo ou categoria detectada.
     * @param face_id ID atribuído ao item detectado.
    */
    //% blockId=Sengo2_vision_id block="%l ID %face_id no modo %vision_type"
    //% face_id.min=1 face_id.max=10 face_id.defl=1
    //% inlineInputMode=inline
    //% group="Configuração"
    //% weight=91

    export function SetVisionIdParam(l: vison_id_op_e, face_id: number = 1, vision_type: sengo_vision_e_3) {
        let prama = pins.createBuffer(10);

        prama.setNumber(NumberFormat.UInt16BE, 8, l);

        while (
            sengo2_SetParam(<number>vision_type, prama, face_id) != SENTRY_OK
        );
    }
    /**
     * Obtém o número de resultados detectados pela visão.
     * @param vision_type tipo de visão.
    */
    //% blockId=Sengo_detected block="Resultados detectados no modo %vision_type" color="#2E8B57"
    //% group="Operações" advanced=false
    //% weight=94
    export function Detected(vision_type: sengo_vision_e): number {
        return sengo2_GetValue(<number>vision_type, 0, 1);
    }

    /**
     * Obtém o resultado do reconhecimento de cor da visão.
     * @param object_info tipo de informação desejada (posição, tamanho, etc.)
     * @param obj_id índice do objeto
    */
    //% blockId=Sengo2_get_color_value block="%objeto_info do resultado %obj_id do modo cor" color="#2E8B57"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Operações"
    //% weight=93
    export function ColorRcgValue(
        object_info: sentry_color_info_e,
        obj_id: number = 1
    ): number {
        return GetValue(
            <number>sengo_vision_e.kVisionColor,
            <number>object_info,
            obj_id
        );
    }

    /**
     * Obtém os dados do objeto detectado pela visão da Câmera. Esta função atualiza automaticamente as informações do objeto.
     * @param vision_type tipo de visão.
     * @param object_info informação desejada do objeto (posição, tamanho, ID, etc.).
     * @param obj_id índice do objeto.
     */
    //% blockId=Sengo2_get_value block="%object_info do resultado %id do modo %vision_type" color="#2E8B57"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Operações"
    //% weight=92
    export function GetValue(
        object_info: sentry_obj_info_e,
        obj_id: number = 1,
        vision_type: sengo_vision_e_1,
        
    ): number {
        return sengo2_GetValue(<number>vision_type, <number>object_info, obj_id);
    }

    /**
     * Obtém o resultado da detecção de linhas pela visão da Câmera.
     * @param object_info tipo de informação desejada (posição, ângulo, etc.).
     * @param obj_id índice do objeto (linha detectada).
     */
    //% blockId=Sengo2_get_Line_value block="%objeto_info do resultado %obj_id do modo linha" color="#2E8B57"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Operações"
    //% weight=91
    export function LineValue(
        object_info: sentry_Line_info_e,
        obj_id: number = 1
    ): number {
        return GetValue(
            <number>sengo_vision_e.kVisionLine,
            <number>object_info,
            obj_id
        );
    }

    /**
     * Obtém o resultado da leitura de QR Code pela visão da Câmera.
     * @param object_info tipo de informação desejada (dados, posição, etc.).
     * @param obj_id índice do QR Code detectado.
    */
    //% blockId=Sengo2_get_qr_value block="%objeto_info do resultado %obj_id do modo QR code" color="#2E8B57"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Operações"
    //% weight=90
    export function QrcodeValue(
        object_info: sentry_qr_info_e,
        obj_id: number = 1
    ): number {
        return GetValue(
            <number>object_info,
            obj_id,
            <number>sengo_vision_e.kVisionQrCode
        );
    }

    /**
     * Obtém o texto decodificado de um QR Code detectado pelo Câmera.
    */
    //% blockId=Sengo2_get_Qrcode_value_string block="Texto decodificado do QR Code" color="#2E8B57"
    //% inlineInputMode=inline
    //% expandableArgumentMode="enabled"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Operações"
    //% weight=89
    export function QrcodeValueString(): string {
        return sengo2_GetQrCodeValue();
    }

    /**
     * Verifica se uma determinada cor foi reconhecida.
     * @param lable rótulo da cor.
     * @param obj_id índice do objeto.
    */
    //% blockId=Sengo2_detected_color block="Cor %lable reconhecida do resultado %obj_id" color="#2E8B57"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Operações"
    //% weight=87
    export function DetectedColor(
        lable: color_label_e,
        obj_id: number = 1
    ): boolean {
        return (
            GetValue(
                <number>sengo_vision_e.kVisionColor,
                sentry_obj_info_e.kLabel,
                obj_id
            ) == lable
        );
    }

    /**
     * Verifica se uma Blob com o rótulo especificado foi detectada.
     * @param lable rótulo da Blob.
     * @param obj_id índice do objeto.
    */
    //% blockId=Sengo2_detected_blob block="Blob %lable detectado do resultado %obj_id" color="#2E8B57"
    //% lable.defl=color_label_e.kColorRed
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Operações"
    //% weight=86
    export function DetectedBlob(
        lable: color_label_e,
        obj_id: number = 1
    ): boolean {
        return (
            GetValue(
                sentry_obj_info_e.kLabel,
                obj_id,
                sengo_vision_e_1.kVisionBlob
            ) == lable
        );
    }

    /**
     * Verifica se um cartão com o rótulo especificado foi reconhecido.
     * @param lable rótulo do cartão.
     * @param obj_id índice do objeto.
    */
    //% blockId=Sengo2_detected_card block="Cartão %lable detectado do resultado %obj_id" color="#2E8B57"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Operações"
    //% weight=85
    export function DetectedCard(
        lable: card_label_e,
        obj_id: number = 1
    ): boolean {
        return (
            GetValue(
                sentry_obj_info_e.kLabel,
                obj_id,
                sengo_vision_e_1.kVisionCard
            ) == lable
        );
    }

    /**
     * Verifica se uma classe do tipo 20Class com o rótulo especificado foi reconhecida.
     * @param lable rótulo da classe.
     * @param obj_id índice do objeto.
    */
    //% blockId=Sentry_detected_class20 block="Classe %lable detectada do resultado %obj_id" color="#2E8B57"
    //% obj_id.min=1 obj_id.max=25 obj_id.defl=1
    //% group="Operações"
    //% weight=84
    export function Detected20Class(
        lable: class20_label_e,
        obj_id: number = 1
    ): boolean {
        return (
            GetValue(
                sentry_obj_info_e.kLabel,
                obj_id,
                sengo_vision_e_1.kVision20Classes,
            ) == lable
        );
    }
}