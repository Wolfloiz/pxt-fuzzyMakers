/**
 * Biblioteca de atuadores do Fuzzy bits
 */
//% block="Atuadores" weight=200 color=#89D333 icon="\uf109"
//% groups="['Motor CC', 'Servo Motor']"
namespace actuators {
    /**
    *  Define a velocidade do motor.
    * @param porta de saída da placa de expansão.
    */
    //% blockId=velocityMotorIO block="Motor CC, definir velocidade %speed do motor na porta %pin"
    //% speed.min=0 speed.max=9
    //% group="Motor CC"
    //% weight=20
    export function SetSpeedMotor(speed: number, pin: OutputPorts) {
        pins.analogWritePin(pin, Math.map(speed, 0, 9, 0, 1023))
    }

    /**
    *  Parar o motor na porta definida
    * @param porta de saída da placa de expansão.
    */
    //% blockId=stopMotorIO block="Motor CC, parar motor na porta %pin"
    //% group="Motor CC"
    //% weight=15
    export function StopMotor( pin: OutputPorts) {
        pins.analogWritePin(pin, 0);
    }

    /**
    *  Define a direção do motor.
    * @param porta de saída da placa de expansão.
    */
    //% blockId=directionMotorIO block="Motor CC, definir direção do motor para %direction na porta %pin"
    //% group="Motor CC"
    //% weight=10
    export function SetDirectionMotor(direction: MotorDirection, pin: OutputPorts) {
        if (direction == MotorDirection.clockwise)
            pins.digitalWritePin(pin, 0)
        if (direction == MotorDirection.antiClockwise)
            pins.digitalWritePin(pin, 1)
    }

    /**
    *  Define o ângulo para o modo sweep do servo motor.
    * @param porta de saída da placa de expansão.
    */
    //% blockId=angleServoMotorIO block="Servo motor, definir ângulo %deg do servo motor na porta %pin no modo sweep"
    //% deg.min=0
    //% deg.max=180
    //% group="Servo Motor"
    //% weight=10
    export function SetAngleServo(deg: number, pin: OutputPorts) {
        pins.analogWritePin(pin, Math.map(deg, 0, 180, 0, 1023))
    }

    /**
    *  Define o ângulo para o modo knob do servo motor.
    * @param porta de saída da placa de expansão.
    */
    //% blockId=angleServoKnobIO block="Servo motor, definir ângulo %deg do servo motor na porta %pin no modo knob"
    //% deg.min=0
    //% deg.max=180
    //% group="Servo Motor"
    //% weight=10
    export function SetAngleServoKnob(deg: number, pin: OutputPorts) {
        pins.analogWritePin(pin, Math.map(deg, 0, 180, 0, 1023))
    }
}
