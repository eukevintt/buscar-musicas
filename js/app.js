// Pega no HTML todas as tags e armazena em uma const
const form = document.querySelector('#form')
const inputProcurar = document.querySelector('#procurar')
const containerMusicas = document.querySelector('#container-musicas')
const antesProximoContainer = document.querySelector('#antes-proximo-container')
const mensagemErro = document.querySelector('#mensagem-erro')
const containera = document.querySelector('#central')

const apiURL = `https://api.lyrics.ovh`

const pegarMaisSons = async url => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`) //se não colocar essa linha ele pode dar um problema de cors, que basicamente o navegador trava qualquer tipo de requisição de outro site... com essa solução que a empresa heroku fez é possivel ter as requisições
    const data = await response.json()

    colocarSonsNaPagina(data)
}

const colocarSonsNaPagina = songsInfo => { //Vai jogar o template na tela

    containerMusicas.innerHTML = songsInfo.data.map(song => `
    
    <li class="musica">
        <span class="text-muted"><strong>${song.artist.name}</strong> - ${song.title}</span>

        <button class="btn btn-primary btn-sm rounded-pill" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
    </li>
    `).join('') //Ele vai pegar o array de objetos de songsInfo e com o map ele vai criar um novo array com os mesmos elementos do original e percorrer por todos os elementos do array e fazer alguma modificação; Como o map vai gerar um array e não teria como colocar um array no index, vou usar o metodo Join que vai retornar uma nova string com todos os elementos do array separados por virgulas.
    if(songsInfo.prev || songsInfo.next){ //Adiciona os botões de anterior ou próximo caso o limite de musicas ultrapasse na pagina inicial e caso os songsinfo.prev e next sejam trues
        antesProximoContainer.innerHTML = `
            ${songsInfo.prev ? `<button class="btn btn-secondary" onclick="pegarMaisSons('${songsInfo.prev}')"><= Anteriores</button>`: ''}
            ${songsInfo.next ? `<button class="btn btn-secondary" onclick="pegarMaisSons('${songsInfo.next}')">Próximas =></button>`: ''}
         `
        return
    }

    antesProximoContainer.innerHTML = ''
}


const fetchSongs = async term => {
    mensagemErro.innerHTML = ''

    

    const response = await fetch(`${apiURL}/suggest/${term}`) //Vai pedir a requisição para a API e como estou usando o async await, enquanto a requisição estiver sendo feita os códigos abaixo não serão executados e o valor não é enviado para a const
    const data = await response.json() //Transforma a busca em lista de informações da músicas em JSON

    colocarSonsNaPagina(data)
}

//Pega o evento submit do botão e cria uma função
form.addEventListener('submit', event => {
    event.preventDefault() //Assim que apertar o botão esse código não deixa com que o navegador atualize a página

    const buscaTermo = inputProcurar.value.trim() //Pega o valor do input e joga dentro da variavel, o trim é para que ele desconsidere os espações caso o cliente coloque

    if(!buscaTermo){ //Essa função não deixa o usuário final deixar o campo input vazio, isso poderia ser resolvido de duas formas: Essa que vamos fazer e a outra seria dentro da tag input colocar um parâmetro chamado <input type="text" required>
        mensagemErro.innerHTML = `<li class="alert alert-danger" role="alert">Por favor, digite um termo válido</li>`

        containerMusicas.innerHTML = ""
        antesProximoContainer.innerHTML = ""

        return
    }

    fetchSongs(buscaTermo)
})

const letras = async(artista, tituloMusi) => { 

    const response = await fetch(`${apiURL}/v1/${artista}/${tituloMusi}`)
    const data = await response.json()
    document.getElementById('titulo').innerHTML = `${tituloMusi} - ${artista}`

    if(data.lyrics === undefined){ //se a letra da musica for indefinida quer dizer que a letra da musica que o usuario apertou não tenha no banco de dados da api
        document.getElementById('letras-lista').innerHTML = `
        <li>
        <p class='text-muted'>A letra infelizmente não está disponivel para essa música</p>
        </li>
    `
    }else{
        const letras = data.lyrics.replace(/(\r\n|\r|\n)/g , '<br>')//essa parte aqui do replace eu vi um tutorial em que explicava como tratar strings, a letra ela vem toda bagunçada, então eu só adaptei para as letras das músicas
        document.getElementById('letras-lista').innerHTML = `
        <li> 
            
            <p class='text-muted'>${letras}</p>
        </li>
    `
    }

    $('#letras').modal('show') //abre o modal
}

containerMusicas.addEventListener('click', event => {
    const elementoCliclado = event.target

    if(elementoCliclado.tagName === 'BUTTON'){ //caso o elemento clicado for um botão ele vai executar
        const artista = elementoCliclado.getAttribute('data-artist')
        const tituloMusi = elementoCliclado.getAttribute('data-song-title')

        letras(artista, tituloMusi)
    }
})