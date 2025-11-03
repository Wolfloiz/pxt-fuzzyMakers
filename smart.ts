
enum DiagonalWay {
    //% block="Subir"
    Up = 0,
    //% block="Descer"
    Down = 1,
}

enum DiagonalDirection {
    //% block="Subir"
    Front = 0,
    //% block="Descer"
    Back = 1,
}
class Constellation {
    xi: number;
    yi: number;
    xf: number;
    yf: number;
    name: string;

    constructor(xi: number, yi: number, xf: number, yf: number, name: string) {
        this.xi = xi;
        this.yi = yi;
        this.xf = xf;
        this.yf = yf;
        this.name = name;
    }
}

//% block="Smart" color="#ff9900" weight=10 icon="\uf144"
//% advanced=true
//% groups="['Robô Escriba', 'Servo']"
namespace Smart {

    /**
        *  Define o robô para cima
        * @param Define o angulo do servo motor
    */
    //% blockId=upDirection block="Mover caneta para cima %step"
    //% step.min=0 step.max=2
    //% step.defl=1
    //% group="Robô escriba"
    //% weight=20
    export function upServo(step: number) {
       let y = step * 207
        actuators.SetAngleServoKnob(y, OutputPorts.P8)
        basic.pause(1000)
    }

    /**
        *  Define o robô para baixo
        * @param Define o angulo do servo motor
        */
    //% blockId=downDirection block="Mover caneta para baixo %step"
    //% step.min=0 step.max=2 step.defl=1
    //% group="Robô escriba"
    //% weight=20
    export function downServo(step: number) {
        let y = step * -207
        actuators.SetAngleServoKnob(y, OutputPorts.P8)
        basic.pause(1000)
    }

    /**
     * Move o robô para a direita durante daterminado tempo.
     * @param tempo Segundos (aproximados) para girar as rodas
     */
    //% blockId=roboescriba_right block="Mover caneta para direita %qtd"
    //% qtd.defl=1
    //% group="Robô escriba"
    //% weight=80
    export function moveRight(qtd: number) {
        actuators.SetSpeedMotor(1023, OutputPorts.P16)
        actuators.SetDirectionMotor(MotorDirection.clockwise, OutputPorts.P12)
        basic.pause(qtd * 750)
        actuators.StopMotor(OutputPorts.P16)
        basic.pause(1000)
    }

    /**
     * Move o robô para a esquerda durante daterminado tempo.
     * @param tempo Segundos (aproximados) para girar as rodas
     */
    //% blockId=roboescriba_esquerda block="Mover caneta para esquerda %qtd"
    //% qtd.defl=1
    //% group="Robô escriba"
    //% weight=80
    export function moveLeft(qtd: number) {
        actuators.SetSpeedMotor(1023, OutputPorts.P16)
        actuators.SetDirectionMotor(MotorDirection.antiClockwise, OutputPorts.P12)
        basic.pause(qtd * 750)
        actuators.StopMotor(OutputPorts.P16)
        basic.pause(1000)
    }

    /**
     * Move o robô para a diagonal durante daterminada ditância.
     * @param tempo Segundos (aproximados) para girar as rodas
    */
    //% blockId=roboescriba_diagonal block="%direction caneta na diagonal %distance"
    //% distance.defl=1
    //% group="Robô escriba"
    //% weight=80
    export function moveDiagonal(direction: DiagonalDirection, sense: DiagonalWay, distance: number) {
        let y = 415
        if (sense == 0) {
            actuators.SetDirectionMotor(MotorDirection.clockwise, OutputPorts.P12)
        } else {
            actuators.SetDirectionMotor(MotorDirection.antiClockwise, OutputPorts.P12)
        }
        actuators.SetSpeedMotor(1023, OutputPorts.P16)
        for (let index = 0; index <= 9; index++) {
            if (direction == 0) {
                y += distance * 20
            } else {
                y += distance * -20
            }
            actuators.SetAngleServoKnob(y, OutputPorts.P8)
            basic.pause(80)
        }
        actuators.StopMotor(OutputPorts.P16)
        basic.pause(1000)
    }

