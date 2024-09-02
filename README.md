

Bot: Carro Inteligente
Uma extensão MakeCode para programar um carro inteligente educacional.

Diagrama de Fiação
O diagrama será exibido em breve.

# Motor
Controle o Bot para ir para frente, para trás, virar à esquerda e virar à direita.

## Controlar o carro para frente

```
Bot.motorRun(Bot.Motors.M1, Bot.Dir.CW, 120)
Bot.motorRun(Bot.Motors.M2, Bot.Dir.CW, 120)
```
## Controlar o carro para trás

```
Bot.motorRun(Bot.Motors.M1, Bot.Dir.CCW, 120)
Bot.motorRun(Bot.Motors.M2, Bot.Dir.CCW, 120)
```

## Controlar o carro para virar à esquerda

```
Bot.motorRun(Bot.Motors.M1, Bot.Dir.CCW, 80)
Bot.motorRun(Bot.Motors.M2, Bot.Dir.CW, 120)
```

## Controlar o carro para virar à direita

```
Bot.motorRun(Bot.Motors.M1, Bot.Dir.CW, 120)
Bot.motorRun(Bot.Motors.M2, Bot.Dir.CCW, 80)
```

## Parar o motor esquerdo do Bot

```
Bot.motorStop(Bot.Motors.M1)
```

## Parar o motor direito do Bot

```
Bot.motorStop(Bot.Motors.M2)
```

## Parar os motores esquerdo e direito do Bot

```
Bot.motorStop(Bot.Motors.All)
```

# Servo

## Definir o servo1 do Bot para 90°

```
Bot.servoRun(Bot.Servos.S1, 90)
```

## Definir o servo2 do Bot para 120°

```
Bot.servoRun(Bot.Servos.S2, 120)
```

# Ler sensor de linha

## Ler o sensor de linha esquerdo

```
serial.writeNumber(Bot.readPatrol(Bot.Patrol.PatrolLeft))
```

## Ler o sensor de linha do meio

```
serial.writeNumber(Bot.readPatrol(Bot.Patrol.PatrolMiddle))
```

## Ler o sensor de linha direito

```
serial.writeNumber(Bot.readPatrol(Bot.Patrol.PatrolRight))
```

# Evento do sensor de linha

## Quando o sensor de linha esquerdo está em alta

```
Bot.ltEvent(Bot.Patrol1.PatrolRight, Bot.Voltage.High, function () {
    serial.writeNumber(1)
})
```

## Quando o sensor de linha esquerdo está em baixa

```
Bot.ltEvent(Bot.Patrol1.PatrolRight, Bot.Voltage.Low, function () {
    serial.writeNumber(0)
})
```

#Luzes LED

## Ligar a luz LED esquerda

```
Bot.writeLED(Bot.LED.LEDLeft, Bot.LEDswitch.turnOn)
```

## Desligar a luz LED esquerda

```
Bot.writeLED(Bot.LED.LEDLeft, Bot.LEDswitch.turnOff)
```

## Ligar a luz LED direita

```
Bot.writeLED(Bot.LED.LEDRight, Bot.LEDswitch.turnOn)
```

## Desligar a luz LED direita

```
Bot.writeLED(Bot.LED.LEDRight, Bot.LEDswitch.turnOff)
```

Licença MIT

Alvos suportados para PXT/microbit
* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
