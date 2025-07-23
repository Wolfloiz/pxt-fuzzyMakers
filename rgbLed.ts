/**
 * This library provides blocks for controlling an RGB LED. It is a fork by: https://github.com/microsoft/pxt-neopixel
 */
enum NeoPixelColors {
    //% block=vermelho
    Red = 0xFF0000,
    //% block=laranja
    Orange = 0xFFA500,
    //% block=amarelo
    Yellow = 0xFFFF00,
    //% block=verde
    Green = 0x00FF00,
    //% block=azul
    Blue = 0x0000FF,
    //% block=azul anil
    Indigo = 0x4b0082,
    //% block=violeta
    Violet = 0x8a2be2,
    //% block=roxo
    Purple = 0xFF00FF,
    //% block=branco
    White = 0xFFFFFF,
    //% block=preto
    Black = 0x000000
}

/**
 * Different modes for RGB or RGB+W NeoPixel strips
 */
enum NeoPixelMode {
    //% block="RGB (GRB formato)"
    RGB = 1,
    //% block="RGB+W"
    RGBW = 2,
    //% block="RGB (RGB formato)"
    RGB_RGB = 3
}

/**
 * Funções para operar faixas de LEDs NeoPixel.
 */

//% block="LEDS RGB" weight=5 color=#2699BF icon="\uf110" weight=120
namespace rgbLed {
    /**
     * A NeoPixel strip
     */
    export class Strip {
        buf: Buffer;
        pin: DigitalPin;
        // TODO: encode as bytes instead of 32bit
        brightness: number;
        start: number; // start offset in LED strip
        _length: number; // number of LEDs
        _mode: NeoPixelMode;
        _matrixWidth: number; // number of leds in a matrix - if any

        /**
         * Exibe todos os LEDs com uma determinada cor (valores de 0 a 255 para r, g, b).
         * @param rgb cor RGB dos LEDs
        */
        //% blockId="neopixel_set_strip_color" block="%strip|mostrar cor %rgb=neopixel_colors"
        //% strip.defl=LEDs
        //% weight=85 blockGap=8
        //% parts="neopixel"
        showColor(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.show();
        }

        /**
         * Exibe um padrão de arco-íris em todos os LEDs.
         * @param startHue valor inicial de matiz para o arco-íris, ex: 1
         * @param endHue valor final de matiz para o arco-íris, ex: 360
        */
        //% blockId="neopixel_set_strip_rainbow" block="%strip|mostrar arco-íris de %startHue|até %endHue"
        //% strip.defl=LEDs
        //% weight=85 blockGap=8
        //% parts="neopixel"
        showRainbow(startHue: number = 1, endHue: number = 360) {
            if (this._length <= 0) return;

            startHue = startHue >> 0;
            endHue = endHue >> 0;
            const saturation = 100;
            const luminance = 50;
            const steps = this._length;
            const direction = HueInterpolationDirection.Clockwise;

            //hue
            const h1 = startHue;
            const h2 = endHue;
            const hDistCW = ((h2 + 360) - h1) % 360;
            const hStepCW = Math.idiv((hDistCW * 100), steps);
            const hDistCCW = ((h1 + 360) - h2) % 360;
            const hStepCCW = Math.idiv(-(hDistCCW * 100), steps);
            let hStep: number;
            if (direction === HueInterpolationDirection.Clockwise) {
                hStep = hStepCW;
            } else if (direction === HueInterpolationDirection.CounterClockwise) {
                hStep = hStepCCW;
            } else {
                hStep = hDistCW < hDistCCW ? hStepCW : hStepCCW;
            }
            const h1_100 = h1 * 100; //we multiply by 100 so we keep more accurate results while doing interpolation

            //sat
            const s1 = saturation;
            const s2 = saturation;
            const sDist = s2 - s1;
            const sStep = Math.idiv(sDist, steps);
            const s1_100 = s1 * 100;

            //lum
            const l1 = luminance;
            const l2 = luminance;
            const lDist = l2 - l1;
            const lStep = Math.idiv(lDist, steps);
            const l1_100 = l1 * 100

            //interpolate
            if (steps === 1) {
                this.setPixelColor(0, hsl(h1 + hStep, s1 + sStep, l1 + lStep))
            } else {
                this.setPixelColor(0, hsl(startHue, saturation, luminance));
                for (let i = 1; i < steps - 1; i++) {
                    const h = Math.idiv((h1_100 + i * hStep), 100) + 360;
                    const s = Math.idiv((s1_100 + i * sStep), 100);
                    const l = Math.idiv((l1_100 + i * lStep), 100);
                    this.setPixelColor(i, hsl(h, s, l));
                }
                this.setPixelColor(steps - 1, hsl(endHue, saturation, luminance));
            }
            this.show();
        }

