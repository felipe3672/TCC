// Função para abrir o seletor de arquivo ao clicar na dropzone
function selecionarArquivo() {
    document.getElementById('inputArquivo').click();
}

function validarTipoArquivo(arquivo) {
    const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg'];
    return tiposPermitidos.includes(arquivo.type);
}

// Função para processar o arquivo selecionado
function processarArquivo() {
    console.log('Processando arquivo...');
    const formData = new FormData();

    // Oculta o elemento de mensagens de erro
    document.getElementById('mensagensErro').style.display = 'none';

    // Oculta o elemento de resultado
    document.getElementById('resultado').style.display = 'none';

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
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Resposta recebida:', data);
                
                // Exibir a resposta na tela
                exibirResposta(data);
                
            })
            .catch(error => {
                console.error('Erro na requisição:', error.message);
                
                // Exibir mensagem de erro
                exibirErro('Erro no processamento da imagem ou a imagem não é uma planta. Tente novamente.');
                
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

function exibirResposta(data) {
    const classeElemento = document.getElementById('classe');
    const assertividadeElemento = document.getElementById('assertividade');
    const resultadoElemento = document.getElementById('resultado');


    if (classeElemento && assertividadeElemento && resultadoElemento) {
        // Limpar o conteúdo anterior
        resultadoElemento.innerHTML.trim() === '';

        // Traduz a classe antes de exibi-la
        const classeTraduzida = traduzirClasse(data.classe);

        // Atualiza o conteúdo do elemento <p>
        classeElemento.innerHTML = `<strong>Classe:</strong> <span style="font-weight: normal "> ${classeTraduzida} </span>`;

        // Atualiza o valor da assertividade
        assertividadeElemento.innerHTML = `<strong>Assertividade:</strong> <span class="assertividade-texto" style="font-weight: normal ">${(data.assertividade * 100).toFixed(2)}%</span>`;

        // Adiciona a bolinha com base na assertividade
        adicionarBolinha(assertividadeElemento, data.assertividade);

        // Exibe a caixa de resultado
        resultadoElemento.style.display = 'block';
    } else {
        

        // Traduz a classe antes de exibi-la
        const classeTraduzida = traduzirClasse(data.classe);

        // Atualiza o conteúdo do elemento <p>
        classeElemento.innerHTML = `<strong>Classe:</strong> <span style="font-weight: normal "> ${classeTraduzida} </span>`;

        // Atualiza o valor da assertividade
        assertividadeElemento.innerHTML = `<strong>Assertividade:</strong> <span class="assertividade-texto" style="font-weight: normal ">${(data.assertividade * 100).toFixed(2)}%</span>`;

        // Adiciona a bolinha com base na assertividade
        adicionarBolinha(assertividadeElemento, data.assertividade);

        // Exibe a caixa de resultado
        resultadoElemento.style.display = 'block';
        
    }
}

// Função para exibir uma mensagem de erro na tela

function exibirErro(mensagem) {
    const resultadoElemento = document.getElementById('resultado');
    const mensagensErroElemento = document.getElementById('mensagensErro');

    // Limpar qualquer conteúdo existente
    resultadoElemento.innerHTML.trim() === '';

    // Adicionar a mensagem de erro
    mensagensErroElemento.innerHTML = `<p style="color: red; font-weight: bold;">${mensagem}</p>`;
    mensagensErroElemento.style.display = 'block';
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

document.addEventListener('DOMContentLoaded', function () {

    const dropzone = document.getElementById('dropzone');

    dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.currentTarget.style.border = '2px solid #008a49';
    });

    dropzone.addEventListener('dragleave', (event) => {
        event.currentTarget.style.border = '2px solid #ccc';
    });

    dropzone.addEventListener('drop', (event) => {
        event.preventDefault();
        event.currentTarget.style.border = '2px solid #ccc';

        const arquivo = event.dataTransfer.files[0];

        if (arquivo) {
            if (validarTipoArquivo(arquivo)) {
                const formData = new FormData();
                formData.append('arquivo', arquivo);

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

});