    // Observatório Astronômico

    let listaConstelacoes: Constellation[] = [];
    let anguloY: number = 0;

    /**
     * Inicializa a lista de constelações com dados pré-definidos
     */
    //% blockId=startconstellation block="Definir constelações"
    //% group="Observatório Astronômico"
    //% weight=100
    export function startConstellation(): void {
        
        listaConstelacoes = [];
        listaConstelacoes.push(new Constellation(195, 60, 255, 70, "ESCORPIAO"));
        listaConstelacoes.push(new Constellation(240, 45, 270, 65, "LIBRA"));
        listaConstelacoes.push(new Constellation(205, 10, 225, 35, "CENTAURO"));
        listaConstelacoes.push(new Constellation(270, 0, 285, 45, "VIRGEM"));
        listaConstelacoes.push(new Constellation(335, 30, 360, 50, "HERCULES"));
        listaConstelacoes.push(new Constellation(30, 50, 75, 60, "AGUIA"));
        listaConstelacoes.push(new Constellation(125, 15, 135, 35, "GANSO"));
        listaConstelacoes.push(new Constellation(80, 15, 105, 30, "AQUARIO"));
        listaConstelacoes.push(new Constellation(95, 35, 105, 55, "CAPRICORNIO"));
        listaConstelacoes.push(new Constellation(115, 55, 145, 75, "SAGITARIO"));
        listaConstelacoes.push(new Constellation(60, 0, 80, 25, "PEGASUS"));
        listaConstelacoes.push(new Constellation(155, 30, 175, 40, "PAVAO"));
        listaConstelacoes.push(new Constellation(25, 15, 35, 40, "CISNE"));
        listaConstelacoes.push(new Constellation(285, 60, 360, 90, "OFIUCO E SERPENTARIO"));
        listaConstelacoes.push(new Constellation(355, 0, 360, 20, "DRAGAO"));
        listaConstelacoes.push(new Constellation(210, 46, 225, 59, "LOBO"));
        listaConstelacoes.push(new Constellation(10, 33, 20, 41, "LIRA"));
        listaConstelacoes.push(new Constellation(180, 40, 195, 55, "ALTAR"));
        listaConstelacoes.push(new Constellation(300, 20, 330, 20, "PASTOR"));
        listaConstelacoes.push(new Constellation(185, 34, 195, 38, "TRIANGULO AUSTRAL"));
        listaConstelacoes.push(new Constellation(170, 19, 185, 23, "OITANTE"));
        listaConstelacoes.push(new Constellation(185, 5, 195, 15, "LAGARTO"));
        listaConstelacoes.push(new Constellation(248, 10, 255, 17, "CORVO"));
        listaConstelacoes.push(new Constellation(250, 0, 260, 7, "TAÇA"));
        listaConstelacoes.push(new Constellation(65, 30, 75, 35, "POTRO"));
        listaConstelacoes.push(new Constellation(54, 34, 60, 42, "GOLFINHO"));
    }


    /**
    * Busca uma constelação nas coordenadas especificadas
    * @param x coordenada x (0-360 graus)
    * @param y coordenada y (0-90 graus)
    * @return nome da constelação ou "nenhuma"
    */
    //% blockId=findConstellation block="Buscar constelação em x %x y %y"
    //% group="Observatório Astronômico"
    //% weight=100
    //% x.min=0 x.max=360
    //% y.min=0 y.max=90
    //% weight=90
    export function findConstellation(x: number, y: number): string {
        if (listaConstelacoes.length === 0) {
            startConstellation();
        }

        for (let i = 0; i <= listaConstelacoes.length - 1; i++) {
            if (listaConstelacoes[i].xi <= x &&
                listaConstelacoes[i].xf >= x &&
                listaConstelacoes[i].yi <= y &&
                listaConstelacoes[i].yf >= y) {
                return listaConstelacoes[i].name;
            }
        }
        return "nenhuma";
    }
}