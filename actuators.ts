/**
 * Biblioteca de atuadores do Fuzzy bits
 */
//% block="Atuadores" weight=200 color=#89D333 icon="\uf109"
//% groups="['Motor CC', 'Servo Motor']"
namespace actuators {

    let currentAngle = 0;

    const maxServoValueAnalogWrite = 726;
    /**
    *  Define a velocidade do motor.
    * @param porta de saída da placa de expansão.
    */
    //% blockId=velocityMotorIO block="Motor CC, definir velocidade %speed do motor na porta %pin"
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
    //% deg.max=1023
    //% group="Servo Motor"
    //% weight=10
    export function SetAngleServo(deg: number, pin: OutputPorts) {
        pins.analogWritePin(pin, deg);
    }

    /**
    *  Define o ângulo para o modo knob do servo motor.
    * @param porta de saída da placa de expansão.
    */
    //% blockId=angleServoKnobIO block="Servo motor, definir ângulo %deg do servo motor na porta %pin no modo knob"
    //% deg.min=0
    //% deg.max=1023
    //% group="Servo Motor"
    //% weight=10
    export function SetAngleServoKnob(deg: number, pin: OutputPorts) {
        currentAngle = deg;
        console.log(`n actual angle: ${currentAngle}`)
        pins.analogWritePin(pin, deg)
    }

    /**
        *  Define o ângulo e velocidade de mudança gradualmente para o modo knob do servo motor.
        * @param porta de saída da placa de expansão.
        * @param angulo de destino do servo
        * @param velocidade de movimento do servo
        */
    //% blockId=angleServoKnobGIO block="Definir ângulo %deg de servo motor na porta %pin com velocidade %speed no modo Knob"
    //% deg.min=0
    //% deg.max=1023
    //% speed.min=10 speed.max=100
    //% group="Servo Motor"
    //% weight=10
    export function SetAngleServoGradually(deg: number, pin: OutputPorts, speed: number ) {
        let step = speed / 4;  // Define a taxa de incremento
        let delayTime = Math.map(speed, 10, 100, 100, 0);
        let auxCurrentAngle = currentAngle;
        
        while (Math.abs(auxCurrentAngle - deg)> step) {
            if (auxCurrentAngle < deg) {
                auxCurrentAngle += step;
            } 

            if(auxCurrentAngle > deg) {
                auxCurrentAngle -= step;
            }
            pins.analogWritePin(pin, Math.map(auxCurrentAngle, 0, 1023, 0, maxServoValueAnalogWrite));

            basic.pause(10 * (100 - speed));  // Ajuste de delay para controle de velocidade
        }
        pins.analogWritePin(pin, deg);
        currentAngle=deg
    }

    // /**
    //     *  Define o ângulo e velocidade de mudança gradualmente para o modo knob do servo motor.
    //     * @param porta de saída da placa de expansão.
    //     * @param angulo de destino do servo
    //     * @param velocidade de movimento do servo
    //     */
    // //% blockId=angleServoSweepGIO block="Definir ângulo %deg de servo motor na porta %pin com velocidade %speed no modo Sweep"
    // //% deg.min=0
    // //% deg.max=1023
    // //% group="Servo Motor"
    // //% weight=10
    // export function SetAngleServoSweepGradually(deg: number, pin: OutputPorts, speed: number) {
    //     let currentAngle = pins.analogReadPin(pin);
    //     let step = speed / 10; // Define a taxa de incremento

    //     while (Math.abs(currentAngle - deg) > step) {
    //         if (currentAngle < deg) {
    //             currentAngle += step;
    //         } else {
    //             currentAngle -= step;
    //         }

    //         pins.analogWritePin(pin, currentAngle);
    //         basic.pause(10 * (100 - speed)); // Ajuste de delay para controle de velocidade
    //     }
    // }
    
}
