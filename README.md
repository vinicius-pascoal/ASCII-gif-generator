# GIF to ASCII Converter

Conversor de GIFs para arte ASCII animada, construído com Next.js e TypeScript.

## 🎬 Funcionalidades

- **Upload de GIF**: Arraste e solte ou selecione arquivos GIF
- **Conversão para ASCII**: Converte cada frame do GIF em arte ASCII
- **Prévia em Tempo Real**: Visualize a animação ASCII antes de baixar
- **Personalização Completa**:
  - Ajuste a largura (resolução ASCII)
  - Configure o tamanho da fonte
  - Escolha cores de texto e fundo
  - Inverta o brilho para efeitos diferentes
- **Download**: Baixe o GIF ASCII gerado

## 🚀 Como Usar

1. **Instale as dependências**:
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Abra no navegador**: http://localhost:3000

4. **Converta seu GIF**:
   - Faça upload de um arquivo GIF
   - Ajuste as configurações de conversão
   - Clique em "Converter para ASCII"
   - Veja a prévia da animação
   - Clique em "Baixar GIF ASCII" para salvar

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **gifuct-js** - Parser de GIF
- **gif.js** - Geração de GIF

## 📦 Estrutura do Projeto

```
├── app/
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página principal
│   └── globals.css     # Estilos globais
├── components/
│   ├── GifUploader.tsx    # Upload de arquivos
│   ├── AsciiPreview.tsx   # Prévia da animação
│   └── ControlPanel.tsx   # Painel de controles
├── lib/
│   ├── ascii-converter.ts # Lógica de conversão ASCII
│   └── gif-processor.ts   # Processamento de GIF
└── public/
```

## 🎨 Personalização

O conversor oferece várias opções de personalização:

- **Largura**: 40-200 caracteres (afeta a resolução)
- **Tamanho da Fonte**: 4-12px (para o GIF final)
- **Cor do Texto**: Qualquer cor hexadecimal
- **Cor de Fundo**: Qualquer cor hexadecimal
- **Inverter Brilho**: Inverte o mapeamento de caracteres

## 📝 Notas

- Arquivos GIF grandes podem levar mais tempo para processar
- A qualidade do ASCII depende da largura escolhida
- Suporta dark mode automaticamente

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

MIT
