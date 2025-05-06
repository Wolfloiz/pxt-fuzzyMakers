declare const enum sentry_vision_e {
    //% block="Cor"
    kVisionColor = 1,
    //% block="Blob"
    kVisionBlob = 2,
    //% block="AprilTag" 
    kVisionAprilTag = 3,
    //% block="Linha"
    kVisionLine = 4,
    //% block="Aprendizado"
    kVisionLearning = 5,
    //% block="Cartão"
    kVisionCard = 6,
    //% block="Rosto"
    kVisionFace = 7,
    //% block="20Class"
    kVision20Classes = 8,
    //% block="QRCode"
    kVisionQrCode = 9,
    //% block="Rastrear Objeto"
    //% blockHidden=true  
    kVisionObjTrack = 10,
    //% block="Detecção de Movimento"
    kVisionMotionDetect = 11,
    //% block="Visão Personalizada"
    kVisionCustom = 12,
    //% blockHidden=true
    kVisionMaxType
}

declare const enum sentry_mode_e {
    //% block="Modo Serial"
    kSerialMode = 0,
    //% block="Modo I2C"
    kI2CMode = 1,
    //% blockHidden=true 
    kUnknownMode,
}

declare const enum card_label_e {
    //% block="Frente"
    kCardForward = 1,
    //% block="Esquerda"
    kCardLeft = 2,
    //% block="Direita"
    kCardRight = 3,
    //% block="Dar a Volta"
    kCardTurnAround = 4,
    //% block="Estacionar"
    kCardPark = 5,
    //% block="Luz Verde"
    kCardGreenLight = 6,
    //% block="Luz Vermelha"
    kCardRedLight = 7,
    //% block="Velocidade 40"
    kCardSpeed40 = 8,
    //% block="Velocidade 60"
    kCardSpeed60 = 9,
    //% block="Velocidade 80"
    kCardSpeed80 = 10,
    //% block="Check"
    kCardCheck = 11,
    //% block="Cruz"
    kCardCross = 12,
    //% block="Círculo"
    kCardCircle = 13,
    //% block="Quadrado"
    kCardSquare = 14,
    //% block="Triangulo"
    kCardTriangle = 15,
    //% block="Mais"
    kCardPlus = 16,
    //% block="Menos"
    kCardMinus = 17,
    //% block="Dividir"
    kCardDivide = 18,
    //% block="Igual"
    kCardEqual = 19,
    //% block="0️⃣ 0"
    kCardZero = 20,
    //% block="1️⃣ 1"
    kCardOne = 21,
    //% block="2️⃣ 2"
    kCardTwo = 22,
    //% block="3️⃣ 3"
    kCardThree = 23,
    //% block="4️⃣ 4"
    kCardFour = 24,
    //% block="5️⃣ 5"
    kCardFive = 25,
    //% block="6️⃣ 6"
    kCardSix = 26,
    //% block="7️⃣ 7"
    kCardSeven = 27,
    //% block="8️⃣ 8"
    kCardEight = 28,
    //% block="9️⃣ 9"
    kCardNine = 29,
    //% block="A"
    kCardA = 31,
    //% block="B"
    kCardB = 32,
    //% block="C"
    kCardC = 33,
    //% block="D"
    kCardD = 34,
    //% block="E"
    kCardE = 35,
    //% block="F"
    kCardF = 36,
    //% block="G"
    kCardG = 37,
    //% block="H"
    kCardH = 38,
    //% block="I"
    kCardI = 39,
    //% block="J"
    kCardJ = 40,
    //% block="K"
    kCardK = 41,
    //% block="L"
    kCardL = 42,
    //% block="M"
    kCardM = 43,
    //% block="N"
    kCardN = 44,
    //% block="O"
    kCardO = 45,
    //% block="P"
    kCardP = 46,
    //% block="Q"
    kCardQ = 47,
    //% block="R"
    kCardR = 48,
    //% block="T"
    kCardS = 49,
    //% block="S"
    kCardT = 50,
    //% block="V"
    kCardU = 51,
    //% block="U"
    kCardV = 52,
    //% block="W"
    kCardW = 53,
    //% block="X"
    kCardX = 54,
    //% block="Y"
    kCardY = 55,
    //% block="Z"
    kCardZ = 56
}

