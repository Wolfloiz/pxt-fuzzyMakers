

fuzzyBot: Carro Inteligente
Uma extensão MakeCode para programar um carro inteligente educacional.

Diagrama de Fiação
O diagrama será exibido em breve.

# Motor
Controle o fuzzyBot para ir para frente, para trás, virar à esquerda e virar à direita.

## Controlar o carro para frente

```
fuzzyBot.motorRun(fuzzyBot.Motors.M1, fuzzyBot.Dir.CW, 120)
fuzzyBot.motorRun(fuzzyBot.Motors.M2, fuzzyBot.Dir.CW, 120)
```
## Controlar o carro para trás

```
fuzzyBot.motorRun(fuzzyBot.Motors.M1, fuzzyBot.Dir.CCW, 120)
fuzzyBot.motorRun(fuzzyBot.Motors.M2, fuzzyBot.Dir.CCW, 120)
```

## Controlar o carro para virar à esquerda

```
fuzzyBot.motorRun(fuzzyBot.Motors.M1, fuzzyBot.Dir.CCW, 80)
fuzzyBot.motorRun(fuzzyBot.Motors.M2, fuzzyBot.Dir.CW, 120)
```

## Controlar o carro para virar à direita

```
fuzzyBot.motorRun(fuzzyBot.Motors.M1, fuzzyBot.Dir.CW, 120)
fuzzyBot.motorRun(fuzzyBot.Motors.M2, fuzzyBot.Dir.CCW, 80)
```

## Parar o motor esquerdo do fuzzyBot

```
fuzzyBot.motorStop(fuzzyBot.Motors.M1)
```

## Parar o motor direito do fuzzyBot

```
fuzzyBot.motorStop(fuzzyBot.Motors.M2)
```

## Parar os motores esquerdo e direito do fuzzyBot

```
fuzzyBot.motorStop(fuzzyBot.Motors.All)
```

# Servo

## Definir o servo1 do fuzzyBot para 90°

```
fuzzyBot.servoRun(fuzzyBot.Servos.S1, 90)
```

## Definir o servo2 do fuzzyBot para 120°

```
fuzzyBot.servoRun(fuzzyBot.Servos.S2, 120)
```

# Ler sensor de linha

## Ler o sensor de linha esquerdo

```
serial.writeNumber(fuzzyBot.readPatrol(fuzzyBot.Patrol.PatrolLeft))
```

## Ler o sensor de linha do meio

```
serial.writeNumber(fuzzyBot.readPatrol(fuzzyBot.Patrol.PatrolMiddle))
```

## Ler o sensor de linha direito

```
serial.writeNumber(fuzzyBot.readPatrol(fuzzyBot.Patrol.PatrolRight))
```

# Evento do sensor de linha

## Quando o sensor de linha esquerdo está em alta

```
fuzzyBot.ltEvent(fuzzyBot.Patrol1.PatrolRight, fuzzyBot.Voltage.High, function () {
    serial.writeNumber(1)
})
```

## Quando o sensor de linha esquerdo está em baixa

```
fuzzyBot.ltEvent(fuzzyBot.Patrol1.PatrolRight, fuzzyBot.Voltage.Low, function () {
    serial.writeNumber(0)
})
```

#Luzes LED

## Ligar a luz LED esquerda

```
fuzzyBot.writeLED(fuzzyBot.LED.LEDLeft, fuzzyBot.LEDswitch.turnOn)
```

## Desligar a luz LED esquerda

```
fuzzyBot.writeLED(fuzzyBot.LED.LEDLeft, fuzzyBot.LEDswitch.turnOff)
```

## Ligar a luz LED direita

```
fuzzyBot.writeLED(fuzzyBot.LED.LEDRight, fuzzyBot.LEDswitch.turnOn)
```

## Desligar a luz LED direita

```
fuzzyBot.writeLED(fuzzyBot.LED.LEDRight, fuzzyBot.LEDswitch.turnOff)
```

Licença MIT

Alvos suportados para PXT/microbit
* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
