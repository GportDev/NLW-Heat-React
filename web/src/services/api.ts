// configuração do serviço entre front e back-end usando axios

import axios from "axios";

export const api = axios.create({
  baseURL: 'http://localhost:4000',
})

