/**
 * Biblioteca de registro de dados do Fuzzy bits
 */
/**
 * This library is translation to use with kits of fuzzy bits and Fuzzy bits plus
 * based on datalogger
 */

//% block="Registro de dados" weight=300 color=#378250 icon="\uf0ce"
namespace table {

    class Cell extends datalogger.ColumnValue {
        constructor(column: string, value: any)
        {
            super(column, value)
        }
    }

        /**
         * Uma coluna e um valor para registrar na memória do microbit
         * @param coluna que será atribuido
         * @param valor que será armazenado
         * @returns O valor armazenado na memória do microbit 
         */
    //% block="coluna $column valor $value"
    //% value.shadow=math_number
    //% column.shadow=datalogger_columnfield
    //% blockId=dataloggercreatecolumnvaluefuzzy
    //% weight=80 help=datalogger/create-cv
    export function createCell(column: string, value: any): Cell {
        return new Cell(column, value);
    }

    /**
     * Registra dados na memória do microbit
     * @param data1 Primeira coluna e valor a serem registrados
     * @param data2 [opcional] Segunda coluna e valor a serem registrados
     * @param data3 [opcional] Terceira coluna e valor a serem registrados
     * @param data4 [opcional] Quarta coluna e valor a serem registrados
     * @param data5 [opcional] Quinta coluna e valor a serem registrados
     * @param data6 [opcional] Sexta coluna e valor a serem registrados
     * @param data7 [opcional] Sétima coluna e valor a serem registrados
     * @param data8 [opcional] Oitava coluna e valor a serem registrados
     * @param data9 [opcional] Nona coluna e valor a serem registrados
     * @param data10 [opcional] Décima coluna e valor a serem registrados
    */
    //% block="Registrar dados $data1||$data2 $data3 $data4 $data5 $data6 $data7 $data8 $data9 $data10"
    //% blockId=dataloggerlogfuzzy
    //% data1.shadow=dataloggercreatecolumnvalue
    //% data2.shadow=dataloggercreatecolumnvalue
    //% data3.shadow=dataloggercreatecolumnvalue
    //% data4.shadow=dataloggercreatecolumnvalue
    //% data5.shadow=dataloggercreatecolumnvalue
    //% data6.shadow=dataloggercreatecolumnvalue
    //% data7.shadow=dataloggercreatecolumnvalue
    //% data8.shadow=dataloggercreatecolumnvalue
    //% data9.shadow=dataloggercreatecolumnvalue
    //% data10.shadow=dataloggercreatecolumnvalue
    //% inlineInputMode="variable"
    //% inlineInputModeLimit=1
    //% weight=100 help=datalogger/log
    export function log(
        data1: datalogger.ColumnValue,
        data2?: datalogger.ColumnValue,
        data3?: datalogger.ColumnValue,
        data4?: datalogger.ColumnValue,
        data5?: datalogger.ColumnValue,
        data6?: datalogger.ColumnValue,
        data7?: datalogger.ColumnValue,
        data8?: datalogger.ColumnValue,
        data9?: datalogger.ColumnValue,
        data10?: datalogger.ColumnValue
    ): void {
        datalogger.log(data1,data2, data3, data4, data5, data6, data7, data8, data9, data10);
    }

    /**
     * Register an event to run when no more data can be logged.
     * @param handler code to run when the log is full and no more data can be stored.
     */
    //% block="Quando Registro estiver completamente cheio"
    //% blockId="onlogfullfuzzy"
    //% weight=40 help=datalogger/on-log-full
    export function onLogFull(handler: () => void): void {
       datalogger.onLogFull(handler);
    }
    /**
    * Remove todos os registros, incluindo nomes das colunas 
    * @param deleteType optional set whether a deletion will be fast or full
    */
    //% block="Deletar registros||$deleteType"
    //% blockId=dataloggerdeletelogfuzzy
    //% weight=60 help=datalogger/delete-log
    export function deleteLog(deleteType?: datalogger.DeleteType): void {
        datalogger.deleteLog(deleteType);
    }


    /**
     * Atribui formato para timestamps
     * @param Formato no qual o carimbo de data/hora será exibido. Definir FlashLogTimeStampFormat.None desativará o carimbo de data/hora.
     */
    //% block="Formatar carimbo de data/hora $format"
    //% blockId=dataloggertoggleincludetimestampfuzzy
    //% format.defl=FlashLogTimeStampFormat.None
    //% weight=30 help=datalogger/include-timestamp
    export function includeTimestamp(format: FlashLogTimeStampFormat): void {
        datalogger.includeTimestamp(format);
    }

    /**
     * Escolha se os dados vão ser copiados para a porta serial ou não.
     * @param Se for verdadeiro, o dados registrado será mostrado na porta serial
     */
    //% block="Copiar dados para porta serial $on"
    //% blockId=dataloggertogglemirrortoserialfuzzy
    //% on.shadow=toggleOnOff
    //% on.defl=false
    //% weight=25 help=datalogger/mirror-to-serial
    export function mirrorToSerial(on: boolean): void {
        // TODO:/note intentionally does not have group, as having the same group for all
        // blocks in a category causes the group to be elided.
        datalogger.mirrorToSerial(on);
    }
}
