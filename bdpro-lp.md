# Plano de Implementação: Landing Page BD PRO

**Diretriz de Sincronização:** Todas as atualizações descritas neste documento devem ser rigorosamente refletidas em `next/pages/bdpro.js` e `next/public/locales/pt/bdpro.json` para manter a paridade entre o planejamento e a implementação.

Este documento descreve a estrutura técnica e os componentes React para a implementação da landing page do produto BD PRO, seguindo os padrões do repositório e utilizando Chakra UI v1.8.8.

## 1. Estrutura Geral da Página

A página será implementada em `next/pages/pro.js` (ou similar) utilizando o template principal.

- **Template:** `MainPageTemplate` (`next/components/templates/main.js`)
- **Container Principal:** `VStack` com `width="100%"` e `spacing={0}`.
- **Internacionalização:** Utilizar `next-i18next` para suporte a pt/en.

## 2. Mapeamento de Telas e Componentes

### Tela 1: Hero (Diferencial e Destaque)
Definição do produto com foco em dados tratados e curadoria.

- **Layout:** `VStack` para alinhamento central, `Stack` (row/column responsivo) para textos e boxes laterais.
- **Mensagem Central:**
  - `Display`: "o maior datalakehouse público da américa latina com dados atualizados e com curadoria"
  - `BodyText`: "A BD é uma Organização Sem Fins Lucrativos pioneira na construção infraestrutura de dados públicos para o benefício público. Nosso produto de dados tira a dor de cabeça da necessidade de construir e manter códigos de coleta, tratamento, testagem e atualização de dados e colabora com o impacto da ONG."
  - `LabelText`: "Mais de 25k de pesquisadores, servidores públicos e empresas utilizam o datalake house da BD mensalmente."
- **Componentes Laterais (Esquerda e Direita):**
  - Boxes randômicos com highlights para os principais conjuntos de dados.
  - Efeito *on hover*: Exibir texto explicativo ao passar o mouse sobre o título.
  - **Destaques:**
    - **Cadastros de CNPJs**: Cadastro de CNPJs da Receita Federal atualizado mensalmente.
    - **Cadastros de Obras**: Cadastro de obras da Receita Federal atualizado diariamente.
    - **Cadastros do Datasus**: CNES, SIH, SIA... Atualizado mensalmente.
    - **Cadastro Geral de Empregos**: Dados de emprego e mercado de trabalho.
    - **Comex Stat**: Dados de comércio exterior.

### Tela 2: Apresentação do Produto (Funcionalidades)
Tabs horizontais com GIFs demonstrativos.

- **Layout:** `Tabs` (Chakra UI) com `variant="unstyled"`.
- **Componentes:**
  - `TabList`: Centralizado, contendo 4 `GreenTab` (`next/components/atoms/GreenTab.js`).
  - `TabPanels`: Contendo as `TabPanel` com os GIFs.
  - `ChakraImage`: Para exibição dos GIFs otimizados.

### Tela 3: Depoimentos (Prova Social)
Carrossel com depoimentos de usuários.

- **Layout:** `Box` com fundo contrastante ou sombra.
- **Componentes:**
  - `Carousel` (`next/components/atoms/Carousel.js`): Configurado com `pagination` e `navigation`.
  - `Card` (`next/components/molecules/Card.js`): Adaptado para exibir foto, nome, cargo e depoimento.

### Tela 4: Comparação de Planos (Prices)
Reprodução da estrutura da página de preços atual para conversão direta.

- **Layout:** `VStack` com espaçamento de `40px`, contendo o seletor de período e o grid de cards.
- **Componentes:**
  - `Toggle`: Interruptor para alternância entre faturamento mensal e anual (exibindo o selo de "economize 20%").
  - `CardPrice`: Componente detalhado para os planos:
    - **Grátis:** Recursos básicos para exploração.
    - **Pro:** Focado em pesquisadores e consultores (dados sem defasagem e suporte prioritário).
    - **Empresas:** Focado em médias e grandes instituições.
- **Lógica de Negócio:**
  - Consumo da API `/api/stripe/getPlans` para exibição de valores dinâmicos.
  - Verificação de estado do usuário (logado/assinado) para alterar o CTA do botão (Assinar vs. Plano Atual).
  - Tooltips informativos utilizando o componente `Tooltip` do Chakra UI.

### Tela 5: FAQ (Dúvidas Frequentes)
Dropdown com perguntas selecionadas.

- **Layout:** `Accordion` (Chakra UI) com `allowMultiple`.
- **Componentes:**
  - `AccordionItem`: Cada pergunta/resposta.
  - `AccordionButton` & `AccordionPanel`: Estilizados com `TitleText` (pequeno) e `BodyText`.
  - `AccordionIcon`: Para indicação visual de abertura.

## 3. Padrões de Texto e Tags (Titles)

Seguindo `next/components/atoms/Text/`, utilizaremos:

| Elemento | Componente | Typography | Uso Sugerido |
| :--- | :--- | :--- | :--- |
| H1 | `Display` | `large` | Título da Hero |
| H2 | `TitleText` | `large` | Títulos de Seção |
| H3 | `TitleText` | `medium` | Subtítulos e Cards |
| P | `BodyText` | `large` | Descrições e FAQ |
| Labels | `LabelText` | `medium` | Botões e Pequenas Tags |

## 4. Próximos Passos
1. Criar/atualizar arquivos de tradução em `next/public/locales/[lang]/bdpro.json`.
2. Implementar componentes de seção em `next/components/organisms/ProLandingPage/`.
3. Validar responsividade utilizando os hooks `isMobileMod()`.
