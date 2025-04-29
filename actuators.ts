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
    // /**
    //     *  Define o ângulo e velocidade de mudança gradualmente para o modo knob do servo motor.
    //     * @param porta de saída da placa de expansão.
    //     * @param angulo de destino do servo
    //     * @param velocidade de movimento do servo
    //     */
    // //% blockId=angleServoSpeedKnobGIO block="Servo, definir posição %posicao porta %pin com velocidade %velocidade modo Knob"
    // //% posicao.min=0
    // //% posicao.max=1023
    // //% group="Servo Motor"
    // //% weight=10
    // export function SetAngleServoGradually(posicao: number, pin: OutputPorts, speed: Vel ) {
        
    //     if(speed === Vel.High)
    //     {
    //         pins.analogWritePin(pin, posicao)
    //     }

    //     else if (speed === Vel.Medium) {
    //         posicao = Math.constrain(posicao, 0, 1023);
    //         const step = 1;
    //         const delayTime = 50;
    //         let angle = currentAngle

    //         while (angle != posicao) {
    //             angle += (angle < posicao) ? step : -step
    //             pins.analogWritePin(
    //                 pin,
    //                 Math.map(angle, 0, 1023, 0, maxServoValueAnalogWrite)
    //             )

    //             basic.pause(delayTime);
    //         }
    //     }

    //     else if (speed === Vel.Slow) {
    //         posicao = Math.constrain(posicao, 0, 1023);
    //         const step = 1;
    //         const delayTime = 100;
    //         let angle = currentAngle

    //         while (angle != posicao) {
    //             angle += (angle < posicao) ? step : -step
    //             pins.analogWritePin(
    //                 pin,
    //                 Math.map(angle, 0, 1023, 0, maxServoValueAnalogWrite)
    //             )

    //             basic.pause(delayTime);
    //         }
    //     }
    //     currentAngle = posicao;
    // }
}
