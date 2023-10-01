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
            .catch(error => {
                console.error('Erro:', error);

                // Tratar o erro e exibir uma mensagem
                exibirErro();
            });
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
        "Potato___Early_blight": "Batata - Alternariose Inicial",
        "Potato___Late_blight": "Batata - Alternariose Tardio",
        "Potato___healthy": "Batata - Saudável",
        "Tomato_Bacterial_spot": "Tomate - Mancha Bacteriana",
        "Tomato_Early_blight": "Tomate - Alternariose Inicial",
        "Tomato_Late_blight": "Tomate - Alternariose Tardio",
        "Tomato_Leaf_Mold": "Tomate - Mancha de cladosporium - Fungo",
        "Tomato_Septoria_leaf_spot": "Tomate - Septoriose - Fungo",
        "Tomato_Spider_mites_Two_spotted_spider_mite": "Tomate - Ácaro Rajado",
        "Tomato__Target_Spot": "Tomate - Mancha Alvo",
        "Tomato__Tomato_YellowLeaf__Curl_Virus": "Tomate - Vírus do Enrolamento das Folhas Amarelas - begomovírus",
        "Tomato__Tomato_mosaic_virus": "Tomate - Vírus do mosaico do tomateiro",
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

    // Verifica o status da resposta
    if (data.status === 'success') {
        // Traduz a classe antes de exibi-la
        const classeTraduzida = traduzirClasse(data.classe);

        // Atualiza o conteúdo dos elementos <p>
        classeElemento.innerHTML = `<strong>Classe:</strong> <span style="font-weight: normal "> ${classeTraduzida} </span>`;
        assertividadeElemento.innerHTML = `<strong>Assertividade:</strong> <span style="font-weight: normal "> ${(data.assertividade * 100).toFixed(2)}% </span>`;

        // Adiciona a bolinha com base na assertividade
        adicionarBolinha(assertividadeElemento, data.assertividade);

        // Exibe a caixa de resultado
        document.getElementById('resultado').style.display = 'block';
    } else {
        // Se o status não for 'success', exibe uma mensagem de erro
        exibirErro();
    }
}

// Função para adicionar a bolinha com base na assertividade
function adicionarBolinha(container, assertividade) {
    const bolinha = document.createElement('span');
    bolinha.className = 'bolinha';

    // Adiciona a cor com base na assertividade
    if (assertividade >= 0.85) {
        bolinha.style.backgroundColor = '#4CAF50';  // Verde
    } else if (assertividade >= 0.60) {
        bolinha.style.backgroundColor = '#FFD700';  // Amarelo
    } else {
        bolinha.style.backgroundColor = '#FF0000';  // Vermelho
    }

    // Adiciona a bolinha ao container
    container.appendChild(bolinha);
}

const dropzone = document.getElementById('dropzone');

dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.style.border = '2px solid #008a49';
});

dropzone.addEventListener('dragleave', () => {
    dropzone.style.border = '2px solid #ccc';
});

dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.style.border = '2px solid #ccc';

    const arquivo = event.dataTransfer.files[0];

    if (arquivo) {
        // Valida o tipo de arquivo
        if (validarTipoArquivo(arquivo)) {
            const formData = new FormData();
            formData.append('arquivo', arquivo);

            // Continua com a requisição
            fetch('http://localhost:8000/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Resposta recebida:', data);
                exibirResposta(data);
            })
            .catch(error => console.error('Erro:', error));
        } else {
            alert('Apenas imagens (PNG, JPG, JPEG) são permitidas!');
        }
    } else {
        alert('Selecione um arquivo para enviar.');
    }
});
// Função para exibir uma mensagem de erro
function exibirErro() {
    const resultadoElemento = document.getElementById('resultado');
    resultadoElemento.innerHTML = '<p style="color: red; font-weight: bold;">Erro no processamento da imagem ou a imagem não é uma planta. Tente novamente.</p>';
    resultadoElemento.style.display = 'block';
}