declare const enum class20_label_e {
    //% block="Avião"
    kAirplane = 1,
    //% block="Bicicleta"
    kBicycle = 2,
    //% block="Pássaro"
    kBird = 3,
    //% block="Barco"
    kBoat = 4,
    //% block="Garrafa"
    kBottle = 5,
    //% block="Ônibus"
    kBus = 6,
    //% block="Carro"
    kCar = 7,
    //% block="Gato"
    kCat = 8,
    //% block="Cadeira"
    kChair = 9,
    //% block="Vaca"
    kCow = 10,
    //% block="Mesa"
    kTable = 11,
    //% block="Cachorro"
    kDog = 12,
    //% block="Cavalo"
    kHorse = 13,
    //% block="Motocicleta"
    kMotorBike = 14,
    //% block="Pessoa"
    kPerson = 15,
    //% block="Planta"
    kPlant = 16,
    //% block="Ovelha"
    kSheep = 17,
    //% block="Sofá"
    kSofa = 18,
    //% block="Trem"
    kTrain = 19,
    //% block="Monitor"
    kMonitor = 20
}

declare const enum color_label_e {
    //% block="Preto"
    kColorBlack = 1,
    //% block="Branco"
    kColorWhite = 2,
    //% block="Vermelho"
    kColorRed = 3,
    //% block="Verde"
    kColorGreen = 4,
    //% block="Azul"
    kColorBlue = 5,
    //% block="Amarelo"
    kColorYellow = 6,
    //% block="Desconhecido"
    kColorUnkown = 7
}

declare const enum SentryStatus {
    //% block="habilitada"
    Enable = 1,
    //% block="desabilitada"
    Disable = 0,
}

declare const enum sentry_obj_info_e {
    //% block="Status"
    kStatus = 0,
    //% block="Posição X"
    kXValue = 1,
    //% block="Posição Y"
    kYValue = 2,
    //% block="Largura"
    kWidthValue = 3,
    //% block="Altura"
    kHeightValue = 4,
    //% block="Rótulo"
    kLabel = 5,
    //% block="Canal Vermelho"
    kRValue = 6,
    //% block="Canal Verde"
    kGValue = 7,
    //% block="Canal Azul"
    kBValue = 8,
}

declare const enum sentry_gen_info_e {
    //% block="Horizontal"
    kXValue = 1,
    //% block="Vertical"
    kYValue,
    //% block="Largura"
    kWidthValue,
    //% block="Altura"
    kHeightValue,
    //% block="Rótulo"
    kLabel
}

declare const enum sentry_custom_info_e {
    //% block="reult1"
    kXValue = 1,
    //% block="reult2"
    kYValue,
    //% block="reult3"
    kWidthValue,
    //% block="reult4"
    kHeightValue,
    //% block="reult5"
    kLabel
}
declare const enum sentry_Line_info_e {
    //% block="Coordenada X do ponto final"
    kXValue = 1,
    //% block="Coordenada Y do ponto final"
    kYValue,
    //% block="Coordenada X do ponto inicial"
    kWidthValue,
    //% block="Coordenada Y do ponto inicial"
    kHeightValue,
    //% block="Ângulo de inclinação"
    kLabel
}

declare const enum sentry_qr_info_e {
    //% block="Horizontal"
    kXValue = 1,
    //% block="Vertical"
    kYValue,
    //% block="Largura"
    kWidthValue,
    //% block="Altura"
    kHeightValue
}

declare const enum sentry_color_info_e {
    //% block="Canal Vermelho"
    kRValue = 6,
    //% block="Canal Verde"
    kGValue = 7,
    //% block="Canal Azul"
    kBValue = 8,
    //% block="Rótulo"
    kLabel = 5
}

declare const enum sentry_addr_e {
    //% block="0x60"
    ADDR1 = 0x60,
    //% block="0x61"
    ADDR2 = 0x61,
    //% block="0x62"
    ADDR3 = 0x62,
    //% block="0x63"
    ADDR4 = 0x63,
}