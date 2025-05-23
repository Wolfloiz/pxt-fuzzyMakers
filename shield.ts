
enum PingUnit {
    //% block="μs"
    MicroSeconds,
    //% block="cm"
    Centimeters,
    //% block="polegadas"
    Inches
}

// emum for c33 IR Receiver

const enum IrButtonAction {
    //% block="pressionado"
    Pressed = 0,
    //% block="não pressionado"
    Released = 1,
}


/**
 * Blocos para algus bits que são utilizado apenas para a shield
 */

//% weight=10 color=#00BC9D icon="\uf295" block="Placa de expansão"

namespace shield {


    // ******** Ultrasonic ******************************** //

    /**
     * Envia um sinal de ultrassom (ping) e retorna o tempo de resposta (em microssegundos),
     * que pode ser usado para calcular a distância até um objeto.
     * @param trig pino conectado ao sinal de disparo do sensor
     * @param echo pino conectado ao sinal de recepção do sensor
     * @param unit unidade desejada para o resultado da distância (ex: cm, polegadas)
     * @param maxCmDistance distância máxima em centímetros (padrão é 500)
    */
    //% subcategory="Sensor Ultrassônico"
    //% color=#7C965A
    //% blockId=ultrasonic_ping
    //% block="Enviar pulso no pino de disparo %trig|receber sinal no pino de eco %echo|medir distância em %unit"
    //% weight=30
    export function ping(trig: DigitalPin, echo: DigitalPin, unit: PingUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case PingUnit.Centimeters: return Math.round((d / 58) * 10) / 10;
            case PingUnit.Inches: return Math.round((d / 148) * 10) / 10;
            default: return d;
        }
    }



    // ******** Receptor infravermelho *************************** //

    let irState: IrState;

    const MICROBIT_IR_NEC = 777;
    const MICROBIT_IR_DATAGRAM = 778;
    const MICROBIT_IR_BUTTON_PRESSED_ID = 789;
    const MICROBIT_IR_BUTTON_RELEASED_ID = 790;
    const IR_REPEAT = 256;
    const IR_INCOMPLETE = 257;
    const IR_DATAGRAM = 258;

    interface IrState {
        hasNewDatagram: boolean;
        bitsReceived: uint8;
        addressSectionBits: uint16;
        commandSectionBits: uint16;
        hiword: uint16;
        loword: uint16;
    }

    //******** Functions ********************************************//
    function appendBitToDatagram(bit: number): number {
        irState.bitsReceived += 1;

        if (irState.bitsReceived <= 8) {
            irState.hiword = (irState.hiword << 1) + bit;
        } else if (irState.bitsReceived <= 16) {
            irState.hiword = (irState.hiword << 1) + bit;
        } else if (irState.bitsReceived <= 32) {
            irState.loword = (irState.loword << 1) + bit;
        }

        if (irState.bitsReceived === 32) {
            irState.addressSectionBits = irState.hiword & 0xffff;
            irState.commandSectionBits = irState.loword & 0xffff;
            return IR_DATAGRAM;
        } else {
            return IR_INCOMPLETE;
        }
    }

    function decode(markAndSpace: number): number {
        if (markAndSpace < 1600) {
            // low bit
            return appendBitToDatagram(0);
        } else if (markAndSpace < 2700) {
            // high bit
            return appendBitToDatagram(1);
        }

        irState.bitsReceived = 0;

        if (markAndSpace < 12500) {
            // Repeat detected
            return IR_REPEAT;
        } else if (markAndSpace < 14500) {
            // Start detected
            return IR_INCOMPLETE;
        } else {
            return IR_INCOMPLETE;
        }
    }

    function enableIrMarkSpaceDetection(pin: DigitalPin) {
        pins.setPull(pin, PinPullMode.PullNone);

        let mark = 0;
        let space = 0;

        pins.onPulsed(pin, PulseValue.Low, () => {
            // HIGH, see https://github.com/microsoft/pxt-microbit/issues/1416
            mark = pins.pulseDuration();
        });

        pins.onPulsed(pin, PulseValue.High, () => {
            // LOW
            space = pins.pulseDuration();
            const status = decode(mark + space);

            if (status !== IR_INCOMPLETE) {
                control.raiseEvent(MICROBIT_IR_NEC, status);
            }
        });
    }

    // ******** Blocos do Receptor Infravermelho C33  *************************** //

    /**
 * Conecta-se ao módulo receptor de infravermelho no pino especificado.
 * @param pin pino onde o receptor IR está conectado, por exemplo: DigitalPin.P0
 */
    //% subcategory="Receptor Infravermelho"
    //% group="Receptor Infravermelho"
    //% color=#884898
    //% blockId="infrared_connect_receiver"
    //% block="Conectar receptor infravemrelho no pino %pin"
    //% pin.fieldEditor="gridpicker"
    //% pin.fieldOptions.columns=4
    //% pin.fieldOptions.tooltips=0
    //% weight=190
    export function connectIrReceiver(
        pin: DigitalPin,
    ): void {
        if (irState) {
            return;
        }

        irState = {
            bitsReceived: 0,
            hasNewDatagram: false,
            addressSectionBits: 0,
            commandSectionBits: 0,
            hiword: 0, // TODO replace with uint32
            loword: 0,
        };

        enableIrMarkSpaceDetection(pin);

        let activeCommand = -1;
        let repeatTimeout = 0;
        const REPEAT_TIMEOUT_MS = 120;

        control.onEvent(
            MICROBIT_IR_NEC,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                const irEvent = control.eventValue();

                // Refresh repeat timer
                if (irEvent === IR_DATAGRAM || irEvent === IR_REPEAT) {
                    repeatTimeout = input.runningTime() + REPEAT_TIMEOUT_MS;
                }

                if (irEvent === IR_DATAGRAM) {
                    irState.hasNewDatagram = true;
                    control.raiseEvent(MICROBIT_IR_DATAGRAM, 0);

                    const newCommand = irState.commandSectionBits >> 8;

                    // Process a new command
                    if (newCommand !== activeCommand) {
                        if (activeCommand >= 0) {
                            control.raiseEvent(
                                MICROBIT_IR_BUTTON_RELEASED_ID,
                                activeCommand
                            );
                        }

                        activeCommand = newCommand;
                        control.raiseEvent(
                            MICROBIT_IR_BUTTON_PRESSED_ID,
                            newCommand
                        );
                    }
                }
            }
        );

        control.inBackground(() => {
            while (true) {
                if (activeCommand === -1) {
                    // sleep to save CPU cylces
                    basic.pause(2 * REPEAT_TIMEOUT_MS);
                } else {
                    const now = input.runningTime();
                    if (now > repeatTimeout) {
                        // repeat timed out
                        control.raiseEvent(
                            MICROBIT_IR_BUTTON_RELEASED_ID,
                            activeCommand
                        );
                        activeCommand = -1;
                    } else {
                        basic.pause(REPEAT_TIMEOUT_MS);
                    }
                }
            }
        });
    }

    // ******** [GRUPO] Receptor Infravermelho C33 ********************************* //

    /**
     * Executa uma ação quando um sinal IR for recebido.
     * @param handler código que será executado quando o sinal for detectado
     */
    //% subcategory="Receptor Infravermelho"
    //% group="Receptor Infravermelho"
    //% color=#884898
    //% blockId=infrared_on_ir_datagram
    //% block="Ao receber sinal IR"
    //% weight=200
    export function onIrDatagram(handler: () => void) {
        control.onEvent(
            MICROBIT_IR_DATAGRAM,
            EventBusValue.MICROBIT_EVT_ANY,
            () => {
                handler();
            }
        );
    }

    /**
     * Retorna o sinal IR recebido como uma sequência hexadecimal de 32 bits.
     * Caso nenhum dado tenha sido recebido ainda, retorna "0x00000000".
    */
    //% subcategory="Receptor Infravermelho"
    //% group="Receptor Infravermelho"
    //% color=#884898
    //% blockId=infrared_ir_datagram
    //% block="Datagrama do sensor infravermelho"
    //% weight=130
    export function irDatagram(): string {
        if (!irState) {
            return "0x00000000";
        }
        return (
            "0x" +
            ir_rec_to16BitHex(irState.addressSectionBits) +
            ir_rec_to16BitHex(irState.commandSectionBits)
        );
    }

    /**
  * Retorna verdadeiro se algum dado IR foi recebido desde a última vez que esta função foi chamada.
  * Caso contrário, retorna falso.
  */
    //% subcategory="Receptor Infravermelho"
    //% group="Receptor Infravermelho"
    //% color=#884898
    //% blockId=infrared_was_any_ir_datagram_received
    //% block="Dados do sensor infravermelho foram recebidos"
    //% weight=190
    export function wasIrDataReceived(): boolean {
        if (!irState) {
            return false;
        }
        if (irState.hasNewDatagram) {
            irState.hasNewDatagram = false;
            return true;
        } else {
            return false;
        }
    }

    // ******** [Group] Controller *************************************** //
    /**
     * Executa uma ação quando um botão específico do controle remoto infravermelho for pressionado ou solto.
     * @param button o botão do controle a ser verificado
     * @param action a ação que dispara o evento (pressionar ou soltar)
     * @param handler o código que será executado quando o evento ocorrer
    */
    //% subcategory="Receptor Infravermelho"
    //% group="Controle"
    //% color=#884898
    //% blockId=infrared_on_ir_button
    //% block="Ao pressionar botão IR | %button | %action"
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% weight=200
    export function onIrButton(
        button: IrButton,
        action: IrButtonAction,
        handler: () => void
    ) {
        control.onEvent(
            action === IrButtonAction.Pressed
                ? MICROBIT_IR_BUTTON_PRESSED_ID
                : MICROBIT_IR_BUTTON_RELEASED_ID,
            button === IrButton.Any ? EventBusValue.MICROBIT_EVT_ANY : button,
            () => {
                handler();
            }
        );
    }

    /**
     * Retorna o código do último botão do controle IR que foi pressionado.
     * Se nenhum botão tiver sido pressionado, retorna -1 (IrButton.Any).
    */
    //% subcategory="Receptor Infravermelho"
    //% group="Controle"
    //% color=#884898
    //% blockId=infrared_ir_button_pressed
    //% block="Botão IR pressionado"
    //% weight=150
    export function irButton(): number {
        if (!irState) {
            return IrButton.Any;
        }
        return irState.commandSectionBits >> 8;
    }

    /**
     * Retorna o código do comando correspondente a um botão específico do controle IR.
     * @param button o botão escolhido
    */
    //% subcategory="Receptor Infravermelho"
    //% group="Controle"
    //% color=#884898
    //% blockId=infrared_button_code
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% block="Código do botão infravermelho %button"
    //% weight=140
    export function irButtonCode(button: IrButton): number {
        return button as number;
    }

    function ir_rec_to16BitHex(value: number): string {
        let hex = "";
        for (let pos = 0; pos < 4; pos++) {
            let remainder = value % 16;
            if (remainder < 10) {
                hex = remainder.toString() + hex;
            } else {
                hex = String.fromCharCode(55 + remainder) + hex;
            }
            value = Math.idiv(value, 16);
        }
        return hex;
    }




    // ******** [Subcategory] OLED *************************** //

    // ******** blocos para tela OLED ***************** //

    let font: Buffer;

    const SSD1306_SETCONTRAST = 0x81
    const SSD1306_SETCOLUMNADRESS = 0x21
    const SSD1306_SETPAGEADRESS = 0x22
    const SSD1306_DISPLAYALLON_RESUME = 0xA4
    const SSD1306_DISPLAYALLON = 0xA5
    const SSD1306_NORMALDISPLAY = 0xA6
    const SSD1306_INVERTDISPLAY = 0xA7
    const SSD1306_DISPLAYOFF = 0xAE
    const SSD1306_DISPLAYON = 0xAF
    const SSD1306_SETDISPLAYOFFSET = 0xD3
    const SSD1306_SETCOMPINS = 0xDA
    const SSD1306_SETVCOMDETECT = 0xDB
    const SSD1306_SETDISPLAYCLOCKDIV = 0xD5
    const SSD1306_SETPRECHARGE = 0xD9
    const SSD1306_SETMULTIPLEX = 0xA8
    const SSD1306_SETLOWCOLUMN = 0x00
    const SSD1306_SETHIGHCOLUMN = 0x10
    const SSD1306_SETSTARTLINE = 0x40
    const SSD1306_MEMORYMODE = 0x20
    const SSD1306_COMSCANINC = 0xC0
    const SSD1306_COMSCANDEC = 0xC8
    const SSD1306_SEGREMAP = 0xA0
    const SSD1306_CHARGEPUMP = 0x8D
    const chipAdress = 0x3C
    const xOffset = 0
    const yOffset = 0
    let charX = 0
    let charY = 0
    let displayWidth = 128
    let displayHeight = 64 / 8
    let screenSize = 0
    //let font: Array<Array<number>>
    let loadStarted: boolean;
    let loadPercent: number;
    function command(cmd: number) {
        let buf = pins.createBuffer(2)
        buf[0] = 0x00
        buf[1] = cmd
        pins.i2cWriteBuffer(chipAdress, buf, false)
    }
    //% subcategory="Tela OLED"
    //% block="Limpar display OLED"
    //% color=#33A1C9
    //% weight=83
    export function clear() {
        loadStarted = false
        loadPercent = 0
        command(SSD1306_SETCOLUMNADRESS)
        command(0x00)
        command(displayWidth - 1)
        command(SSD1306_SETPAGEADRESS)
        command(0x00)
        command(displayHeight - 1)
        let data = pins.createBuffer(17);
        data[0] = 0x40; // Data Mode
        for (let i = 1; i < 17; i++) {
            data[i] = 0x00
        }
        // send display buffer in 16 byte chunks
        for (let i = 0; i < screenSize; i += 16) {
            pins.i2cWriteBuffer(chipAdress, data, false)
        }
        charX = xOffset
        charY = yOffset
    }

    function drawLoadingFrame() {
        command(SSD1306_SETCOLUMNADRESS)
        command(0x00)
        command(displayWidth - 1)
        command(SSD1306_SETPAGEADRESS)
        command(0x00)
        command(displayHeight - 1)
        let col = 0
        let page = 0
        let data = pins.createBuffer(17);
        data[0] = 0x40; // Data Mode
        let i = 1
        for (let page = 0; page < displayHeight; page++) {
            for (let col = 0; col < displayWidth; col++) {
                if (page === 3 && col > 12 && col < displayWidth - 12) {
                    data[i] = 0x60
                } else if (page === 5 && col > 12 && col < displayWidth - 12) {
                    data[i] = 0x06
                } else if (page === 4 && (col === 12 || col === 13 || col === displayWidth - 12 || col === displayWidth - 13)) {
                    data[i] = 0xFF
                } else {
                    data[i] = 0x00
                }
                if (i === 16) {
                    pins.i2cWriteBuffer(chipAdress, data, false)
                    i = 1
                } else {
                    i++
                }

            }
        }
        charX = 30
        charY = 2
        writeString("Loading:")
    }
    function drawLoadingBar(percent: number) {
        charX = 78
        charY = 2
        let num = Math.floor(percent)
        writeNum(num)
        writeString("%")
        let width = displayWidth - 14 - 13
        let lastStart = width * (loadPercent / displayWidth)
        command(SSD1306_SETCOLUMNADRESS)
        command(14 + lastStart)
        command(displayWidth - 13)
        command(SSD1306_SETPAGEADRESS)
        command(4)
        command(5)
        let data = pins.createBuffer(2);
        data[0] = 0x40; // Data Mode
        data[1] = 0x7E
        for (let i = lastStart; i < width * (Math.floor(percent) / 100); i++) {
            pins.i2cWriteBuffer(chipAdress, data, false)
        }
        loadPercent = num
    }

    //% subcategory="Tela OLED"
    //% block="Desenhar barra de carregamento com $percent por cento"
    //% percent.min=0 percent.max=100
    //% color=#33A1C9
    //% weight=82
    export function drawLoading(percent: number) {
        if (loadStarted) {
            drawLoadingBar(percent)
        } else {
            drawLoadingFrame()
            drawLoadingBar(percent)
            loadStarted = true
        }
    }

    /**
     * Exibe uma string no display OLED sem adicionar uma quebra de linha ao final.
     * @param str string a ser exibida
     */
    //% subcategory="Tela OLED"
    //% block="Mostrar string (sem nova linha): $str"
    //% color=#33A1C9
    //% weight=86
    export function writeString(str: string) {
        for (let i = 0; i < str.length; i++) {
            if (charX > displayWidth - 6) {
                newLine()
            }
            drawChar(charX, charY, str.charAt(i))
            charX += 6
        }
    }

    //% subcategory="Tela OLED"
    //% block="Mostrar número (sem nova linha): $n"
    //% color=#33A1C9
    //% weight=85
    export function writeNum(n: number) {
        let numString = n.toString()
        writeString(numString)
    }

    //% subcategory="Tela OLED"
    //% block="Mostrar string $str"
    //% color=#33A1C9
    //% weight=88
    export function writeStringNewLine(str: string) {
        writeString(str)
        newLine()
    }

    //% subcategory="Tela OLED"
    //% block="Mostrar número $n"
    //% color=#33A1C9
    //% weight=87
    export function writeNumNewLine(n: number) {
        writeNum(n)
        newLine()
    }

    //% subcategory="Tela OLED"
    //% block="Inserir nova linha"
    //% color=#33A1C9
    //% weight=84
    export function newLine() {
        charY++
        charX = xOffset
    }
    function drawChar(x: number, y: number, c: string) {
        command(SSD1306_SETCOLUMNADRESS)
        command(x)
        command(x + 5)
        command(SSD1306_SETPAGEADRESS)
        command(y)
        command(y + 1)
        let line = pins.createBuffer(2)
        line[0] = 0x40
        for (let i = 0; i < 6; i++) {
            if (i === 5) {
                line[1] = 0x00
            } else {
                let charIndex = c.charCodeAt(0)
                let charNumber = font.getNumber(NumberFormat.UInt8BE, 5 * charIndex + i)
                line[1] = charNumber

            }
            pins.i2cWriteBuffer(chipAdress, line, false)
        }

    }
    function drawShape(pixels: Array<Array<number>>) {
        let x1 = displayWidth
        let y1 = displayHeight * 8
        let x2 = 0
        let y2 = 0
        for (let i = 0; i < pixels.length; i++) {
            if (pixels[i][0] < x1) {
                x1 = pixels[i][0]
            }
            if (pixels[i][0] > x2) {
                x2 = pixels[i][0]
            }
            if (pixels[i][1] < y1) {
                y1 = pixels[i][1]
            }
            if (pixels[i][1] > y2) {
                y2 = pixels[i][1]
            }
        }
        let page1 = Math.floor(y1 / 8)
        let page2 = Math.floor(y2 / 8)
        let line = pins.createBuffer(2)
        line[0] = 0x40
        for (let x = x1; x <= x2; x++) {
            for (let page = page1; page <= page2; page++) {
                line[1] = 0x00
                for (let i = 0; i < pixels.length; i++) {
                    if (pixels[i][0] === x) {
                        if (Math.floor(pixels[i][1] / 8) === page) {
                            line[1] |= Math.pow(2, (pixels[i][1] % 8))
                        }
                    }
                }
                if (line[1] !== 0x00) {
                    command(SSD1306_SETCOLUMNADRESS)
                    command(x)
                    command(x + 1)
                    command(SSD1306_SETPAGEADRESS)
                    command(page)
                    command(page + 1)
                    //line[1] |= pins.i2cReadBuffer(chipAdress, 2)[1]
                    pins.i2cWriteBuffer(chipAdress, line, false)
                }
            }
        }
    }
    /**
     * Desenha uma linha na tela OLED de um ponto inicial até um ponto final.
     * @param x0 coordenada X do ponto inicial
     * @param y0 coordenada Y do ponto inicial
     * @param x1 coordenada X do ponto final
     * @param y1 coordenada Y do ponto final
     */
    //% subcategory="Tela OLED"
    //% block="Desenhar linha de:|x: $x0 y: $y0 até|x: $x1 y: $y1"
    //% x0.defl=0
    //% y0.defl=0
    //% x1.defl=20
    //% y1.defl=20
    ///% color=#33A1C9
    //% weight=81
    export function drawLine(x0: number, y0: number, x1: number, y1: number) {
        let pixels: Array<Array<number>> = []
        let kx: number, ky: number, c: number, i: number, xx: number, yy: number, dx: number, dy: number;
        let targetX = x1
        let targetY = y1
        x1 -= x0; kx = 0; if (x1 > 0) kx = +1; if (x1 < 0) { kx = -1; x1 = -x1; } x1++;
        y1 -= y0; ky = 0; if (y1 > 0) ky = +1; if (y1 < 0) { ky = -1; y1 = -y1; } y1++;
        if (x1 >= y1) {
            c = x1
            for (i = 0; i < x1; i++, x0 += kx) {
                pixels.push([x0, y0])
                c -= y1; if (c <= 0) { if (i != x1 - 1) pixels.push([x0 + kx, y0]); c += x1; y0 += ky; if (i != x1 - 1) pixels.push([x0, y0]); }
                if (pixels.length > 20) {
                    drawShape(pixels)
                    pixels = []
                    drawLine(x0, y0, targetX, targetY)
                    return
                }
            }
        } else {
            c = y1
            for (i = 0; i < y1; i++, y0 += ky) {
                pixels.push([x0, y0])
                c -= x1; if (c <= 0) { if (i != y1 - 1) pixels.push([x0, y0 + ky]); c += y1; x0 += kx; if (i != y1 - 1) pixels.push([x0, y0]); }
                if (pixels.length > 20) {
                    drawShape(pixels)
                    pixels = []
                    drawLine(x0, y0, targetX, targetY)
                    return
                }
            }
        }
        drawShape(pixels)
    }
    /**
     * Desenha um retângulo na tela OLED, com base nas coordenadas dos cantos opostos.
     * @param x0 coordenada X do canto inicial
     * @param y0 coordenada Y do canto inicial
     * @param x1 coordenada X do canto final
     * @param y1 coordenada Y do canto final
     */
    //% subcategory="Tela OLED"
    //% block="Desenhar retângulo de:|x: $x0 y: $y0 até|x: $x1 y: $y1"
    //% x0.defl=0
    //% y0.defl=0
    //% x1.defl=20
    //% y1.defl=20
    //% color=#33A1C9
    //% weight=80
    export function drawRectangle(x0: number, y0: number, x1: number, y1: number) {
        drawLine(x0, y0, x1, y0)
        drawLine(x0, y1, x1, y1)
        drawLine(x0, y0, x0, y1)
        drawLine(x1, y0, x1, y1)
    }
    /**
     * Inicializa a tela OLED com a largura e altura especificadas.
     * Use esta função antes de exibir qualquer conteúdo na tela.
     * @param width largura da tela em pixels (padrão: 128)
     * @param height altura da tela em pixels (padrão: 64)
     */
    //% subcategory="Tela OLED"
    //% block="Inicializar OLED com largura $width e altura $height"
    //% width.defl=128
    //% height.defl=64
    //% color=#33A1C9
    //% weight=89
    export function init(width: number, height: number) {
        command(SSD1306_DISPLAYOFF);
        command(SSD1306_SETDISPLAYCLOCKDIV);
        command(0x80);                                  // the suggested ratio 0x80
        command(SSD1306_SETMULTIPLEX);
        command(0x3F);
        command(SSD1306_SETDISPLAYOFFSET);
        command(0x0);                                   // no offset
        command(SSD1306_SETSTARTLINE | 0x0);            // line #0
        command(SSD1306_CHARGEPUMP);
        command(0x14);
        command(SSD1306_MEMORYMODE);
        command(0x00);                                  // 0x0 act like ks0108
        command(SSD1306_SEGREMAP | 0x1);
        command(SSD1306_COMSCANDEC);
        command(SSD1306_SETCOMPINS);
        command(0x12);
        command(SSD1306_SETCONTRAST);
        command(0xCF);
        command(SSD1306_SETPRECHARGE);
        command(0xF1);
        command(SSD1306_SETVCOMDETECT);
        command(0x40);
        command(SSD1306_DISPLAYALLON_RESUME);
        command(SSD1306_NORMALDISPLAY);
        command(SSD1306_DISPLAYON);
        displayWidth = width
        displayHeight = height / 8
        screenSize = displayWidth * displayHeight
        charX = xOffset
        charY = yOffset
        font = hex`
    0000000000
    3E5B4F5B3E
    3E6B4F6B3E
    1C3E7C3E1C
    183C7E3C18
    1C577D571C
    1C5E7F5E1C
    00183C1800
    FFE7C3E7FF
    0018241800
    FFE7DBE7FF
    30483A060E
    2629792926
    407F050507
    407F05253F
    5A3CE73C5A
    7F3E1C1C08
    081C1C3E7F
    14227F2214
    5F5F005F5F
    06097F017F
    006689956A
    6060606060
    94A2FFA294
    08047E0408
    10207E2010
    08082A1C08
    081C2A0808
    1E10101010
    0C1E0C1E0C
    30383E3830
    060E3E0E06
    0000000000
    00005F0000
    0007000700
    147F147F14
    242A7F2A12
    2313086462
    3649562050
    0008070300
    001C224100
    0041221C00
    2A1C7F1C2A
    08083E0808
    0080703000
    0808080808
    0000606000
    2010080402
    3E5149453E
    00427F4000
    7249494946
    2141494D33
    1814127F10
    2745454539
    3C4A494931
    4121110907
    3649494936
    464949291E
    0000140000
    0040340000
    0008142241
    1414141414
    0041221408
    0201590906
    3E415D594E
    7C1211127C
    7F49494936
    3E41414122
    7F4141413E
    7F49494941
    7F09090901
    3E41415173
    7F0808087F
    00417F4100
    2040413F01
    7F08142241
    7F40404040
    7F021C027F
    7F0408107F
    3E4141413E
    7F09090906
    3E4151215E
    7F09192946
    2649494932
    03017F0103
    3F4040403F
    1F2040201F
    3F4038403F
    6314081463
    0304780403
    6159494D43
    007F414141
    0204081020
    004141417F
    0402010204
    4040404040
    0003070800
    2054547840
    7F28444438
    3844444428
    384444287F
    3854545418
    00087E0902
    18A4A49C78
    7F08040478
    00447D4000
    2040403D00
    7F10284400
    00417F4000
    7C04780478
    7C08040478
    3844444438
    FC18242418
    18242418FC
    7C08040408
    4854545424
    04043F4424
    3C4040207C
    1C2040201C
    3C4030403C
    4428102844
    4C9090907C
    4464544C44
    0008364100
    0000770000
    0041360800
    0201020402
    3C2623263C
    1EA1A16112
    3A4040207A
    3854545559
    2155557941
    2154547841
    2155547840
    2054557940
    0C1E527212
    3955555559
    3954545459
    3955545458
    0000457C41
    0002457D42
    0001457C40
    F0292429F0
    F0282528F0
    7C54554500
    2054547C54
    7C0A097F49
    3249494932
    3248484832
    324A484830
    3A4141217A
    3A42402078
    009DA0A07D
    3944444439
    3D4040403D
    3C24FF2424
    487E494366
    2B2FFC2F2B
    FF0929F620
    C0887E0903
    2054547941
    0000447D41
    3048484A32
    384040227A
    007A0A0A72
    7D0D19317D
    2629292F28
    2629292926
    30484D4020
    3808080808
    0808080838
    2F10C8ACBA
    2F102834FA
    00007B0000
    08142A1422
    22142A1408
    AA005500AA
    AA55AA55AA
    000000FF00
    101010FF00
    141414FF00
    1010FF00FF
    1010F010F0
    141414FC00
    1414F700FF
    0000FF00FF
    1414F404FC
    141417101F
    10101F101F
    1414141F00
    101010F000
    0000001F10
    1010101F10
    101010F010
    000000FF10
    1010101010
    101010FF10
    000000FF14
    0000FF00FF
    00001F1017
    0000FC04F4
    1414171017
    1414F404F4
    0000FF00F7
    1414141414
    1414F700F7
    1414141714
    10101F101F
    141414F414
    1010F010F0
    00001F101F
    0000001F14
    000000FC14
    0000F010F0
    1010FF10FF
    141414FF14
    1010101F00
    000000F010
    FFFFFFFFFF
    F0F0F0F0F0
    FFFFFF0000
    000000FFFF
    0F0F0F0F0F
    3844443844
    7C2A2A3E14
    7E02020606
    027E027E02
    6355494163
    3844443C04
    407E201E20
    06027E0202
    99A5E7A599
    1C2A492A1C
    4C7201724C
    304A4D4D30
    3048784830
    BC625A463D
    3E49494900
    7E0101017E
    2A2A2A2A2A
    44445F4444
    40514A4440
    40444A5140
    0000FF0103
    E080FF0000
    08086B6B08
    3612362436
    060F090F06
    0000181800
    0000101000
    3040FF0101
    001F01011E
    00191D1712
    003C3C3C3C
    0000000000`
        loadStarted = false
        loadPercent = 0
        clear()
    }




    // ******** [Subcategory] 4 Digit Tube *************************** //

    // ******** block for c82 4-digit tube TM1637 ************************ //

    let TM1637_CMD1 = 0x40;
    let TM1637_CMD2 = 0xC0;
    let TM1637_CMD3 = 0x80;
    let _SEGMENTS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];

    /**
     * TM1637 LED display
     */
    export class TM1637LEDs {
        buf: Buffer;
        clk: DigitalPin;
        dio: DigitalPin;
        _ON: number;
        brightness: number;
        count: number;  // number of LEDs

        /**
         * initial TM1637
         */
        init(): void {
            pins.digitalWritePin(this.clk, 0);
            pins.digitalWritePin(this.dio, 0);
            this._ON = 8;
            this.buf = pins.createBuffer(this.count);
            this.tmclear();
        }

        /**
         * Start 
         */
        _start() {
            pins.digitalWritePin(this.dio, 0);
            pins.digitalWritePin(this.clk, 0);
        }

        /**
         * Stop
         */
        _stop() {
            pins.digitalWritePin(this.dio, 0);
            pins.digitalWritePin(this.clk, 1);
            pins.digitalWritePin(this.dio, 1);
        }

        /**
         * send command1
         */
        _write_data_cmd() {
            this._start();
            this._write_byte(TM1637_CMD1);
            this._stop();
        }

        /**
         * send command3
         */
        _write_dsp_ctrl() {
            this._start();
            this._write_byte(TM1637_CMD3 | this._ON | this.brightness);
            this._stop();
        }

        /**
         * send a byte to 2-wire interface
         */
        _write_byte(b: number) {
            for (let i = 0; i < 8; i++) {
                pins.digitalWritePin(this.dio, (b >> i) & 1);
                pins.digitalWritePin(this.clk, 1);
                pins.digitalWritePin(this.clk, 0);
            }
            pins.digitalWritePin(this.clk, 1);
            pins.digitalWritePin(this.clk, 0);
        }

        /**
         * Define o brilho do display TM1637. O valor pode variar de 0 a 8, sendo 0 desligado.
         * @param val o nível de brilho do TM1637, por exemplo: 7
        */
        //% subcategory="Display de digitos"
        //% color=#FFA300 
        //% blockId="TM1637_set_intensity" block="%tm|definir brilho %val"
        //% weight=50 blockGap=8
        //% parts="TM1637"
        intensity(val: number = 7) {
            if (val < 1) {
                this.off();
                return;
            }
            if (val > 8) val = 8;
            this._ON = 8;
            this.brightness = val - 1;
            this._write_data_cmd();
            this._write_dsp_ctrl();
        }

        /**
         * set data to TM1637, with given bit
         */
        _dat(bit: number, dat: number) {
            this._write_data_cmd();
            this._start();
            this._write_byte(TM1637_CMD2 | (bit % this.count))
            this._write_byte(dat);
            this._stop();
            this._write_dsp_ctrl();
        }

        /**
         * Mostra um número em uma posição específica do display TM1637.
         * @param num o número que será exibido, por exemplo: 5
         * @param bit a posição no display (de 0 a 3), por exemplo: 0
        */
        //% subcategory="Display de digitos"
        //% color=#FFA300
        //% blockId="TM1637_showbit" block="%tm|mostrar dígito %num |na posição %bit"
        //% weight=90 blockGap=8
        //% parts="TM1637"
        showbit(num: number = 5, bit: number = 0) {
            this.buf[bit % this.count] = _SEGMENTS[num % 16]
            this._dat(bit, _SEGMENTS[num % 16])
        }

        /**
         * Mostra um número completo no display de 7 segmentos TM1637.
         * @param num o número que será exibido, por exemplo: 0
        */
        //% subcategory="Display de digitos"
        //% color=#FFA300
        //% blockId="TM1637_shownum" block="%tm|exibir número %num"
        //% weight=91 blockGap=8
        //% parts="TM1637"
        showNumber(num: number) {
            if (num < 0) {
                this._dat(0, 0x40) // '-'
                num = -num
            }
            else
                this.showbit(Math.idiv(num, 1000) % 10)
            this.showbit(num % 10, 3)
            this.showbit(Math.idiv(num, 10) % 10, 2)
            this.showbit(Math.idiv(num, 100) % 10, 1)
        }

        /**
         * Mostra um número em formato hexadecimal no display TM1637.
         * @param num o número hexadecimal a ser exibido, por exemplo: 0
        */
        //% subcategory="Display de digitos"
        //% color=#FFA300
        //% blockId="TM1637_showhex" block="%tm|mostrar número hexadecimal %num"
        //% weight=90 blockGap=8
        //% parts="TM1637"
        showHex(num: number) {
            if (num < 0) {
                this._dat(0, 0x40) // '-'
                num = -num
            }
            else
                this.showbit((num >> 12) % 16)
            this.showbit(num % 16, 3)
            this.showbit((num >> 4) % 16, 2)
            this.showbit((num >> 8) % 16, 1)
        }

        /**
         * Exibe ou oculta o ponto decimal (DP) de um dígito específico no display TM1637.
         * @param bit índice do dígito (0–3) onde o ponto será alterado
         * @param show true para exibir o ponto, false para ocultá-lo
        */
        //% subcategory="Display de digitos"
        //% color=#FFA300
        //% blockId="TM1637_showDP" block="%tm|ponto decimal na posição %bit|exibir %show"
        //% weight=70 blockGap=8
        //% parts="TM1637"
        showDP(bit: number = 1, show: boolean = true) {
            bit = bit % this.count
            if (show) this._dat(bit, this.buf[bit] | 0x80)
            else this._dat(bit, this.buf[bit] & 0x7F)
        }

        /**
         * Limpa o display, apagando todos os números e pontos.
        */
        //% subcategory="Display de digitos"
        //% color=#FFA300
        //% blockId="TM1637_clear" block="Limpar %tm"
        //% weight=80 blockGap=8
        //% parts="TM1637"
        tmclear() {
            for (let i = 0; i < this.count; i++) {
                this._dat(i, 0)
                this.buf[i] = 0
            }
        }

        /**
         * Liga o display de dígitos TM1637.
        */
        //% subcategory="Display de digitos"
        //% color=#FFA300
        //% blockId="TM1637_on"  block="Ligar %tm"
        //% weight=86 blockGap=8
        //% parts="TM1637"
        on() {
            this._ON = 8;
            this._write_data_cmd();
            this._write_dsp_ctrl();
        }

        /**
         * Desliga o display de dígitos TM1637.
        */
        //% subcategory="Display de digitos"
        //% color=#FFA300
        //% blockId="TM1637_off" block="Desligar %t"
        //% weight=85 blockGap=8
        //% parts="TM1637"
        off() {
            this._ON = 0;
            this._write_data_cmd();
            this._write_dsp_ctrl();
        }
    }

    /**
     * Cria um objeto para controlar o display de dígitos TM1637.
     * @param clk o pino CLK para o TM1637, por exemplo: DigitalPin.P1
     * @param dio o pino DIO para o TM1637, por exemplo: DigitalPin.P2
     * @param intensity o brilho do display (0 a 8), por exemplo: 7
     * @param count a quantidade de dígitos no display, por exemplo: 4
    */
    //% subcategory="Display de digitos"
    //% color=#FFA300
    //% weight=200 blockGap=8
    //% blockId="TM1637_create" block="CLK %clk|DIO %dio|intensidade %intensity|quantidade de LEDs %count"
    export function create(clk: DigitalPin, dio: DigitalPin, intensity: number, count: number): TM1637LEDs {
        let tm = new TM1637LEDs();
        tm.clk = clk;
        tm.dio = dio;
        if ((count < 1) || (count > 5)) count = 4;
        tm.count = count;
        tm.brightness = intensity;
        tm.init();
        return tm;
    }


}