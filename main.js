'use strict'
// ABRIR E FECHAR MODAL
const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

// SAVE NO LOCAL STORAGE
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_carro')) ?? []
const setLocalStorage = (dbCarro) => localStorage.setItem("db_carro", JSON.stringify(dbCarro))

// CRUD - create read update delete
const deleteCarro = (index) => {
    const dbCarro = readCarro()
    dbCarro.splice(index, 1)
    setLocalStorage(dbCarro)
}

//UPDATE
const updateCarro = (index, Carro) => {
    const dbCarro = readCarro()
    dbCarro[index] = Carro
    setLocalStorage(dbCarro)
}
//READ
const readCarro = () => getLocalStorage()
//CREATE
const createCarro = (carro) => {
    const dbCarro = getLocalStorage()
    dbCarro.push (carro)
    setLocalStorage(dbCarro)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}
// SALVANDO CARRO
const saveCarro = () => {
    debugger
    if (isValidFields()) {
        const carro = {
            nome: document.getElementById('nome').value,
            marca: document.getElementById('marca').value,
            modelo: document.getElementById('modelo').value,
            disponibilidade: document.getElementById('disponibilidade').value
           
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createCarro(carro)
            updateTable()
            closeModal()
        } else {
            updateCarro(index, carro)
            updateTable()
            closeModal()
        }
    }
}
//CREAT
const createRow = (carro, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${carro.nome}</td>
        <td>${carro.marca}</td>
        <td>${carro.modelo}</td>
        <td>${carro.disponibilidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableCarro>tbody').appendChild(newRow)
}
//LIMPAR TABLELA
const clearTable = () => {
    const rows = document.querySelectorAll('#tableCarro>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}
//updateTable
const updateTable = () => {
    const dbCarro = readCarro()
    clearTable()
    dbCarro.forEach(createRow)
}

const fillFields = (carro) => {
    document.getElementById('nome').value = carro.nome
    document.getElementById('marca').value = carro.marca
    document.getElementById('modelo').value = carro.modelo
    document.getElementById('disponibilidade').value = carro.disponibilidade
    document.getElementById('nome').dataset.index = carro.index
}

//UPDATE
const editCarro = (index) => {
    const Carro = readCarro()[index]
    Carro.index = index
    fillFields(Carro)
    openModal()
}
// DELETE 
const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editCarro(index)
        } else {
            const carro = readCarro()[index]
            const response = confirm(`Deseja realmente excluir o Carro ${carro.nome}`)
            if (response) {
                deleteCarro(index)
                updateTable()
            }
        }
    }
}

updateTable()


document.getElementById('cadastrarCarro')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveCarro)

document.querySelector('#tableCarro>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)