        /**
         * Exibe um gráfico de barras vertical com base nos valores `valor` e `máximo`.
         * Se `máximo` for 0, o gráfico será ajustado automaticamente.
         * @param value valor atual a ser exibido
         * @param high valor máximo, ex: 255
        */
        //% weight=84
        //% blockId=neopixel_show_bar_graph block="%strip|mostrar gráfico de barras do valor %value|até %high"
        //% strip.defl=LEDs
        //% icon="\uf080"
        //% parts="neopixel"
        showBarGraph(value: number, high: number): void {
            if (high <= 0) {
                this.clear();
                this.setPixelColor(0, NeoPixelColors.Yellow);
                this.show();
                return;
            }

            value = Math.abs(value);
            const n = this._length;
            const n1 = n - 1;
            let v = Math.idiv((value * n), high);
            if (v == 0) {
                this.setPixelColor(0, 0x666600);
                for (let i = 1; i < n; ++i)
                    this.setPixelColor(i, 0);
            } else {
                for (let i = 0; i < n; ++i) {
                    if (i <= v) {
                        const b = Math.idiv(i * 255, n1);
                        this.setPixelColor(i, rgbLed.rgb(b, 0, 255 - b));
                    }
                    else this.setPixelColor(i, 0);
                }
            }
            this.show();
        }

        /**
         * Define a cor de um LED (valores de 0 a 255 para r, g, b).
         * É necessário chamar ``show`` para que as alterações fiquem visíveis.
         * @param pixeloffset posição do NeoPixel na faixa
         * @param rgb cor RGB do LED
        */
        //% blockId="neopixel_set_pixel_color" block="%strip|definir cor do pixel na posição %pixeloffset|para %rgb=neopixel_colors"
        //% strip.defl=LEDs
        //% blockGap=8
        //% weight=80
        //% parts="neopixel" advanced=true
        setPixelColor(pixeloffset: number, rgb: number): void {
            this.setPixelRGB(pixeloffset >> 0, rgb >> 0);
        }

        /**
         * Define o número de pixels em uma faixa no formato de matriz.
         * @param width número de pixels por linha
        */
        //% blockId=neopixel_set_matrix_width block="%strip|definir largura da matriz como %width"
        //% strip.defl=LEDs
        //% blockGap=8
        //% weight=5
        //% parts="neopixel" advanced=true
        setMatrixWidth(width: number) {
            this._matrixWidth = Math.min(this._length, width >> 0);
        }

        /**
         * Define a cor de um LED (valores de 0 a 255 para r, g, b) em uma faixa no formato de matriz.
         * É necessário chamar ``show`` para que as alterações fiquem visíveis.
         * @param x posição horizontal
         * @param y posição vertical
         * @param rgb cor RGB do LED
        */
        //% blockId="neopixel_set_matrix_color" block="%strip|definir cor da matriz na posição x %x|y %y|para %rgb=neopixel_colors"
        //% strip.defl=LEDs
        //% weight=4
        //% parts="neopixel" advanced=true
        setMatrixColor(x: number, y: number, rgb: number) {
            if (this._matrixWidth <= 0) return; // not a matrix, ignore
            x = x >> 0;
            y = y >> 0;
            rgb = rgb >> 0;
            const cols = Math.idiv(this._length, this._matrixWidth);
            if (x < 0 || x >= this._matrixWidth || y < 0 || y >= cols) return;
            let i = x + y * this._matrixWidth;
            this.setPixelColor(i, rgb);
        }

