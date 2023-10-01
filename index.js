function validarTipoArquivo(arquivo) {
    const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg'];
    return tiposPermitidos.includes(arquivo.type);
}

// Função para abrir o seletor de arquivo ao clicar na dropzone
function selecionarArquivo() {
    document.getElementById('inputArquivo').click();
}

// Função para processar o arquivo selecionado
function processarArquivo() {
    console.log('Processando arquivo...');
    const formData = new FormData();

    // Obtém o arquivo do input
    const inputArquivo = document.getElementById('inputArquivo');
    const arquivo = inputArquivo.files[0];

    // Verifica se um arquivo foi selecionado
    if (arquivo) {
        // Valida o tipo de arquivo
        if (validarTipoArquivo(arquivo)) {
            formData.append('arquivo', arquivo);
            
            // Se o tipo de arquivo for válido, continua com a requisição
            fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Resposta recebida:', data);
                
                // Exibir a resposta na tela
                exibirResposta(data);
            })
            .catch(error => console.error('Erro:', error));
        } else {
            // Se o tipo de arquivo não for válido, exibe uma mensagem
            alert('Apenas imagens (PNG, JPG, JPEG) são permitidas!');
        }
    } else {
        // Se nenhum arquivo foi selecionado, exibe uma mensagem
        alert('Selecione um arquivo para enviar.');
    }
}

// Função para traduzir a classe para o português
function traduzirClasse(classe) {
    // Mapeamento de classes em inglês para tradução em português
    const traducoes = {
        "Pepper__bell___Bacterial_spot": "Pimentão - Mancha Bacteriana",
        "Pepper__bell___healthy": "Pimentão - Saudável",
        "Potato___Early_blight": "Batata - Míldio Inicial",
        "Potato___Late_blight": "Batata - Míldio Tardio",
        "Potato___healthy": "Batata - Saudável",
        "Tomato_Bacterial_spot": "Tomate - Mancha Bacteriana",
        "Tomato_Early_blight": "Tomate - Míldio Inicial",
        "Tomato_Late_blight": "Tomate - Míldio Tardio",
        "Tomato_Leaf_Mold": "Tomate - Míldio Foliar",
        "Tomato_Septoria_leaf_spot": "Tomate - Mancha Foliar Septoria",
        "Tomato_Spider_mites_Two_spotted_spider_mite": "Tomate - Ácaro Rajado",
        "Tomato__Target_Spot": "Tomate - Mancha Alvo",
        "Tomato__Tomato_YellowLeaf__Curl_Virus": "Tomate - Vírus do Enrolamento das Folhas Amarelas",
        "Tomato__Tomato_mosaic_virus": "Tomate - Vírus do Mosaico",
        "Tomato_healthy": "Tomate - Saudável"
    };

    // Verifica se a classe está no mapeamento
    if (traducoes.hasOwnProperty(classe)) {
        return traducoes[classe];
    } else {
        // Se não houver tradução, retorna a classe original
        return classe;
    }
}

// Função para exibir a resposta na tela
function exibirResposta(data) {
    const classeElemento = document.getElementById('classe');
    const assertividadeElemento = document.getElementById('assertividade');
    
    // Traduz a classe antes de exibi-la
    const classeTraduzida = traduzirClasse(data.classe);

    // Atualiza o conteúdo dos elementos <p>
    classeElemento.innerHTML = `<strong>Classe:</strong> <span style="font-weight: normal "> ${classeTraduzida} </span>`;
    assertividadeElemento.innerHTML = `<strong>Assertividade:</strong> <span style="font-weight: normal "> ${(data.assertividade * 100).toFixed(2)}% </span>`;

    // Exibe a caixa de resultado
    document.getElementById('resultado').style.display = 'block';
}