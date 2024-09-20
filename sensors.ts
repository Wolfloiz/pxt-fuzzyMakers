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
    namespace sensors {
    /**
     * Obtem o valor do botão na porta determinada.
     * @param porta de entrada da placa de expansão.
     */
    //% blockId=buttonIO block="Valor do Botão na porta %pin"
    //% weight = 10
    export function buttonValue(pin: InputPorts): number {
        return pins.digitalReadPin(pin);
    }

    /**
     * Obtem o valor do poteciômetro na porta determinada.
     * @param porta de entrada da placa de expansão.
     */
    //% blockId=dimmerIO block="Valor do potenciômetro na porta %pin"
    //% weight = 10
    export function dimmerValue(pin: InputPorts): number {
        return pins.analogReadPin(pin);
    }

    /**
     * Obtem o valor do sensor infravermelho na porta determinada.
     * @param porta de entrada da placa de expansão.
     */
    //% blockId=infraredIO block="Valor do sensor infravermelho na porta %pin"
    //% weight = 10
    export function infraRedValue(pin: InputPorts): number {
        return pins.digitalReadPin(pin);
    }
}