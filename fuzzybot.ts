/** 
 * @file pxt-fuzzyMakers/fuzzyBot.ts
*/

const MOTER_ADDRESSS = 0x10


enum state {
    state1 = 0x10,
    state2 = 0x11,
    state3 = 0x20,
    state4 = 0x21,
    state5 = 0x30,
    state6 = 0x31

}
interface KV {
    key: state;
    action: Action;
}

//% weight=100 color=#1e88e5 icon="\uf441" block="Fuzzy Bot"
//% groups=['micro:bit(v2)']
namespace fuzzyBot {
    let kbCallback: KV[] = []
    export class Packeta {
        public mye: string;
        public myparam: number;
    }

    export enum Motors {
        //% blockId="left motor" block="esquerdo"
        M1 = 0,
        //% blockId="right motor" block="direito"
        M2 = 1,
        //% blockId="all motor" block="todos"
        All = 2
    }

    export enum Servos {
        //% blockId="S1" block="S1"
        S1 = 0,
        //% blockId="S2" block="S2"
        S2 = 1
    }

    export enum Dir {
        //% blockId="CW" block="frente"
        CW = 0x0,
        //% blockId="CCW" block="trás"
        CCW = 0x1
    }

    export enum Patrol {
        //% blockId="patrolLeft" block="esquerdo"
        PatrolLeft = 13,
        //% blockId="patrolRight" block="direito"
        PatrolRight = 14,
        //% blockId="patrolMiddle" block="meio"
        PatrolMiddle = 0
    }

    export enum Patrol1 {
        //% blockId="patrolLeft" block="esquerdo"
        PatrolLeft = 0x10,
        //% blockId="patrolRight" block="direito"
        PatrolRight = 0x20,
        //% blockId="patrolMiddle" block="meio"
        PatrolMiddle = 0x30
    }

    export enum Voltage {
        //%block="alto"
        High = 0x01,
        //% block="baixo"
        Low = 0x00
    }

    export enum LED {
        //% blockId="LEDLeft" block="esquerdo"
        LEDLeft = 8,
        //% blockId="LEDRight" block="direito"
        LEDRight = 12
    }

    export enum LEDswitch {
        //% blockId="turnOn" block="Ligado"
        turnOn = 0x01,
        //% blockId="turnOff" block="Desligado"
        turnOff = 0x00
    }



    /**
     * Defina a direção e a velocidade do motor do bot.
     */

    //% weight=90
    //% blockId=motor_MotorRun block="Motor|%index|mover para|%Dir|com a velocidade|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function motorRun(index: Motors, direction: Dir, speed: number): void {
        let buf = pins.createBuffer(3);
        if (index == 0) {
            buf[0] = 0x00;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
        }
        if (index == 1) {
            buf[0] = 0x02;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
        }
        if (index == 2) {
            buf[0] = 0x00;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
            pins.i2cWriteBuffer(0x10, buf);
        }
    }

    /**
     * Pare o motor do bot.
     */

    //% weight=20
    //% blockId=motor_motorStop block="parar motor |%motors"
    //% motors.fieldEditor="gridpicker" motors.fieldOptions.columns=2 
    export function motorStop(motors: Motors): void {
        let buf = pins.createBuffer(3);
        if (motors == 0) {
            buf[0] = 0x00;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
        }
        if (motors == 1) {
            buf[0] = 0x02;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
        }

        if (motors == 2) {
            buf[0] = 0x00;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
            pins.i2cWriteBuffer(0x10, buf);
        }

    }

    /**
     * Ler sensor de rastreamento de linha.
     */

    //% weight=20
    //% blockId=read_Patrol block="ler sensor de linha |%patrol"
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function readPatrol(patrol: Patrol): number {
        if (patrol == Patrol.PatrolLeft) {
            return pins.digitalReadPin(DigitalPin.P13)
        } else if (patrol == Patrol.PatrolRight) {
            return pins.digitalReadPin(DigitalPin.P14)
        } else if (patrol == Patrol.PatrolMiddle) {
            return pins.digitalReadPin(DigitalPin.P0)
        } else {
            return -1
        }
    }

    /**
     * Ligar/desligar os LEDs.
     */

    //% weight=20
    //% blockId=writeLED block="LED |%led definir para |%ledswitch"
    //% led.fieldEditor="gridpicker" led.fieldOptions.columns=2 
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function writeLED(led: LED, ledswitch: LEDswitch): void {
        if (led == LED.LEDLeft) {
            pins.digitalWritePin(DigitalPin.P8, ledswitch)
        } else if (led == LED.LEDRight) {
            pins.digitalWritePin(DigitalPin.P12, ledswitch)
        } else {
            return
        }
    }

    /**
     * Defina os servos do bot.
     */

    //% weight=90
    //% blockId=servo_ServoRun block="servo|%index|definir para ângulo|%angle"
    //% angle.min=0 angle.max=180
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function servoRun(index: Servos, angle: number): void {
        let buf = pins.createBuffer(2);
        if (index == 0) {
            buf[0] = 0x14;
        }
        if (index == 1) {
            buf[0] = 0x15;
        }
        buf[1] = angle;
        pins.i2cWriteBuffer(0x10, buf);
    }

    /**
    * Função de evento do sensor de rastreamento de linha.
    */
    //% weight=2
    //% blockId=kb_event block="quando o sensor de linha |%value com nível |%vi"
    export function ltEvent(value: Patrol1, vi: Voltage, a: Action) {
        let state = value + vi;
        serial.writeNumber(state)
        let item: KV = { key: state, action: a };
        kbCallback.push(item);
    }

    let x: number
    let i: number = 1;
    function patorlState(): number {
        switch (i) {
            case 1: x = pins.digitalReadPin(DigitalPin.P13) == 0 ? 0x10 : 0; break;
            case 2: x = pins.digitalReadPin(DigitalPin.P13) == 1 ? 0x11 : 0; break;
            case 3: x = pins.digitalReadPin(DigitalPin.P14) == 0 ? 0x20 : 0; break;
            case 4: x = pins.digitalReadPin(DigitalPin.P0) == 0 ? 0x30 : 0; break;
            case 5: x = pins.digitalReadPin(DigitalPin.P0) == 1 ? 0x31 : 0; break;
            default: x = pins.digitalReadPin(DigitalPin.P14) == 1 ? 0x21 : 0; break;
        }
        i += 1;
        if (i == 7) i = 1;

        return x;
    }

    basic.forever(() => {
        if (kbCallback != null) {
            let sta = patorlState();
            if (sta != 0) {
                for (let item of kbCallback) {
                    if (item.key == sta) {
                        item.action();
                    }
                }
            }
        }
        basic.pause(50);
    })


}