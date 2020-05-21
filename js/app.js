// Pega no HTML todas as tags e armazena em uma const
const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`

const insertSongsIntoPage = songsInfo => { //Vai jogar o template na tela
    console.log(songsInfo)
    songsContainer.innerHTML = songsInfo.data.map(song => `
    <li class="song">
        <span class="text-muted"><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn btn-primary btn-sm rounded-pill" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
    </li>
    `).join('') //Ele vai pegar o array de objetos de songsInfo e com o map ele vai criar um novo array com os mesmos elementos do original e percorrer por todos os elementos do array e fazer alguma modificação; Como o map vai gerar um array e não teria como colocar um array no index, vou usar o metodo Join que vai retornar uma nova string com todos os elementos do array separados por virgulas.
}

const fetchSongs = async term => {
    const response = await fetch(`${apiURL}/suggest/${term}`) //Vai pedir a requisição para a API e como estou usando o async await, enquanto a requisição estiver sendo feita os códigos abaixo não serão executados e o valor não é enviado para a const
    const data = await response.json() //Transforma a busca em lista de informações da músicas em JSON

    insertSongsIntoPage(data)
}

//Pega o evento submit do botão e cria uma função
form.addEventListener('submit', event => {
    event.preventDefault() //Assim que apertar o botão esse código não deixa com que o navegador atualize a página

    const buscaTermo = searchInput.value.trim() //Pega o valor do input e joga dentro da variavel, o trim é para que ele desconsidere os espações caso o cliente coloque

    if(!buscaTermo){ //Essa função não deixa o usuário final deixar o campo input vazio, isso poderia ser resolvido de duas formas: Essa que vamos fazer e a outra seria dentro da tag input colocar um parâmetro chamado <input type="text" required>
        songsContainer.innerHTML = `<li class="alert alert-danger" role="alert">Por favor, digite um termo válido</li>`
        return
    }

    fetchSongs(buscaTermo)
})