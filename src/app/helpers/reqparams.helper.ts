export class ReqParams {
    /**
     * Enviar parâmetros (query) na URL da requisição.
     * @param key Chave do parâmetro.
     * @param value Valor do parâmetro.
     */
    constructor(
        public key: string,
        public value: string
    ) { }

}