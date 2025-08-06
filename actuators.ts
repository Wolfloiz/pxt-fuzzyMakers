/**
 * Biblioteca de atuadores do Fuzzy bits
 */

enum Vel {
//% block="Rápido"
High,
//% block="Médio"
Medium,
//% block="Devagar"
Slow
}
//% block="Atuadores" weight=200 color=#89D333 icon="\uf109"
//% groups="['Motor CC', 'Servo Motor']"
namespace actuators {

    let currentAngle = 0;

    const maxServoValueAnalogWrite = 726;
    /**
    *  Define a velocidade do motor.
    * @param porta de saída da placa de expansão.
    */
    //% blockId=velocityMotorIO block="Motor CC, definir velocidade %speed na porta %pin"
    //% speed.min=0 speed.max=1023
    //% group="Motor CC"
    //% weight=20
    export function SetSpeedMotor(speed: number, pin: OutputPorts) {
        pins.analogWritePin(pin, speed)
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
    //% blockId=directionMotorIO block="Motor CC, definir direção para %direction na porta %pin"
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
    //% blockId=angleServoMotorIO block="Servo, definir velocidade %velocidade porta %pin modo Sweep"
    //% velocidade.min=0
    //% velocidade.max=1023
    //% group="Servo Motor"
    //% weight=10
    export function SetAngleServo(velocidade: number, pin: OutputPorts) {
        pins.analogWritePin(pin, velocidade);
    }

    /**
    *  Define o ângulo para o modo knob do servo motor.
    * @param porta de saída da placa de expansão.
    */
    //% blockId=angleServoKnobIO block="Servo, definir posição %posicao porta %pin modo Knob"
    //% posicao.min=0
    //% posicao.max=1023
    //% group="Servo Motor"
    //% weight=10
    export function SetAngleServoKnob(posicao: number, pin: OutputPorts) {
        currentAngle = posicao;
        pins.analogWritePin(pin, posicao)
    }
    
    /**
    *  Define intesidade de som do buzzer na porta determinada
    * @param porta de saída da placa de expansão.
    */
    //% blockId=buzzerIO block="Buzina, definir volume do som %sound na porta %pin"
    //% sound.min=0
    //% sound.max=1023
    //% group="Buzina"
    //% weight=10
    export function SetVolumeBuzzer(sound: number, pin: OutputPorts) {
        pins.analogWritePin(pin, sound);
    }

    /**
    *  Define intesidade de brilho do LED na porta determinada
    * @param porta de saída da placa de expansão.
    */
    //% blockId=LEDIO block="LED de alto brilho, definir brilho %bright na porta %pin"
    //% bright.min=0
    //% bright.max=1023
    //% group="LED"
    //% weight=10
    export function SetBrightLED(bright: number, pin: OutputPorts) {
        pins.analogWritePin(pin, bright);
    }
}
