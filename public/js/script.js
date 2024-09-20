function createPaginatedTable(dataArray, itemsPerPage) {
    // Clona o array original para evitar mutações externas
    var data = JSON.parse(JSON.stringify(dataArray));

    // Obtém a div com o id 'paged'
    var pagedDiv = document.getElementById('paged');

    // Calcula o número total de páginas
    var totalItems = data.length;
    var totalPages = Math.ceil(totalItems / itemsPerPage);

    // Página atual
    var currentPage = 1;

    // Função para renderizar a tabela da página atual
    function renderTable() {
        // Limpa o conteúdo da div
        pagedDiv.innerHTML = '';

        // Cria o elemento da tabela
        var table = document.createElement('table');
        table.border = '1';

        // Cria o cabeçalho da tabela
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');

        // Assume que todos os objetos têm as mesmas chaves
        var keys = Object.keys(data[0]);

        keys.forEach(function(key) {
            var th = document.createElement('th');
            th.innerText = key;
            headerRow.appendChild(th);
        });

        // Adiciona colunas para ações
        var actionTh = document.createElement('th');
        actionTh.innerText = 'Ações';
        headerRow.appendChild(actionTh);

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Cria o corpo da tabela
        var tbody = document.createElement('tbody');

        // Calcula os índices de início e fim para a página atual
        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        var pageData = data.slice(startIndex, endIndex);

        pageData.forEach(function(item, index) {
            var row = document.createElement('tr');
            keys.forEach(function(key) {
                var td = document.createElement('td');
                td.innerText = item[key];
                row.appendChild(td);
            });

            // Cria a célula de ações
            var actionTd = document.createElement('td');

            // Botão Editar
            var editButton = document.createElement('button');
            editButton.innerText = 'Editar';
            editButton.onclick = (function(rowIndex) {
                return function() {
                    editRow(rowIndex);
                };
            })(startIndex + index);
            actionTd.appendChild(editButton);

            // Botão Remover
            var deleteButton = document.createElement('button');
            deleteButton.innerText = 'Remover';
            deleteButton.onclick = (function(rowIndex) {
                return function() {
                    deleteRow(rowIndex);
                };
            })(startIndex + index);
            actionTd.appendChild(deleteButton);

            row.appendChild(actionTd);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        // Adiciona a tabela à div 'paged'
        pagedDiv.appendChild(table);

        // Cria os controles de paginação
        var paginationDiv = document.createElement('div');

        // Botão 'Anterior'
        if (currentPage > 1) {
            var prevButton = document.createElement('button');
            prevButton.innerText = 'Anterior';
            prevButton.onclick = function() {
                currentPage--;
                renderTable();
            };
            paginationDiv.appendChild(prevButton);
        }

        // Botões de número de página
        for (var i = 1; i <= totalPages; i++) {
            var pageButton = document.createElement('button');
            pageButton.innerText = i;
            if (i === currentPage) {
                pageButton.disabled = true;
            } else {
                pageButton.onclick = (function(page) {
                    return function() {
                        currentPage = page;
                        renderTable();
                    };
                })(i);
            }
            paginationDiv.appendChild(pageButton);
        }

        // Botão 'Próximo'
        if (currentPage < totalPages) {
            var nextButton = document.createElement('button');
            nextButton.innerText = 'Próximo';
            nextButton.onclick = function() {
                currentPage++;
                renderTable();
            };
            paginationDiv.appendChild(nextButton);
        }

        // Adiciona os controles de paginação à div 'paged'
        pagedDiv.appendChild(paginationDiv);
    }

    // Função para editar uma linha
    function editRow(index) {
        var item = data[index];

        // Cria um formulário de edição
        var editForm = document.createElement('form');

        // Cria campos de entrada para cada chave
        var inputs = {};
        for (var key in item) {
            var label = document.createElement('label');
            label.innerText = key + ': ';
            var input = document.createElement('input');
            input.type = 'text';
            input.value = item[key];
            inputs[key] = input;
            label.appendChild(input);
            editForm.appendChild(label);
            editForm.appendChild(document.createElement('br'));
        }

        // Botão Salvar
        var saveButton = document.createElement('button');
        saveButton.innerText = 'Salvar';
        saveButton.type = 'button';
        saveButton.onclick = function() {
            // Atualiza o objeto com os novos valores
            for (var key in inputs) {
                item[key] = inputs[key].value;
            }
            renderTable();
            pagedDiv.removeChild(editForm);
        };
        editForm.appendChild(saveButton);

        // Botão Cancelar
        var cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancelar';
        cancelButton.type = 'button';
        cancelButton.onclick = function() {
            pagedDiv.removeChild(editForm);
        };
        editForm.appendChild(cancelButton);

        // Exibe o formulário de edição
        pagedDiv.appendChild(editForm);
    }

    // Função para remover uma linha
    function deleteRow(index) {
        data.splice(index, 1);
        totalItems = data.length;
        totalPages = Math.ceil(totalItems / itemsPerPage);

        // Ajusta a página atual se necessário
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        renderTable();
    }

    // Renderiza a tabela inicial
    renderTable();
}
