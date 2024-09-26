// Adicione seu código aqui

 enum InputPorts {
    P2 = 102,
    P1 = 101,
    P0 = 100
}

enum OutputPorts {
    P8 = 108,
    P12 = 112,
    P16 = 116
}

enum MotorDirection {
    //% block="Sentido horário"
    clockwise,
    //% block="Sentido anti-horário"
    antiClockwise
}

    /**
    * Biblioteca de sensores do Fuzzy bit
    */
    //% block="Sensores" weight=150 color=#F4361C icon="\uf11c"
    //% groups="['Botão', 'Infravermelho', 'Poteciômetro']"
    namespace sensors {
    /**
     * Obtem o valor do botão na porta determinada.
     * @param porta de entrada da placa de expansão.
     */
    //% blockId=buttonIO block="Valor do Botão na porta %pin"
    //% weight=10
    //% group="Botão"
    export function buttonValue(pin: InputPorts): number {
        return pins.digitalReadPin(pin);
    }

    /**
     * Obtem o valor do poteciômetro na porta determinada.
     * @param porta de entrada da placa de expansão.
     */
    //% blockId=dimmerIO block="Valor do potenciômetro na porta %pin"
    //% weight=10
    //% group="Poteciômetro"
    export function dimmerValue(pin: InputPorts): number {
        let analogReadPort = pins.analogReadPin(pin);
        let mapValue = Math.map(analogReadPort, 0, 255, 0, 9);
        return Math.round(mapValue);
    }

    /**
     * Obtem o valor do sensor infravermelho na porta determinada.
     * @param porta de entrada da placa de expansão.
     */
    //% blockId=infraredIO block="Valor do sensor infravermelho na porta %pin"
    //% weight=10
    //% group="Infravermelho"
    export function infraredValue(pin: InputPorts): number {
        let analogReadPort = pins.analogReadPin(pin);
        let mapValue = Math.map(analogReadPort, 0, 255, 0, 9);
        return Math.round(mapValue);
    }
}