        /**
         * Para NeoPixels com LEDs RGB+W, define o brilho do LED branco. Esta função funciona apenas com NeoPixels RGB+W.
         * @param pixeloffset posição do LED na faixa
         * @param white brilho do LED branco
        */
        //% blockId="neopixel_set_pixel_white" block="%strip|definir brilho do LED branco na posição %pixeloffset|para %white"
        //% strip.defl=LEDs
        //% blockGap=8
        //% weight=80
        //% parts="neopixel" advanced=true
        setPixelWhiteLED(pixeloffset: number, white: number): void {
            if (this._mode === NeoPixelMode.RGBW) {
                this.setPixelW(pixeloffset >> 0, white >> 0);
            }
        }

        /**
         * Envia todas as alterações para a faixa de LEDs.
        */
        //% blockId="neopixel_show" block="%strip|mostrar" blockGap=8
        //% strip.defl=LEDs
        //% weight=79
        //% parts="neopixel"
        show() {
            // only supported in beta
            // ws2812b.setBufferMode(this.pin, this._mode);
            ws2812b.sendBuffer(this.buf, this.pin);
        }

        /**
         * Desliga todos os LEDs.
         * É necessário chamar ``show`` para que as alterações fiquem visíveis.
        */
        //% blockId="neopixel_clear" block="%strip|limpar"
        //% strip.defl=LEDs
        //% weight=76
        //% parts="neopixel"
        clear(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
        }

        /**
         * Obtém o número de pixels declarados na faixa.
        */
        //% blockId="neopixel_length" block="%strip|comprimento" blockGap=8
        //% strip.defl=LEDs
        //% weight=60 advanced=true
        length() {
            return this._length;
        }

        /**
         * Define o brilho da faixa. Esse ajuste se aplica apenas às operações futuras.
         * @param brightness nível de brilho dos LEDs entre 0 e 255. ex: 255
        */
        //% blockId="neopixel_set_brightness" block="%strip|definir brilho %brightness" blockGap=8
        //% strip.defl=LEDs
        //% weight=59
        //% parts="neopixel" advanced=true
        setBrightness(brightness: number): void {
            this.brightness = brightness & 0xff;
        }

        /**
         * Aplica o brilho às cores atuais usando uma função de suavização quadrática.
        */
        //% blockId="neopixel_each_brightness" block="%strip|suavizar brilho" blockGap=8
        //% strip.defl=LEDs
        //% weight=58
        //% parts="neopixel" advanced=true
        easeBrightness(): void {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            const br = this.brightness;
            const buf = this.buf;
            const end = this.start + this._length;
            const mid = Math.idiv(this._length, 2);
            for (let i = this.start; i < end; ++i) {
                const k = i - this.start;
                const ledoffset = i * stride;
                const br = k > mid
                    ? Math.idiv(255 * (this._length - 1 - k) * (this._length - 1 - k), (mid * mid))
                    : Math.idiv(255 * k * k, (mid * mid));
                const r = (buf[ledoffset + 0] * br) >> 8; buf[ledoffset + 0] = r;
                const g = (buf[ledoffset + 1] * br) >> 8; buf[ledoffset + 1] = g;
                const b = (buf[ledoffset + 2] * br) >> 8; buf[ledoffset + 2] = b;
                if (stride == 4) {
                    const w = (buf[ledoffset + 3] * br) >> 8; buf[ledoffset + 3] = w;
                }
            }
        }

