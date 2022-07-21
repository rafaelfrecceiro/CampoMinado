const lines = 10
const columns = 10
let board = []
let gameOverState = false

document.oncontextmenu = (event) => {
    event.preventDefault()
}

document.onmousedown = () => {
    checkField(event)
}

function starGame(){
    document.querySelector(".quantity-bombs").setAttribute("disabled", true)
    restartGame()
    sortingBoard()
    makeBoard()
}

function restartGame(){
    board = []
    gameOverState = false

    document.querySelector('.message').innerHTML = ""
    document.querySelector('.message').classList.remove("error")

    document.querySelector('.board').innerHTML = ""
}

function sortingBoard(){
    let qtdBombs = document.querySelector(".quantity-bombs").value

    for(let l = 0; l < lines; l++) {
        let row = []
        for (let c = 0; c < columns; c++) {
            row.push(" ")
        }
        board.push(row)
    }

    for(let rnd = 0; rnd < qtdBombs; rnd++){
        let lin = Math.floor(Math.random(0,10)*10)
        let col = Math.floor(Math.random(0,10)*10)

        if(board[lin][col] != "X"){
            board[lin][col] = "X"
        }else{
            rnd--
        }
    }

    for(let lin = 0; lin < lines; lin++) {
        for (col = 0; col < columns; col++) {
            checkBombsAdjacents(lin,col)
        }
    }

    console.log("Board Finalizado", board)
}

function checkBombsAdjacents(l,c){
    if(board[l][c] != "X") {
        let graphs = []

        graphs.push([l, c])
        graphs.push([l - 1, c])
        graphs.push([l + 1, c])
        graphs.push([l, c + 1])
        graphs.push([l, c - 1])
        graphs.push([l - 1, c - 1])
        graphs.push([l + 1, c + 1])
        graphs.push([l + 1, c - 1])
        graphs.push([l - 1, c + 1])

        let graphRead = [...graphs]

        //Remove linhas fora da matriz
        for (let x = 0; x < graphRead.length; x++) {
            if (graphRead[x][0] < 0 || graphRead[x][0] > lines-1) {
                delete graphs[x]
            }
        }

        //Remove colunas fora da matriz
        for (let z = 0; z < graphs.length; z++) {
            if (graphRead[z][1] < 0 || graphRead[z][1] > columns-1) {
                delete graphs[z]
            }
        }

        let countBombs = 0
        for (let y = 0; y < graphs.length; y++) {
            if(graphs[y] != null) {
                let valueField = board[graphs[y][0]][graphs[y][1]]
                if (valueField == "X") {
                    countBombs++
                }
            }
        }

        if(countBombs > 0) board[l][c] = countBombs
    }
}

function makeBoard(){
    for(let l = 0; l < lines; l++){
        for(let c = 0; c < columns; c++){
            let tag = '<div class="position"><input class="option" row="'+ l +'" col="'+ c +'" type="button" value="" onClick="checkField(event)"/></div>'
            document.querySelector('.board').innerHTML += tag
        }
    }
}

function checkField(event){
    if(event.target.classList[0] == "option" && !gameOverState) {
        let l = event.target.getAttribute("row")
        let c = event.target.getAttribute("col")

        if (event.button == 0) {
            event.target.classList.remove("findBomb")
            event.target.classList.add("removed")

            if(board[l][c] == "X"){
                event.target.classList.add("bomb")
                gameOverState = true
                setTimeout(()=>{
                    gameOver()
                },100)
            }
            else{
                event.target.value = board[l][c]

                if(board[l][c] == " "){
                    clearHorizontal(l, c)
                    clearVertical(l, c)
                }
            }
        } else if (event.button == 2) {
            event.target.classList.add("findBomb")
        }
    }
}

function gameOver(){
    document.querySelector('.message').innerHTML = "VOCÊ PERDEU!!!!"
    document.querySelector('.message').classList.add("error")
    document.querySelector(".quantity-bombs").removeAttribute("disabled")
}

function clearHorizontal(line, col){
    line = parseInt(line)
    col = parseInt(col)

    //pega verticais pra cima
    let before = []
    for(let x = line-1; x >= 0; x--){
        if(board[x][col] == " ") {
            before.push([x, col])
        }
        else{
            if(board[x][col] != "X"){
                before.push([x, col])
            }
            break
        }
    }

    //pega verticais pra baixo
    let after = []
    for(let y = line+1; y <= lines-1 ; y++){
        if(board[y][col] == " "){
            after.push([y, col])
        }
        else {
            if(board[y][col] != "X"){
                after.push([y, col])
            }
            break
        }
    }

    let vertical = [...before, ...after]

    for(let z = 0; z < vertical.length; z++){
        if(board[vertical[z][0]][vertical[z][1]] == " " || board[vertical[z][0]][vertical[z][1]] != "X"){
            let el = document.querySelectorAll(".option")
            for(let m = 0; m < el.length; m++){
                let row = document.querySelectorAll(".option")[m].getAttribute("row")
                let col = document.querySelectorAll(".option")[m].getAttribute("col")

                if(row == vertical[z][0] && col == vertical[z][1]){
                    document.querySelectorAll(".option")[m].classList.add("removed")
                    document.querySelectorAll(".option")[m].value = board[row][col]
                    break
                }
            }
        }
    }
}

function clearVertical(line, col){
    line = parseInt(line)
    col = parseInt(col)

    //pega horizontais pra esquerda
    let before = []
    for(let x = columns-1; x >= 0; x--){
        if(board[line][x] == " ") {
            before.push([line, x])
        }
        else{
            if(board[line][x] != "X"){
                before.push([line, x])
            }
            break
        }
    }

    //pega horizontais pra direita
    let after = []
    for(let y = col+1; y <= columns-1 ; y++){
        if(board[line][y] == " "){
            after.push([line, y])
        }
        else {
            if(board[line][y] != "X"){
                after.push([line, y])
            }
            break
        }
    }

    let horizontal = [...before, ...after]
    console.log("horizontal", horizontal)

    for(let z = 0; z < horizontal.length; z++){
        if(board[horizontal[z][0]][horizontal[z][1]] == " " || board[horizontal[z][0]][horizontal[z][1]] != "X"){
            let el = document.querySelectorAll(".option")
            for(let m = 0; m < el.length; m++){
                let row = document.querySelectorAll(".option")[m].getAttribute("row")
                let col = document.querySelectorAll(".option")[m].getAttribute("col")

                if(row == horizontal[z][0] && col == horizontal[z][1]){
                    document.querySelectorAll(".option")[m].classList.add("removed")
                    document.querySelectorAll(".option")[m].value = board[row][col]
                    break
                }
            }
        }
    }
}