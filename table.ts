/**
 * Biblioteca de registro de dados do Fuzzy bits
 */
/**
 * This library is translation to use with kits of fuzzy bits and Fuzzy bits plus
 * based on datalogger
 */

//% block="Registro de dados" weight=300 color=#378250 icon="\uf0ce"
namespace table {

    export enum DeleteType {
        //% block="rápido"
        Fast,
        //% block="completo"
        Full
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
    export function createCell(column: string, value: any): datalogger.ColumnValue {
        return new datalogger.ColumnValue(column, value);
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
    //% data1.shadow=dataloggercreatecolumnvaluefuzzy
    //% data2.shadow=dataloggercreatecolumnvaluefuzzy
    //% data3.shadow=dataloggercreatecolumnvaluefuzzy
    //% data4.shadow=dataloggercreatecolumnvaluefuzzy
    //% data5.shadow=dataloggercreatecolumnvaluefuzzy
    //% data6.shadow=dataloggercreatecolumnvaluefuzzy
    //% data7.shadow=dataloggercreatecolumnvaluefuzzy
    //% data8.shadow=dataloggercreatecolumnvaluefuzzy
    //% data9.shadow=dataloggercreatecolumnvaluefuzzy
    //% data10.shadow=dataloggercreatecolumnvaluefuzzy
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
     * Defina colunas para futuro registro de dados
     * @param col1  "Nome (título) para a primeira coluna que vamos adicionar"
     * @param col2  "Nome (título) para a segunda coluna que vamos adicionar"
     * @param col3  "Nome (título) para a terceira coluna que vamos adicionar"
     * @param col4  "Nome (título) para a quarta coluna que vamos adicionar"
     * @param col5  "Nome (título) para a quinta coluna que vamos adicionar"
     * @param col6  "Nome (título) para a sexta coluna que vamos adicionar"
     * @param col7  "Nome (título) para a sétima coluna que vamos adicionar"
     * @param col8  "Nome (título) para a oitava coluna que vamos adicionar"
     * @param col9  "Nome (título) para a nona coluna que vamos adicionar"
     * @param col10 "Nome (título) para a décima coluna que vamos adicionar"
    */
    //% block="Adicionar colunas ao registro de dados $col1||$col2 $col3 $col4 $col5 $col6 $col7 $col8 $col9 $col10"
    //% blockId=dataloggersetcolumntitlesfuzzy
    //% inlineInputMode="variable"
    //% inlineInputModeLimit=1
    //% weight=70 help=datalogger/set-column-titles
    //% col1.shadow=datalogger_columnfield
    //% col2.shadow=datalogger_columnfield
    //% col3.shadow=datalogger_columnfield
    //% col4.shadow=datalogger_columnfield
    //% col5.shadow=datalogger_columnfield
    //% col6.shadow=datalogger_columnfield
    //% col7.shadow=datalogger_columnfield
    //% col8.shadow=datalogger_columnfield
    //% col9.shadow=datalogger_columnfield
    //% col10.shadow=datalogger_columnfield
    export function setColumnTitles(
        col1: string,
        col2?: string,
        col3?: string,
        col4?: string,
        col5?: string,
        col6?: string,
        col7?: string,
        col8?: string,
        col9?: string,
        col10?: string
    ): void {
       datalogger.setColumnTitles(col1, col2, col3, col4, col5, col6, col7, col8, col9, col10);
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
    export function deleteLog(deleteType?: DeleteType): void {
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