        /**
         * Cria um intervalo de LEDs.
         * @param start posição inicial na faixa de LEDs para começar o intervalo
         * @param length número de LEDs no intervalo. ex: 4
        */
        //% weight=89
        //% blockId="neopixel_range" block="%strip|intervalo de %start|com %length|LEDs"
        //% strip.defl=LEDs
        //% parts="neopixel"
        //% blockSetVariable=intervalo
        range(start: number, length: number): Strip {
            start = start >> 0;
            length = length >> 0;
            let strip = new Strip();
            strip.buf = this.buf;
            strip.pin = this.pin;
            strip.brightness = this.brightness;
            strip.start = this.start + Math.clamp(0, this._length - 1, start);
            strip._length = Math.clamp(0, this._length - (strip.start - this.start), length);
            strip._matrixWidth = 0;
            strip._mode = this._mode;
            return strip;
        }

        /**
         * Desloca os LEDs para frente e limpa com zeros.
         * É necessário chamar ``show`` para que as alterações fiquem visíveis.
         * @param offset número de pixels a deslocar para frente, ex: 1
        */
        //% blockId="neopixel_shift" block="%strip|deslocar pixels em %offset" blockGap=8
        //% strip.defl=LEDs
        //% weight=40
        //% parts="neopixel"
        shift(offset: number = 1): void {
            offset = offset >> 0;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.shift(-offset * stride, this.start * stride, this._length * stride)
        }

        /**
         * Rotaciona os LEDs para frente.
         * É necessário chamar ``show`` para que as alterações fiquem visíveis.
         * @param offset número de pixels a rotacionar para frente, ex: 1
        */
        //% blockId="neopixel_rotate" block="%strip|rotacionar pixels em %offset" blockGap=8
        //% strip.defl=LEDs
        //% weight=39
        //% parts="neopixel"
        rotate(offset: number = 1): void {
            offset = offset >> 0;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.rotate(-offset * stride, this.start * stride, this._length * stride)
        }

        /**
         * Define o pino ao qual o NeoPixel está conectado. O padrão é o P0.
        */
        //% weight=10
        //% parts="neopixel" advanced=true
        setPin(pin: DigitalPin): void {
            this.pin = pin;
            pins.digitalWritePin(this.pin, 0);
            // don't yield to avoid races on initialization
        }

        /**
         * Estima a corrente elétrica (mA) consumida pela configuração atual dos LEDs.
        */
        //% weight=9 blockId=neopixel_power block="%strip|potência (mA)"
        //% strip.defl=LEDs
        //% advanced=true
        power(): number {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            const end = this.start + this._length;
            let p = 0;
            for (let i = this.start; i < end; ++i) {
                const ledoffset = i * stride;
                for (let j = 0; j < stride; ++j) {
                    p += this.buf[i + j];
                }
            }
            return Math.idiv(this.length() * 7, 10) /* 0.7mA per neopixel */
                + Math.idiv(p * 480, 10000); /* rought approximation */
        }

        private setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            if (this._mode === NeoPixelMode.RGB_RGB) {
                this.buf[offset + 0] = red;
                this.buf[offset + 1] = green;
            } else {
                this.buf[offset + 0] = green;
                this.buf[offset + 1] = red;
            }
            this.buf[offset + 2] = blue;
        }

