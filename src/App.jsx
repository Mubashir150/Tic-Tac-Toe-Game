import { useState} from 'react';
import GameBoard from "./components/GameBoard"
import Header from "./components/Header"
import Player from "./components/Player"
import Log from './components/Log';
import { WINNING_COMBINATIONS } from './components/Winning';
import GameOver from './components/GameOver';
const PLAYERS={
  X:'Player 1',
  O:'Player 2',
}

const initialGameboard=[
  [null,null,null],
  [null,null,null],
  [null,null,null],
]
function derivedCurrentPlayer(gameTurns){
  let currentPlayer='X';
  if(gameTurns.length>0&& gameTurns[0].player==='X'){
    currentPlayer='O';
  }
  return currentPlayer
}
function deriveGameBoard(gameTurns){
  let gameBoard=[...initialGameboard.map(array=>[...array])];
    for(const turn of gameTurns){
        const {square,player}=turn;
        const {row,col}=square;
        gameBoard[row][col]=player
    }
    return gameBoard
}
function deriveWinner(gameBoard,players){
  let winner;
  for(const win of WINNING_COMBINATIONS){
    const first=gameBoard[win[0].row][win[0].column]
    const second=gameBoard[win[1].row][win[1].column]
    const third=gameBoard[win[2].row][win[2].column]

    if(first && first===second && first===third){
      winner=players[first];
    }
  }
  return winner;
}

function App() {
  const [players,setPlayers]=useState(PLAYERS)
  const [gameTurns,setGameTurns]=useState([]);
  const activePlayer=derivedCurrentPlayer(gameTurns)

  const gameBoard=deriveGameBoard(gameTurns)
 
  const winner=deriveWinner(gameBoard,players)
  const draw=gameTurns.length===9 && !winner;

  function handleSelectPlayer(rowIndex,colIndex){
   
    setGameTurns((prevTurns)=>{
      const currentPlayer=derivedCurrentPlayer(prevTurns)
      
      const updatedTurns=[
        {square:{
          row:rowIndex,
          col:colIndex},
        player:currentPlayer},...prevTurns
      ];
      return updatedTurns
    })
  }
  function handleRematch(){
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol,newName){
    setPlayers(prevPlayers=>{
      return {
        ...prevPlayers,
        [symbol]:newName,
      }
    })
  }

  return( 
    <>
      <Header/>
      <main>
        <div id="game-container">
          <ol id="players" className='highlight-player'>
            <Player initialName={PLAYERS.X} symbol="X" isActive={activePlayer==='X'} onChangeName={handlePlayerNameChange} />
            <Player initialName={PLAYERS.O} symbol="O" isActive={activePlayer==='O'} onChangeName={handlePlayerNameChange}/>
            
          </ol>
          {(winner||draw) && <GameOver winner={winner} onRematch={handleRematch}/>}
          <GameBoard onSelectSquare={handleSelectPlayer} board={gameBoard}/>
          
        </div>
        <Log turns={gameTurns}/>
      </main>
      </>
  )
}

export default App
