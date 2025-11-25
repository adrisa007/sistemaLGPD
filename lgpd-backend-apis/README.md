# LGPD Backend APIs

Este repositório contém o back-end completo para o Sistema de Conformidade à Lei Geral de Proteção de Dados (LGPD), desenvolvido em Node.js e implantado como microsserviços no Google Cloud Run.

## 1. Arquitetura do Projeto

O back-end é composto por cinco microsserviços distintos, cada um responsável por uma fase do ciclo de vida da LGPD...

| Microsserviço | Função Principal | Fases LGPD |
| :--- | :--- | :--- |
| `api-governanca` | Configuração de Entidades e Cargos. | FASE 1 |
| `api-uso-dados` | Ciclo de Vida do Dado, Filtros de Acesso e Cálculo de Prazo. | FASE 2 |
| `api-auditoria` | Registro assíncrono de Log de Acesso. | FASE 2 |
| `api-solicitacoes` | Registro e Gestão dos Direitos do Titular. | FASE 3 |
| `api-relatorios` | Consulta de Logs, Auditoria e Prova Final de Descarte. | FASE 4 |

## 4. Deploy e CI/CD (Google Cloud)

O deploy é totalmente automatizado via **Google Cloud Build** e **Cloud Run**, utilizando o arquivo `cloudbuild.yaml`.

### 4.1. Variáveis de Substituição (Cloud Build)

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `_DB_USER` | Usuário do Cloud SQL | `root` |
| `_API_AUDITORIA_URL` | URL da API de Auditoria (para `api-uso-dados`) | `https://api-auditoria-xxxx.run.app` |
...


...