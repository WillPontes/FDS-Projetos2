# Arquitetura Feature-Based

Cada feature encapsula todo o código relacionado ao seu domínio: UI, dados e lógica.

## Estrutura de uma feature

```
features/
  <feature>/
    api/
      query-keys.ts     chaves do React Query
      requests.ts       funções de requisição HTTP
      types.ts          tipos de request/response
    components/
      <Component>/
        <Component>.tsx
        index.ts
    constants.ts        constantes do domínio
    hooks/
      <useGetX>/        hook de leitura
        <useGetX>.ts
        index.ts
      <useCreateX>/     hook de mutação
        <useCreateX>.ts
        index.ts
    pages/
      <Page>/
        <Page>.tsx
        index.ts
    schemas/
      <entity>-schema.ts  validação Zod
    index.ts            barrel export público da feature
```

## Convenções

| Elemento | Padrão |
|---|---|
| Arquivo | `PascalCase.tsx` / `PascalCase.ts` |
| Pasta | `PascalCase` para componentes/hooks/pages |
| Componente | `export const X = () => {}` |
| Hook de query | `useGetX` |
| Hook de mutation | `useCreateX`, `useUpdateX`, `useDeleteX` |
| Types | `type X = {}` (não `interface`) |
| Barrel | `/{NOME}/index.ts` re-exportando `{NOME}.tsx` |

## Features atuais

- **fleet** — gestão de veículos (CRUD)
- **home** — página inicial
- **users** — listagem de usuários

## Constantes globais

Constantes compartilhadas entre features ficam em `src/constants/`.  
Constantes específicas de uma feature ficam em `src/features/<feature>/constants.ts`.