        private setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            const end = this.start + this._length;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            for (let i = this.start; i < end; ++i) {
                this.setBufferRGB(i * stride, red, green, blue)
            }
        }
        private setAllW(white: number) {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            let end = this.start + this._length;
            for (let i = this.start; i < end; ++i) {
                let ledoffset = i * 4;
                buf[ledoffset + 3] = white;
            }
        }
        private setPixelRGB(pixeloffset: number, rgb: number): void {
            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            let stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            pixeloffset = (pixeloffset + this.start) * stride;

            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            let br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            this.setBufferRGB(pixeloffset, red, green, blue)
        }
        private setPixelW(pixeloffset: number, white: number): void {
            if (this._mode !== NeoPixelMode.RGBW)
                return;

            if (pixeloffset < 0
                || pixeloffset >= this._length)
                return;

            pixeloffset = (pixeloffset + this.start) * 4;

            let br = this.brightness;
            if (br < 255) {
                white = (white * br) >> 8;
            }
            let buf = this.buf;
            buf[pixeloffset + 3] = white;
        }
    }

    /**
     * Cria um novo driver NeoPixel para `numleds` LEDs.
     * @param pin o pino ao qual o NeoPixel está conectado.
     * @param numleds número de LEDs na faixa, ex: 24, 30, 60, 64
    */
    //% blockId="neopixel_create" block="LED RGB no pino %pin|com %numleds|LEDs como %mode"
    //% weight=90 blockGap=8
    //% parts="neopixel"
    //% pin.defl=DigitalPin.P15
    //% numleds.defl=4
    //% trackArgs=0,2
    //% blockSetVariable=LEDs
    export function create(pin: DigitalPin, numleds: number, mode: NeoPixelMode): Strip {
        let strip = new Strip();
        let stride = mode === NeoPixelMode.RGBW ? 4 : 3;
        strip.buf = pins.createBuffer(numleds * stride);
        strip.start = 0;
        strip._length = numleds;
        strip._mode = mode || NeoPixelMode.RGB;
        strip._matrixWidth = 0;
        strip.setBrightness(128)
        strip.setPin(pin)
        return strip;
        
    }

    /**
     * Converte os canais vermelho, verde e azul em uma cor RGB.
     * @param red valor do canal vermelho entre 0 e 255. ex: 255
     * @param green valor do canal verde entre 0 e 255. ex: 255
     * @param blue valor do canal azul entre 0 e 255. ex: 255
    */
    //% weight=1
    //% blockId="neopixel_rgb" block="vermelho %red|verde %green|azul %blue"
    //% advanced=true
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Obtém o valor RGB de uma cor conhecida.
    */
    //% weight=2 blockGap=8
    //% blockId="neopixel_colors" block="%color"
    //% advanced=true
    export function colors(color: NeoPixelColors): number {
        return color;
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    /**
     * Converte valores de matiz, saturação e luminosidade em uma cor RGB.
     * @param h matiz de 0 a 360
     * @param s saturação de 0 a 99
     * @param l luminosidade de 0 a 99
    */
    //% blockId=neopixelHSL block="Matiz %h|saturação %s|luminosidade %l"
    export function hsl(h: number, s: number, l: number): number {
        h = Math.round(h);
        s = Math.round(s);
        l = Math.round(l);

        h = h % 360;
        s = Math.clamp(0, 99, s);
        l = Math.clamp(0, 99, l);
        let c = Math.idiv((((100 - Math.abs(2 * l - 100)) * s) << 8), 10000); //chroma, [0,255]
        let h1 = Math.idiv(h, 60);//[0,6]
        let h2 = Math.idiv((h - h1 * 60) * 256, 60);//[0,255]
        let temp = Math.abs((((h1 % 2) << 8) + h2) - 256);
        let x = (c * (256 - (temp))) >> 8;//[0,255], second largest component of this color
        let r$: number;
        let g$: number;
        let b$: number;
        if (h1 == 0) {
            r$ = c; g$ = x; b$ = 0;
        } else if (h1 == 1) {
            r$ = x; g$ = c; b$ = 0;
        } else if (h1 == 2) {
            r$ = 0; g$ = c; b$ = x;
        } else if (h1 == 3) {
            r$ = 0; g$ = x; b$ = c;
        } else if (h1 == 4) {
            r$ = x; g$ = 0; b$ = c;
        } else if (h1 == 5) {
            r$ = c; g$ = 0; b$ = x;
        }
        let m = Math.idiv((Math.idiv((l * 2 << 8), 100) - c), 2);
        let r = r$ + m;
        let g = g$ + m;
        let b = b$ + m;
        return packRGB(r, g, b);
    }

    export enum HueInterpolationDirection {
        Clockwise,
        CounterClockwise,
        Shortest
    }
}