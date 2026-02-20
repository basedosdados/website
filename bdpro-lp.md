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

### Tela 4: Chamada de Compra (CTA Final)
Apresentação dos planos com navegação por público-alvo (Nav Bar).

- **Layout:** `VStack` com `padding="80px 0"`.
- **Componentes:**
  - `Tabs` (Nav Bar) para alternar entre os públicos:
    - **Aba 1:** Pesquisadores, Consultores e Pequenas empresas (Valor: **R$ 47/mês**).
    - **Aba 2:** Médias e grandes empresas e instituições públicas (Valor: **R$ 350/mês**).
  - Exibição dinâmica do valor correspondente ao grupo selecionado.
  - `Button`: Botão de assinatura em destaque (cor primária `#2B8C4D`).

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
