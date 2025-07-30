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
        return analogReadPort;
    }

    /**
     * Obtem o valor do sensor infravermelho na porta determinada.
     * @param porta de entrada da placa de expansão.
     */
    //% blockId=infraredIOFuzzy block="Valor do sensor infravermelho na porta %pin"
    //% weight=10
    //% group="Infravermelho"
    export function infraredValue(pin: InputPorts): number {
        let analogReadPort = pins.analogReadPin(pin);
        return analogReadPort;
    }

        /**
         * Obtem o valor do sensor de som na porta determinada.
         * @param porta de entrada da placa de expansão.
         */
        //% blockId=soundSensorIO block="Valor do sensor de som na porta %pin"
        //% weight=10
        //% group="Sensor de som"
        export function soundSensorValue(pin: InputPorts): number {
            let analogReadPort = pins.analogReadPin(pin);
            return analogReadPort;
        }

        /**
         * Obtem o valor do sensor de luz na porta determinada.
         * @param porta de entrada da placa de expansão.
         */
        //% blockId=lightSensorIO block="Valor do sensor de luz na porta %pin"
        //% weight=10
        //% group="Sensor de luz"
        export function lightSensorValue(pin: InputPorts): number {
            let analogReadPort = pins.analogReadPin(pin);
            return analogReadPort;
        }

        /**
         * Obtem o valor do fim de curso na porta determinada.
         * @param porta de entrada da placa de expansão.
         */
        //% blockId=endstopIO block="Valor da chave fim de curso na porta %pin"
        //% weight=10
        //% group="Fim de curso"
        export function endstopValue(pin: InputPorts): number {
            let digitalReadPort = pins.digitalReadPin(pin);
            return digitalReadPort;
        }
}