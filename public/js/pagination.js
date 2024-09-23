/**
 * @description Função que pagina a exibição de um conjunto de objetos passados armazenados na forma de um vetor. 
 *              Os itens são organizados dentro de uma HTML Table posicionada numa HTML 
 *              Div previamente criada e identificada por 'paginating'
 * @author Wellington W. F. Sarmento
 * @since 2023-04-28
 * @version 1.0.0
 */

/**
 * @name createPaginatedTable
 * @description Cria uma tabela paginada a partir de um array de objetos
 * @param {string} divId - ID da div onde a tabela será exibida
 * @param {Array} dataArray - Array de objetos a serem exibidos na tabela
 * @param {number} itemsPerPage - Número de itens a serem exibidos por página
 */
function createPaginatedTable(dataArray, itemsPerPage) {
    // Clona o array original para evitar mutações externas
    const data = JSON.parse(JSON.stringify(dataArray));

    // Obtém a div com o id 'paginating'
    const pagedDiv = document.getElementById('pagination');

    // Calcula o número total de páginas
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage); //Retorna o menor número inteiro maior ou igual ao número passado como parâmetro

    // Página atual
    let currentPage = 1;

    // Função para renderizar a tabela da página atual
    function renderTable() {
        // Limpa o conteúdo da div
        pagedDiv.innerHTML = '';

        // Cria o elemento da tabela
        const table = document.createElement('table');
        table.classList.add('paginated-table');

        // Cria o cabeçalho da tabela
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Assume que todos os objetos têm as mesmas chaves
        const keys = Object.keys(data[0]);

        keys.forEach(key => {
            const th = document.createElement('th');
            th.innerText = key;
            headerRow.appendChild(th);
        });

        // Adiciona colunas para ações
        const actionTh = document.createElement('th');
        actionTh.innerText = 'Ações';
        headerRow.appendChild(actionTh);

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Cria o corpo da tabela
        const tbody = document.createElement('tbody');

        // Calcula os índices de início e fim para a página atual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        const pageData = data.slice(startIndex, endIndex);

        const fragment = document.createDocumentFragment();

        pageData.forEach((item, index) => {
            const row = document.createElement('tr');
            keys.forEach(key => {
                const td = document.createElement('td');
                td.innerText = item[key];
                row.appendChild(td);
            });

            // Cria a célula de ações
            const actionTd = document.createElement('td');

            // Botão Editar
            const editButton = document.createElement('button');
            editButton.innerText = 'Editar';
            editButton.classList.add('edit-button');
            editButton.onclick = () => editRow(startIndex + index);
            actionTd.appendChild(editButton);

            // Botão Remover
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Remover';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = () => deleteRow(startIndex + index);
            actionTd.appendChild(deleteButton);

            row.appendChild(actionTd);

            fragment.appendChild(row);
        });

        tbody.appendChild(fragment);
        table.appendChild(tbody);

        // Adiciona a tabela à div 'paged'
        pagedDiv.appendChild(table);

        // Cria os controles de paginação
        const paginationDiv = document.createElement('div');
        paginationDiv.classList.add('pagination-controls');

        // Botão 'Anterior'
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerText = 'Anterior';
            prevButton.onclick = () => {
                currentPage--;
                renderTable();
            };
            paginationDiv.appendChild(prevButton);
        }

        // Botões de número de página
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            if (i === currentPage) {
                pageButton.disabled = true;
            } else {
                pageButton.onclick = () => {
                    currentPage = i;
                    renderTable();
                };
            }
            paginationDiv.appendChild(pageButton);
        }

        // Botão 'Próximo'
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.innerText = 'Próximo';
            nextButton.onclick = () => {
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
        const item = data[index];

        // Cria um formulário de edição
        const editForm = document.createElement('form');
        editForm.classList.add('edit-form');

        // Cria campos de entrada para cada chave
        const inputs = {};
        for (const key in item) {
            const label = document.createElement('label');
            label.innerText = key + ': ';
            const input = document.createElement('input');
            input.type = 'text';
            input.value = item[key];
            inputs[key] = input;
            label.appendChild(input);
            editForm.appendChild(label);
            editForm.appendChild(document.createElement('br'));
        }

        // Botão Salvar
        const saveButton = document.createElement('button');
        saveButton.innerText = 'Salvar';
        saveButton.type = 'button';
        saveButton.onclick = () => {
            // Atualiza o objeto com os novos valores
            for (const key in inputs) {
                item[key] = inputs[key].value;
            }
            renderTable();
            pagedDiv.removeChild(editForm);
        };
        editForm.appendChild(saveButton);

        // Botão Cancelar
        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancelar';
        cancelButton.type = 'button';
        cancelButton.onclick = () => {
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