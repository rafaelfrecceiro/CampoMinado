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

function sortingBoard(){
    for(let l = 0; l < lines; l++) {
        let row = []
        for (let c = 0; c < columns; c++) {
            Math.floor(Math.random(0,100)*100) >= 95 ? row.push("X") : row.push(" ")
        }
        board.push(row)
    }

    for(let lin = 0; lin < lines; lin++) {
        for (col = 0; col < columns; col++) {
            checkBombsAdjacents(lin,col)
        }
    }
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
    if(event.target.tagName == "INPUT" && !gameOverState) {
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
            else event.target.value = board[l][c]
        } else if (event.button == 2) {
            event.target.classList.add("findBomb")
        }
    }
}

function gameOver(){
    document.querySelector('.message').innerHTML = "VOCÊ PERDEU!!!!"
    document.querySelector('.message').classList.add("error")
}

sortingBoard()
makeBoard()