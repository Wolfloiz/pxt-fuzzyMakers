
/**
 * Biblioteca do joystick do Fuzzy bot
 */

//% block="Joystick" color=#FFD43A icon="\uf11b" weight=130
//% groups="['Alavanca', 'Barra deslizante', 'Botões']"
namespace joystick {

    /**
    * Obtem o valor da alavanca movimento no eixo x.
    */
    //% blockId="stickHorizontal" block="Valor do eixo X da alavanca"
    //% weight=10
    //% group="Alavanca"
    export function HorizontalStick(): number {
        let analogReadPort = pins.analogReadPin(AnalogPin.P1);
        return analogReadPort;
    }

    /**
    * Obtem o valor da alavanca movimento no eixo y.
    */
    //% blockId="stickVertical" block="Valor do eixo Y da alavanca"
    //% weight=10
    //% group="Alavanca"
    export function VerticalStick(): number {
        let analogReadPort = pins.analogReadPin(AnalogPin.P2);
        return analogReadPort;
    }
    
    /**
    * Obtem o valor da barra deslizante.
    */
    //% blockId="SliderDimmer" block="Valor da barra deslizante (E)"
    //% weight=10
    //% group="Barra deslizante"
    export function SliderDimmer(): number {

        let analogReadPort = pins.analogReadPin(AnalogPin.P0);
        let portMap = Math.map(analogReadPort,0,1023,0,255);
        return portMap;
    }

    /**
    * Obtem o estado do botão da alavanca.
    */
    //% blockId="ButtonStick" block="Botão alavanca é pressionado (Z)"
    //% weight=10
    //% group="Alavanca"
    export function StickButton(): number {
        let button = pins.digitalReadPin(DigitalPin.P8);
        return button;
    }

    /**
    * Obtem o estado do botão frontal preto
    */
    //% blockId="BlackFrontalButton" block="Botão A é pressionado"
    //% weight=10
    //% group="Botões"
    export function BlackFrontalButton(): number {
        let button = pins.digitalReadPin(DigitalPin.P15);
        return button;
    }

    /**
    * Obtem o estado do botão frontal vermelho
    */
    //% blockId="RedFrontalButton" block="Botão B é pressionado"
    //% weight=10
    //% group="Botões"
    export function RedFrontalButton(): number {
        let button = pins.digitalReadPin(DigitalPin.P14);
        return button;
    }

    /**
    * Obtem o estado do botão superior vermelho
    */
    //% blockId="RedUpButton" block="Botão C é pressionado"
    //% weight=10
    //% group="Botões"
    export function RedUpButton(): number {
        let button = pins.digitalReadPin(DigitalPin.P13);
        return button;
    }

    /**
    * Obtem o estado do botão superior preto
    */
    //% blockId="BlackUpButton" block="Botão D é pressionado"
    //% weight=10
    //% group="Botões"
    export function BlackUpButton(): number {
        let button = pins.digitalReadPin(DigitalPin.P12);
        return button;
    }
}
