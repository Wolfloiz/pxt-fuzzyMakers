
enum DiagonalDirection {
    //% block="Esquerda"
    Left = 0,
    //% block="Direita"
    Right = 1,
}

//% block="Smart" color="#ff9900" weight=10 icon="\uf17b"
//% advanced=true
//% groups="['Robô escriba', 'Servo']"
namespace Smart {

    /**
        *  Define o robô para cima
        * @param Define o angulo do servo motor
    */
    //% blockId=upDirection block="Mover servo para cima com o passo %step"
    //% step.min=0 step.max=5
    //% group="Robô escriba"
    //% weight=20
    export function upServo(step: number) {
        let posServo = step * 250
        if (posServo > 1023) posServo = 1023
        pins.analogWritePin(AnalogPin.P8, posServo)
        basic.pause(1000)
    }

    /**
        *  Define o robô para baixo
        * @param Define o angulo do servo motor
        */
    //% blockId=downDirection block="Mover servo para baixo com o passo %step"
    //% step.min=0 step.max=5
    //% group="Robô escriba"
    //% weight=20
    export function downServo(step: number) {
        let posServo = step * -250
        if (posServo < 0) posServo = 0
        pins.analogWritePin(AnalogPin.P8, posServo)
        basic.pause(1000)
    }

    /**
     * Move o robô para a direita durante daterminado tempo.
     * @param tempo Segundos (aproximados) para girar as rodas
     */
    //% blockId=roboescriba_right block="Mover robô para a direita %qtd vezes"
    //%
    //% group="Robô escriba"
    //% weight=80
    export function moveRight(qtd: number) {
        actuators.SetSpeedMotor(1023, OutputPorts.P16)
        actuators.SetDirectionMotor(MotorDirection.clockwise, OutputPorts.P12)
        basic.pause(qtd * 750)
        actuators.StopMotor(OutputPorts.P16);
    }

    /**
     * Move o robô para a esquerda durante daterminado tempo.
     * @param tempo Segundos (aproximados) para girar as rodas
     */
    //% blockId=roboescriba_esquerda block="Mover robô para a esquerda %qtd vezes"
    //%
    //% group="Robô escriba"
    //% weight=80
    export function moveLeft(qtd: number) {
        actuators.SetSpeedMotor(1023, OutputPorts.P16)
        actuators.SetDirectionMotor(MotorDirection.antiClockwise, OutputPorts.P12);
        basic.pause(qtd * 750);
        actuators.StopMotor(OutputPorts.P16);
    }

    /**
     * Move o robô para a diagonal durante daterminada ditância.
     * @param tempo Segundos (aproximados) para girar as rodas
    */
    //% blockId=roboescriba_diagonal block="Mover robô na diagonal no sentido %direction distância %distance"
    //% group="Robô escriba"
    //% weight=80
    export function moveDiagonal(direction: DiagonalDirection, distance: number) {
        let speed =500;
        actuators.SetSpeedMotor(1023, OutputPorts.P16);

        if (direction == DiagonalDirection.Left) {
            actuators.SetDirectionMotor(MotorDirection.clockwise, OutputPorts.P12);
        } else {
            actuators.SetDirectionMotor(MotorDirection.antiClockwise, OutputPorts.P12);
        }

        for (let index = 0; index < 5; index++) {
            speed = distance * 51
            actuators.SetAngleServoKnob(speed, OutputPorts.P8);
            basic.pause(150);
        }
        actuators.StopMotor(OutputPorts.P16);
    }

}