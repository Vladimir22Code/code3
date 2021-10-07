import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import _cloneDeep from 'lodash/cloneDeep';

// pieces
class Piece {
  constructor (id, notation, color, image) {
    this.id = id
    this.notation = notation
    this.color = color
    this.image = image
  }
}

class King extends Piece {

  moves(index, color) {
    let legalKingMoves = []
    const possibleKingMoves = [-9, -8, -7, -1, 1, 7, 8, 9]

    possibleKingMoves.forEach(element => {
      let tempMove = index + element

      // correction for horizontal edge of the board cases
      let borderCorrection = function() {
        if (state.board[index].id[0] === 'a'
        && state.board[tempMove].id[0] === 'h'
        || state.board[index].id[0] === 'h'
        && state.board[tempMove].id[0] === 'a') {
          return false
        }
        else return true
      }

      if (tempMove >= 0 && tempMove <= 63 
        && borderCorrection()) {
        
        if (state.board[tempMove].display === null) {
          legalKingMoves.push(tempMove)
        }
        else if (color !== state.board[tempMove].display.color) {
          legalKingMoves.push(tempMove)
        }
      } 
    });

    //check for castling
    if (color === 'white' 
      && state.whiteShortCastling 
      && state.whiteInCheck === false 
      && state.board[61].display === null 
      && state.board[62].display === null
      && !state.attackedByBlack.includes(61)
      && !state.attackedByBlack.includes(62)) {
        legalKingMoves.push(62)
      }

    if (color === 'white' 
      && state.whiteLongCatling 
      && state.whiteInCheck === false
      && state.board[59].display === null
      && state.board[58].display === null
      && !state.attackedByBlack.includes(59)
      && !state.attackedByBlack.includes(58)) {
        legalKingMoves.push(58)
      }
    
    if (color === 'black' 
      && state.blackShortCastling 
      && state.blackInCheck === false
      && state.board[5].display === null
      && state.board[6].display === null
      && !state.attackedByWhite.includes(5)
      && !state.attackedByWhite.includes(6)) {
        legalKingMoves.push(6)
      }
      
      if (color === 'black' 
        && state.blackLongCastling 
        && state.blackInCheck === false
        && state.board[3].display === null
        && state.board[2].display === null
        && !state.attackedByWhite.includes(3)
        && !state.attackedByWhite.includes(2)) {
          legalKingMoves.push(2)
        }

        legalKingMoves = methods.filterMoves(legalKingMoves, index)

    return legalKingMoves
  }

  // needed for overall white and black attacked fields
  // without castling, includes fields king can attack even though
  // he cannot move there, includes own pieces
  attacks(index, board) {
    let kingAttacks = []
    const possibleKingMoves = [-9, -8, -7, -1, 1, 7, 8, 9]

    possibleKingMoves.forEach(element => {
      let tempMove = index + element

      // correction for horizontal edge of the board cases
      let borderCorrection = function() {
        if (board[index].id[0] === 'a'
        && board[tempMove].id[0] === 'h'
        || board[index].id[0] === 'h'
        && board[tempMove].id[0] === 'a') {
          return false
        }
        else return true
      }

      if (tempMove >= 0 && tempMove <= 63 && borderCorrection()) {
        kingAttacks.push(tempMove)
      } 
    });

    return kingAttacks
  }
}

class Rook extends Piece {

  moves(index, color) {
    var legalRookMoves = []
    var verticalDirections = [-8, 8]
    var horizontalDirections = [-1, 1]
    // correction for rook positions on horizontal edge of the board
    if (state.board[index].id[0] === 'a') {
      horizontalDirections.splice(0, 1)
    }
    else if (state.board[index].id[0] === 'h'){
      horizontalDirections.splice(1)
    }

    verticalDirections.forEach(element => {
      for (var i=1; i<=7; i++) {
        let tempMove = index + element * i

        if (tempMove >=0 && tempMove <= 63) {

          if (state.board[tempMove].display === null) {
            legalRookMoves.push(tempMove)
          }
        
          else if (color !== state.board[tempMove].display.color) {
            legalRookMoves.push(tempMove)
            break
          }
          else break
        }
      }
    });

    horizontalDirections.forEach(element => {
      for (var i=1; i<=7; i++) {
        let tempMove = index + element * i
        
        if (tempMove >=0 && tempMove <= 63) {

          if (state.board[tempMove].id[0] === 'a'
          || state.board[tempMove].id[0] === 'h') {
            if (state.board[tempMove].display === null) {
              legalRookMoves.push(tempMove)
              break
            }
            else if (color !== state.board[tempMove].display.color) {
              legalRookMoves.push(tempMove)
              break
            }
            else break
          }

          else if (state.board[tempMove].id[0] !== 'a'
          && state.board[tempMove].id[0] !== 'h') {
            if (state.board[tempMove].display === null) {
              legalRookMoves.push(tempMove)
            }
            else if (color !== state.board[tempMove].display.color) {
              legalRookMoves.push(tempMove)
              break
            }
            else break
          }
        }
      }
    });

    legalRookMoves = methods.filterMoves(legalRookMoves, index)
    
    return legalRookMoves
  }

  // needed for overall white and black attacked fields
  // includes first own piece
  attacks(index, board) {
    var rookAttacks = []
    var verticalDirections = [-8, 8]
    var horizontalDirections = [-1, 1]
    // correction for rook positions on horizontal edge of the board
    if (board[index].id[0] === 'a') {
      horizontalDirections.splice(0, 1)
    }
    else if (board[index].id[0] === 'h'){
      horizontalDirections.splice(1)
    }

    verticalDirections.forEach(element => {
      for (var i=1; i<=7; i++) {
        let tempMove = index + element * i

        if (tempMove >=0 && tempMove <= 63) {

          if (board[tempMove].display === null) {
            rookAttacks.push(tempMove)
          }
          else {
            rookAttacks.push(tempMove)
            break
          }
        }
      }
    });

    horizontalDirections.forEach(element => {
      for (var i=1; i<=7; i++) {
        let tempMove = index + element * i
        
        if (tempMove >=0 && tempMove <= 63) {

          if (board[tempMove].id[0] === 'a'
          || board[tempMove].id[0] === 'h') {
            rookAttacks.push(tempMove)
            break
          }

          else if (board[tempMove].id[0] !== 'a'
          && board[tempMove].id[0] !== 'h') {
            if (board[tempMove].display === null) {
              rookAttacks.push(tempMove)
            }
            else {
              rookAttacks.push(tempMove)
              break
            }
          }
        }
      }
    });

    return rookAttacks
  }  
}

class Bishop extends Piece {

  moves(index, color) {
    let legalBishopMoves = []
    var directions = [-9, 7, -7, 9]
    // correction for bishop positions on horizontal edge of the board
    if (state.board[index].id[0] === 'a') {
      directions.splice(0, 2)
    }
    else if (state.board[index].id[0] === 'h') {
      directions.splice(2, 2)
    }

    directions.forEach(element => {
      for (var i=1; i<=7; i++) {
        let tempMove = index + element * i
        
        if (tempMove >=0 && tempMove <= 63) {
          if (state.board[tempMove].id[0] === 'a'
          || state.board[tempMove].id[0] === 'h') {
            if (state.board[tempMove].display === null){
              legalBishopMoves.push(tempMove)
              break
            }
            else if (color !== state.board[tempMove].display.color) {
              legalBishopMoves.push(tempMove)
              break
            }
            else break
          }

          else if (state.board[tempMove].id[0] !== 'a'
          && state.board[tempMove].id[0] !== 'h'){
            if (state.board[tempMove].display === null){
              legalBishopMoves.push(tempMove)
            }
            else if (color !== state.board[tempMove].display.color) {
              legalBishopMoves.push(tempMove)
              break
            }
            else break
          }
        }
      }
    });

    legalBishopMoves = methods.filterMoves(legalBishopMoves, index)
 
    return legalBishopMoves
  }

  // needed for overall white and black attacked fields
  // includes first own piece
  attacks(index, board) {
    let bishopAttacks = []
    var directions = [-9, 7, -7, 9]
    // correction for bishop positions on horizontal edge of the board
    if (board[index].id[0] === 'a') {
      directions.splice(0, 2)
    }
    else if (board[index].id[0] === 'h') {
      directions.splice(2, 2)
    }

    directions.forEach(element => {
      for (var i=1; i<=7; i++) {
        let tempMove = index + element * i
        
        if (tempMove >=0 && tempMove <= 63) {

          if (board[tempMove].id[0] === 'a'
          || board[tempMove].id[0] === 'h') {
            bishopAttacks.push(tempMove)
            break
          }

          else if (board[tempMove].id[0] !== 'a'
          && board[tempMove].id[0] !== 'h'){
            if (board[tempMove].display === null){
              bishopAttacks.push(tempMove)
            }
            else {
              bishopAttacks.push(tempMove)
              break
            }
          }
        }
      }
    });

    return bishopAttacks
  }
}

class Knight extends Piece {

  moves(index, color) {
    let legalKnightMoves = []
    const possibleKnightMoves = [-17, -15, -10, -6, 6, 10, 15, 17]

    possibleKnightMoves.forEach(element => {
      let tempMove = index + element

      // correction for horizontal edge of the board cases
      let borderCorrection = function() {
        if ((state.board[index].id[0] === 'a'
        || state.board[index].id[0] === 'b')
        && (state.board[tempMove].id[0] === 'g'
        || state.board[tempMove].id[0] === 'h')) {
          return false
        }
        else if ((state.board[index].id[0] === 'g'
        || state.board[index].id[0] === 'h')
        && (state.board[tempMove].id[0] === 'a'
        || state.board[tempMove].id[0] === 'b')) {
          return false
        }
        else return true
      }

      if (tempMove >= 0 && tempMove <= 63 
        && borderCorrection()) {

        if (state.board[tempMove].display === null) {
          legalKnightMoves.push(tempMove)
        }
        else if (color !== state.board[tempMove].display.color) {
          legalKnightMoves.push(tempMove)
        }
      }
    });

    legalKnightMoves = methods.filterMoves(legalKnightMoves, index)

    return legalKnightMoves
  }

  // needed for overall white and black attacked fields
  // includes own pieces
  attacks(index, board) {
    let knightAttacks = []
    const possibleKnightMoves = [-17, -15, -10, -6, 6, 10, 15, 17]

    possibleKnightMoves.forEach(element => {
      let tempMove = index + element

      // correction for horizontal edge of the board cases
      let borderCorrection = function() {
        if ((board[index].id[0] === 'a'
        || board[index].id[0] === 'b')
        && (board[tempMove].id[0] === 'g'
        || board[tempMove].id[0] === 'h')) {
          return false
        }
        else if ((state.board[index].id[0] === 'g'
        || board[index].id[0] === 'h')
        && (board[tempMove].id[0] === 'a'
        || board[tempMove].id[0] === 'b')) {
          return false
        }
        else return true
      }
      
      if (tempMove >= 0 && tempMove <= 63 && borderCorrection()) {
        knightAttacks.push(tempMove)
      }
    });

    return knightAttacks
  }
}

class Pawn extends Piece {

  moves(index, color) {
    let legalPawnMoves = []
    var possiblePawnMoves = []
    var possiblePawnCaptures = []
    // index of possible EnPassant move
    if (state.enPassantTarget) {
    var epIndex = state.board.findIndex(field => field.id === state.enPassantTarget)
    }
    
    if (color === 'white') {
      possiblePawnMoves = [-8]
      possiblePawnCaptures = [-9, -7]
      let startPosition = [48, 49, 50, 51, 52, 53, 54, 55]
      if (startPosition.includes(index)) {
        possiblePawnMoves.push(-16)
      }
    }
    else if (color === 'black') {
      possiblePawnMoves = [8]
      possiblePawnCaptures = [7, 9]
      let startPosition = [8, 9, 10, 11, 12, 13, 14, 15]
      if (startPosition.includes(index)) {
        possiblePawnMoves.push(16)
      }
    }

    possiblePawnMoves.forEach(element => {
      let tempMove = index + element
      if (tempMove >= 0 && tempMove <=63
        && state.board[tempMove].display === null) {
          legalPawnMoves.push(tempMove)
      }
    });

    possiblePawnCaptures.forEach(element => {
      let tempMove = index + element

      // correction for horizontal edge of the board cases
      let borderCorrection = function() {
        if (state.board[index].id[0] === 'a'
        && state.board[tempMove].id[0] === 'h'
        || state.board[index].id[0] === 'h'
        && state.board[tempMove].id[0] === 'a') {
          return false
        }
        else return true
      }

      if (tempMove >= 0 && tempMove <= 63 && borderCorrection()) {

        if (state.board[tempMove].display) {
          if (color !== state.board[tempMove].display.color) {
            legalPawnMoves.push(tempMove)
          }
        }
        // possible EnPassant move
        else if (epIndex) {
          if (color === 'white' && tempMove === epIndex - 8
            || color === 'black' && tempMove === epIndex + 8) {
              legalPawnMoves.push(tempMove)
          }
        }
      }
    });

    legalPawnMoves = methods.filterMoves(legalPawnMoves, index)

    return legalPawnMoves
  }

  // needed for overall white and black attacked fields, 
  // without forward moves, includes empty fields and own pieces
  attacks(index, board, color) {
    let pawnAttacks = []
    var possiblePawnCaptures = []
    if (color === 'white') {
      possiblePawnCaptures = [-9, -7]
    }
    else if (color === 'black') {
      possiblePawnCaptures = [7, 9]
    }

    possiblePawnCaptures.forEach(element => {
      let tempMove = index + element 

      // correction for horizontal edge of the board cases
      let borderCorrection = function() {
        if (board[index].id[0] === 'a'
        && board[tempMove].id[0] === 'h'
        || board[index].id[0] === 'h'
        && board[tempMove].id[0] === 'a') {
          return false
        }
        else return true
      }

      if (tempMove >= 0 && tempMove <= 63 && borderCorrection()) {
        pawnAttacks.push(tempMove)
      }
    });

    return pawnAttacks
  }
}

class Queen extends Piece {

  moves(index, color) {
    let legalQueenMoves = [...Bishop.prototype.moves(index, color),...Rook.prototype.moves(index, color)]
    
    return legalQueenMoves
  }

  //needed for overall white and black attacked fields
  //includes first own piece
  attacks(index, board) {
    let queenAttacks = [...Bishop.prototype.attacks(index, board),...Rook.prototype.attacks(index, board)]

    return queenAttacks
  }  
}

const whiteKing = reactive(new King('K', 'K', 'white', '/assets/set1/whiteKing.svg'))
const whiteQueen = reactive(new Queen('Q', 'Q', 'white', '/assets/set1/whiteQueen.svg'))
const whiteRook = reactive(new Rook('R', 'R', 'white', '/assets/set1/whiteRook.svg'))
const whiteBishop = reactive(new Bishop('B', 'B', 'white', '/assets/set1/whiteBishop.svg'))
const whiteKnight = reactive(new Knight('N', 'N', 'white', '/assets/set1/whiteKnight.svg'))
const whitePawn = reactive(new Pawn('P', '', 'white', '/assets/set1/whitePawn.svg'))
const blackKing = reactive(new King('k', 'K', 'black', '/assets/set1/blackKing.svg'))
const blackQueen = reactive(new Queen('q', 'Q', 'black', '/assets/set1/blackQueen.svg'))
const blackRook = reactive(new Rook('r', 'R', 'black', '/assets/set1/blackRook.svg'))
const blackBishop = reactive(new Bishop('b', 'B', 'black', '/assets/set1/blackBishop.svg'))
const blackKnight = reactive(new Knight('n', 'N', 'black', '/assets/set1/blackKnight.svg'))
const blackPawn = reactive(new Pawn('p', '', 'black', '/assets/set1/blackPawn.svg'))

// save game data
class Game {
  constructor (id, white, black, result, date, 
  site, event, moves, gameHistory, selected) {
    this.id = id
    this.white = white
    this.black = black
    this.result = result
    this.date = date
    this.site = site
    this.event = event
    this.moves = moves
    this.gameHistory = gameHistory
    this.selected = selected
  }
  setHeader() {
    let header = this.white + ' - ' + this.black + ' ' + this.date + ' ' + this.result
    return header
  }
}

const state = reactive({

  // board display
  board: [
    {id: 'a8', color: 'light', display: blackRook, highlight: false, selected: false},
    {id: 'b8', color: 'dark', display: blackKnight, highlight: false, selected: false},
    {id: 'c8', color: 'light', display: blackBishop, highlight: false, selected: false},
    {id: 'd8', color: 'dark', display: blackQueen, highlight: false, selected: false},
    {id: 'e8', color: 'light', display: blackKing, highlight: false, selected: false},
    {id: 'f8', color: 'dark', display: blackBishop, highlight: false, selected: false},
    {id: 'g8', color: 'light', display: blackKnight, highlight: false, selected: false},
    {id: 'h8', color: 'dark', display: blackRook, highlight: false, selected: false},
    {id: 'a7', color: 'dark', display: blackPawn, highlight: false, selected: false},
    {id: 'b7', color: 'light', display: blackPawn, highlight: false, selected: false},
    {id: 'c7', color: 'dark', display: blackPawn, highlight: false, selected: false},
    {id: 'd7', color: 'light', display: blackPawn, highlight: false, selected: false},
    {id: 'e7', color: 'dark', display: blackPawn, highlight: false, selected: false},
    {id: 'f7', color: 'light', display: blackPawn, highlight: false, selected: false},
    {id: 'g7', color: 'dark', display: blackPawn, highlight: false, selected: false},
    {id: 'h7', color: 'light', display: blackPawn, highlight: false, selected: false},
    {id: 'a6', color: 'light', display: null, highlight: false, selected: false},
    {id: 'b6', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'c6', color: 'light', display: null, highlight: false, selected: false},
    {id: 'd6', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'e6', color: 'light', display: null, highlight: false, selected: false},
    {id: 'f6', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'g6', color: 'light', display: null, highlight: false, selected: false},
    {id: 'h6', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'a5', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'b5', color: 'light', display: null, highlight: false, selected: false},
    {id: 'c5', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'd5', color: 'light', display: null, highlight: false, selected: false},
    {id: 'e5', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'f5', color: 'light', display: null, highlight: false, selected: false},
    {id: 'g5', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'h5', color: 'light', display: null, highlight: false, selected: false},
    {id: 'a4', color: 'light', display: null, highlight: false, selected: false},
    {id: 'b4', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'c4', color: 'light', display: null, highlight: false, selected: false},
    {id: 'd4', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'e4', color: 'light', display: null, highlight: false, selected: false},
    {id: 'f4', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'g4', color: 'light', display: null, highlight: false, selected: false},
    {id: 'h4', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'a3', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'b3', color: 'light', display: null, highlight: false, selected: false},
    {id: 'c3', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'd3', color: 'light', display: null, highlight: false, selected: false},
    {id: 'e3', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'f3', color: 'light', display: null, highlight: false, selected: false},
    {id: 'g3', color: 'dark', display: null, highlight: false, selected: false},
    {id: 'h3', color: 'light', display: null, highlight: false, selected: false},
    {id: 'a2', color: 'light', display: whitePawn, highlight: false, selected: false},
    {id: 'b2', color: 'dark', display: whitePawn, highlight: false, selected: false},
    {id: 'c2', color: 'light', display: whitePawn, highlight: false, selected: false},
    {id: 'd2', color: 'dark', display: whitePawn, highlight: false, selected: false},
    {id: 'e2', color: 'light', display: whitePawn, highlight: false, selected: false},
    {id: 'f2', color: 'dark', display: whitePawn, highlight: false, selected: false},
    {id: 'g2', color: 'light', display: whitePawn, highlight: false, selected: false},
    {id: 'h2', color: 'dark', display: whitePawn, highlight: false, selected: false},
    {id: 'a1', color: 'dark', display: whiteRook, highlight: false, selected: false},
    {id: 'b1', color: 'light', display: whiteKnight, highlight: false, selected: false},
    {id: 'c1', color: 'dark', display: whiteBishop, highlight: false, selected: false},
    {id: 'd1', color: 'light', display: whiteQueen, highlight: false, selected: false},
    {id: 'e1', color: 'dark', display: whiteKing, highlight: false, selected: false},
    {id: 'f1', color: 'light', display: whiteBishop, highlight: false, selected: false},
    {id: 'g1', color: 'dark', display: whiteKnight, highlight: false, selected: false},
    {id: 'h1', color: 'light', display: whiteRook, highlight: false, selected: false}
  ],

  // rotate board indicator
  rotateBoard: false,

  // show coordinates indicator
  showCoordinates: false,

  // show possible moves indicator
  showMoves: false,

  // coordinates
  verticalCoordinates: [
    {id: "8"},
    {id: "7"},
    {id: "6"},
    {id: "5"},
    {id: "4"},
    {id: "3"},
    {id: "2"},
    {id: "1"}
  ],

  horizontalCoordinates: [
    {id: "a"},
    {id: "b"},
    {id: "c"},
    {id: "d"},
    {id: "e"},
    {id: "f"},
    {id: "g"},
    {id: "h"}
  ],

  // side to move indicator
  whiteToMove: true,

  // indicator to distinguish between 1st and 2nd part of the move
  halfMove: 1,

  moveCount: 0,
  
  // temporary move data
  startField: {},
  pieceToPlay: {},
  endField: {},
  fieldIndex: null,

  messageBoard: 'Welcome to ChessApp!',

  gameHistory: ['rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNRTSLXY/0'],
  // history to track threefold repetition
  threefoldHistory: ['rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNRT'],

  // indicator to navigate through game history
  gameHistoryIndex: 0,

  savedGames: [],

  // game selected to be loaded
  selectedGame: {},

  // target for possible en passant move
  enPassantTarget: '',

  // game data
  white: '',
  black: '',
  result: '',
  date: '',
  site: '',
  event: '',
  moves: '',

  // to distinguish between regular and loaded game
  gameInProgress: true,
  // to prevent playing moves while going back through game history
  playMode: true,
  
  // moves available to piece currently moving
  legalMoves: [],

  // all moves available to one side in the next move
  // if empty indicates either checkmate or stalemate
  allLegalMoves: [],

  // fields under attack by both sides
  attackedByWhite: [],
  attackedByBlack: [],

  // indicators if kings are in check
  whiteInCheck: false,
  blackInCheck: false,

  // tracking castling rights
  whiteShortCastling: true,
  whiteLongCatling: true,
  blackShortCastling: true,
  blackLongCastling: true,

  // count for 50 moves draw rule 
  // (it needs to reach 100 for draw (50 moves from both))
  fiftyMovesCount: 0,

  // modals
  promotionModal: false,
  editModal: false,
  saveModal: false,
  loadModal: false

})

//-------------------------

const methods = {

  rotateBoard() {
    state.rotateBoard = !state.rotateBoard
    
    // adjust for coordinates rotation
    state.verticalCoordinates.reverse()
    state.horizontalCoordinates.reverse()
  },

  showCoordinates() {
    state.showCoordinates = !state.showCoordinates
  },

  showMoves() {
    state.showMoves = !state.showMoves
  },

  startNewGame() {
    // generate starting position
    let i = 0
    const startPosition = 
      [blackRook, blackKnight, blackBishop, blackQueen, 
      blackKing, blackBishop, blackKnight, blackRook,
      blackPawn, blackPawn, blackPawn, blackPawn,
      blackPawn, blackPawn, blackPawn, blackPawn,
      null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null,
      whitePawn, whitePawn, whitePawn, whitePawn,
      whitePawn, whitePawn, whitePawn, whitePawn,
      whiteRook, whiteKnight, whiteBishop, whiteQueen,
      whiteKing, whiteBishop, whiteKnight, whiteRook]
    
    state.board.forEach(element => {
      element.display = startPosition[i]
      i += 1
    });  
    // reset everything
    state.halfMove = 1
    state.moveCount = 0
    state.whiteToMove = true,
    state.startField = {},
    state.pieceToPlay = {},
    state.endField = {},
    state.white = '',
    state.black = '',
    state.result = '',
    state.date = '',
    state.site = '',
    state.event = '',
    state.moves = '',
    state.messageBoard = 'New Game'
    state.gameHistory = ['rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNRTSLXY/0']
    state.gameHistoryIndex = 0
    state.threefoldHistory = ['rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNRT']
    state.gameInProgress = true
    state.playMode = true
    state.whiteShortCastling = true
    state.whiteLongCatling = true
    state.blackShortCastling = true
    state.blackLongCastling = true
    state.fiftyMovesCount = 0
    this.resetHighlights()
    this.resetSelected()
  },

  chessSet1() {
    whiteKing.image = '/assets/set1/whiteKing.svg'
    whiteQueen.image = '/assets/set1/whiteQueen.svg'
    whiteRook.image = '/assets/set1/whiteRook.svg'
    whiteBishop.image = '/assets/set1/whiteBishop.svg'
    whiteKnight.image = '/assets/set1/whiteKnight.svg'
    whitePawn.image = '/assets/set1/whitePawn.svg'
    blackKing.image = '/assets/set1/blackKing.svg'
    blackQueen.image = 'assets/set1/blackQueen.svg'
    blackRook.image = '/assets/set1/blackRook.svg'
    blackBishop.image = '/assets/set1/blackBishop.svg'
    blackKnight.image = '/assets/set1/blackKnight.svg'
    blackPawn.image = '/assets/set1/blackPawn.svg'
  },

  chessSet2() {
    whiteKing.image = '/assets/set2/whiteKing2.svg'
    whiteQueen.image = '/assets/set2/whiteQueen2.svg'
    whiteRook.image = '/assets/set2/whiteRook2.svg'
    whiteBishop.image = '/assets/set2/whiteBishop2.svg'
    whiteKnight.image = '/assets/set2/whiteKnight2.svg'
    whitePawn.image = '/assets/set2/whitePawn2.svg'
    blackKing.image = '/assets/set2/blackKing2.svg'
    blackQueen.image = 'assets/set2/blackQueen2.svg'
    blackRook.image = '/assets/set2/blackRook2.svg'
    blackBishop.image = '/assets/set2/blackBishop2.svg'
    blackKnight.image = '/assets/set2/blackKnight2.svg'
    blackPawn.image = '/assets/set2/blackPawn2.svg'
  },

  chessSet3() {
    whiteKing.image = '/assets/set3/whiteKing3.svg'
    whiteQueen.image = '/assets/set3/whiteQueen3.svg'
    whiteRook.image = '/assets/set3/whiteRook3.svg'
    whiteBishop.image = '/assets/set3/whiteBishop3.svg'
    whiteKnight.image = '/assets/set3/whiteKnight3.svg'
    whitePawn.image = '/assets/set3/whitePawn3.svg'
    blackKing.image = '/assets/set3/blackKing3.svg'
    blackQueen.image = 'assets/set3/blackQueen3.svg'
    blackRook.image = '/assets/set3/blackRook3.svg'
    blackBishop.image = '/assets/set3/blackBishop3.svg'
    blackKnight.image = '/assets/set3/blackKnight3.svg'
    blackPawn.image = '/assets/set3/blackPawn3.svg'
  },

  checkForCastling() {
    if (state.pieceToPlay.id === 'K' 
    && state.startField.id === 'e1' 
    && state.endField.id === 'g1') {
      state.board[63].display = null
      state.board[61].display = whiteRook
    }
    else if (state.pieceToPlay.id === 'K'
    && state.startField.id === 'e1'
    && state.endField.id === 'c1') {
      state.board[56].display = null
      state.board[59].display = whiteRook
    }
    else if (state.pieceToPlay.id === 'k'
    && state.startField.id === 'e8'
    && state.endField.id === 'g8') {
      state.board[7].display = null
      state.board[5].display = blackRook 
    }
    else if (state.pieceToPlay.id === 'k'
    && state.startField.id === 'e8'
    && state.endField.id === 'c8') {
      state.board[0].display = null
      state.board[3].display = blackRook
    }
  },

  checkForPromotion() {
    if (state.pieceToPlay.id === 'p'
    && state.endField.id[1] === '1' 
    || state.pieceToPlay.id === 'P' 
    && state.endField.id[1] === '8') {
      state.promotionModal = true
    }
  },

  compareLines(id1, id2) {
    return id1[0] === id2[0]
  },

  compareRows(id1, id2) {
    return id1[1] === id2[1]
  },

  writeNotation() {
    // add notation for pawn captures
    if (state.pieceToPlay.id.toUpperCase() === 'P' 
    && !this.compareLines(state.startField.id, state.endField.id)) {
      return state.startField.id.substring(0, 1) + state.endField.id + ' '
    }
    // add notation for castling
    else if (state.pieceToPlay.id === 'K' 
    && state.startField.id === 'e1' 
    && state.endField.id === 'g1'
    || state.pieceToPlay.id === 'k' 
    && state.startField.id === 'e8'
    && state.endField.id === 'g8') {
      return '0-0 '
    }
    else if (state.pieceToPlay.id === 'K' 
    && state.startField.id === 'e1'
    && state.endField.id === 'c1'
    || state.pieceToPlay.id === 'k' 
    && state.startField.id === 'e8'
    && state.endField.id === 'c8') {
      return '0-0-0 '
    }
    else {
      return state.pieceToPlay.notation + state.endField.id + ' '
    }
  },

  // convert board position to string for game history
  boardToString() {
    let currentPositionString = ''
    // add piece id
    state.board.forEach(element => {
      if (element.display === null) {
        currentPositionString += '0'
      }
      else {
        currentPositionString += element.display.id
      }
    }); 
    // add side to move info
    if (state.whiteToMove) {
      currentPositionString += 'T'
    }
    else {
      currentPositionString += 'F'
    }
    // add castling rights info
    if (state.whiteShortCastling) {
      currentPositionString += 'S'
    }
    else {
      currentPositionString += 's'
    }

    if (state.whiteLongCatling) {
      currentPositionString += 'L'
    }
    else {
      currentPositionString += 'l'
    }

    if (state.blackShortCastling) {
      currentPositionString += 'X'
    }
    else {
      currentPositionString += 'x'
    }

    if (state.blackLongCastling) {
      currentPositionString += 'Y'
    }
    else {
      currentPositionString += 'y'
    }

    // add move count
    currentPositionString += '/' + state.moveCount.toString()
    
    return currentPositionString
  },

  // convert string from game history to board position
  stringToBoard(str) {
    for (var i = 0; i <= 68; i++) {
      switch (str[i]) {
        case "K":
          state.board[i].display = whiteKing
          break
        case 'k':
          state.board[i].display = blackKing
          break
        case 'Q':
          state.board[i].display = whiteQueen
          break
        case 'q':
          state.board[i].display = blackQueen
          break 
        case 'R':
          state.board[i].display = whiteRook
          break 
        case 'r':
          state.board[i].display = blackRook
          break 
        case 'B':
          state.board[i].display = whiteBishop
          break 
        case 'b':
          state.board[i].display = blackBishop
          break 
        case 'N':
          state.board[i].display = whiteKnight
          break 
        case 'n':
          state.board[i].display = blackKnight
          break 
        case 'P':
          state.board[i].display = whitePawn
          break 
        case 'p':
          state.board[i].display = blackPawn
          break 
        case '0':
          state.board[i].display = null
          break 
        case 'T':
          state.whiteToMove = true
          break 
        case 'F':
          state.whiteToMove = false
          break 
        case 'S':
          state.whiteShortCastling = true
          break
        case 's':
          state.whiteShortCastling = false
          break
        case 'L':
          state.whiteLongCatling = true
          break
        case 'l':
          state.whiteLongCatling = false
          break
        case 'X':
          state.blackShortCastling = true
          break
        case 'x':
          state.blackShortCastling = false
          break
        case 'Y':
          state.blackLongCastling = true
          break
        case 'y':
          state.blackLongCastling = false 
      }
    } 
    state.moveCount = parseInt(str.substring(str.indexOf('/') +1)) || 0
  },

  // navigate game history
  skipToStart() {
    state.halfMove = 1
    this.resetHighlights()
    this.resetSelected()
    state.playMode = false
    state.gameHistoryIndex = 0
    this.stringToBoard(state.gameHistory[state.gameHistoryIndex])
    state.messageBoard = 'View Mode'
  },

  skipToEnd() {
    state.gameHistoryIndex = state.gameHistory.length - 1
    state.playMode = true
    this.stringToBoard(state.gameHistory[state.gameHistoryIndex])
    if (state.gameInProgress === true) {
      state.messageBoard = 'Game in progress'
    }
    else {
      state.messageBoard = 'View Mode'
    } 
  },

  oneMoveBack() {
    state.halfMove = 1
    this.resetHighlights()
    this.resetSelected()
    state.playMode = false
    state.gameHistoryIndex -= 1
    if (state.gameHistoryIndex < 0) {
      state.gameHistoryIndex = 0
    }
    this.stringToBoard(state.gameHistory[state.gameHistoryIndex])
    state.messageBoard = 'View Mode'
  },

  oneMoveForward() {
    state.gameHistoryIndex += 1
    if (state.gameHistoryIndex > state.gameHistory.length - 1) {
      state.gameHistoryIndex = state.gameHistory.length - 1
    }
    this.stringToBoard(state.gameHistory[state.gameHistoryIndex])
    if (state.gameHistoryIndex === state.gameHistory.length - 1) {
      state.playMode = true
    }
    if (state.gameInProgress === true) {
      state.messageBoard = 'Game in progress'
    }
    else {
      state.messageBoard = 'View Mode'
    } 
  },

  undoMove() {
    if (state.gameInProgress && state.playMode 
      && state.gameHistoryIndex === state.gameHistory.length -1) {
      state.halfMove = 1
      this.resetHighlights()
      this.resetSelected()

      state.gameHistoryIndex -= 1
      if (state.gameHistoryIndex < 0) {
        state.gameHistoryIndex = 0
      }
      this.stringToBoard(state.gameHistory[state.gameHistoryIndex])
      this.removeLastMove()
      if (state.gameHistory.length > 1) {
        state.gameHistory.pop()
      }
      if (state.threefoldHistory.length > 1) {
        state.threefoldHistory.pop()
      }
      state.messageBoard = 'Last move taken back'
    }
  },

  removeLastMove() {
    let movesArr = state.moves.trim().split(" ")
    if (state.whiteToMove) {
      movesArr.splice(-2)
    }
    else {
      movesArr.splice(-1)
    }
    state.moves = movesArr.join(" ")
    state.moves += ' '
  },

  // promote pieces
  promotePiece(piece) {
    if (state.pieceToPlay.color === 'white'){
      switch (piece) {
        case 'Q':
          state.endField.display = whiteQueen
          state.moves += 'Q '
          break
        case 'R':
          state.endField.display = whiteRook
          state.moves += 'R '
          break
        case 'B':
          state.endField.display = whiteBishop
          state.moves += 'B '
          break
        case 'N':
          state.endField.display = whiteKnight
          state.moves += 'N '
          break
      }
    } 
    else {
      switch (piece) {
        case 'Q':
          state.endField.display = blackQueen
          state.moves += 'Q '
          break
        case 'R':
          state.endField.display = blackRook
          state.moves += 'R '
          break
        case 'B':
          state.endField.display = blackBishop
          state.moves += 'B '
          break
        case 'N':
          state.endField.display = blackKnight
          state.moves += 'N '
          break
      }
    }
    state.promotionModal = false
    // remove space between last pawn move and added piece notation
    state.moves = state.moves.slice(0, -3) + state.moves.slice(-2)
    // correction for asynchronous code
    state.gameHistory.pop()
    state.gameHistory.push(this.boardToString())
    state.threefoldHistory.pop()
    state.threefoldHistory.push(this.boardToString().slice(0, 65))
  },

  saveGame() {
    let tempGame = reactive(new Game(Date.now(), state.white, state.black, state.result, 
    state.date, state.site, state.event, state.moves, state.gameHistory, false))

    state.savedGames.push(tempGame)
    state.saveModal = false
  },

  loadGame() {
    if (Object.keys(state.selectedGame).length !== 0) {
      state.white = state.selectedGame.white
      state.black = state.selectedGame.black
      state.result = state.selectedGame.result
      state.date = state.selectedGame.date
      state.site = state.selectedGame.site
      state.event = state.selectedGame.event
      state.moves = state.selectedGame.moves
      state.gameHistory = state.selectedGame.gameHistory
      this.skipToStart()
      state.loadModal = false
      state.gameInProgress = false
    }
  },

  setEnPassantTarget() {
    state.enPassantTarget = ''
    if (state.pieceToPlay.id === 'P'
    && state.startField.id[1] === '2'
    && state.endField.id[1] === '4' 
    || state.pieceToPlay.id === 'p'
    && state.startField.id[1] === '7'
    && state.endField.id[1] === '5') {
      state.enPassantTarget = state.endField.id
    }
  },

  checkForEnPassant() {
    if (state.enPassantTarget) {
      let epIndex = state.board.findIndex(field => field.id === state.enPassantTarget)
      let endFieldIndex = state.board.findIndex(field => field.id === state.endField.id)

      if (state.pieceToPlay.id === 'P'
        && epIndex === endFieldIndex + 8) {
          state.board[epIndex].display = null
        }
        else if (state.pieceToPlay.id === 'p'
        && epIndex === endFieldIndex - 8) {
          state.board[epIndex].display = null
        }
    }    
  },

  checkSideToMove(piece) {
    if (state.whiteToMove && piece.color === 'white'
      || !state.whiteToMove && piece.color === 'black') {
        return false
      }
    else return true
  },

  setLegalMoves(index, piece) {
    state.legalMoves = []
    state.legalMoves.push.apply(state.legalMoves, piece.moves(index, piece.color))
  },

  updateCastlingRights(id, index, color) {
    if (color === 'white') {
      if (id === 'K') {
        state.whiteShortCastling = false
        state.whiteLongCatling = false
      }
      else if (id === 'R') {
        if (index === 56) {
          state.whiteLongCatling = false
        }
        else if (index === 63) {
          state.whiteShortCastling = false
        }
      }
    }
    else if (color === 'black') {
      if (id === 'k') {
        state.blackShortCastling = false
        state.blackLongCastling = false
      }
      else if (id === 'r') {
        if (index === 0) {
          state.blackLongCastling = false
        }
        else if (index === 7) {
          state.blackShortCastling = false
        }
      }
    }
  },

  resetHighlights() {
    state.board.forEach(element => {
      element.highlight = false
    });
  },

  resetSelected() {
    state.board.forEach(element => {
      element.selected = false
    });
  },

  resetTemporaryData() {
    state.halfMove = 1
    state.startField = {}
    state.pieceToPlay = {}
    state.fieldIndex = null
    this.resetHighlights()
  },

  // calculates all fields attacked by white and black and if kings are in check
  calculateAttacks(board) {
    state.attackedByWhite = []
    state.attackedByBlack = []
    var whiteKingIndex = null
    var blackKingIndex = null


    board.forEach(element => {
      if (element.display !== null) {
        let elIndex = board.findIndex(field => field.id === element.id)

        if (element.display.color === 'white') {
          state.attackedByWhite.push.apply(state.attackedByWhite, element.display.attacks(elIndex, board, 'white'))
        }
        else if (element.display.color === 'black') {
          state.attackedByBlack.push.apply(state.attackedByBlack, element.display.attacks(elIndex, board, 'black'))
        }

        if (element.display.id === 'K') {
          whiteKingIndex = elIndex
        }
        if (element.display.id === 'k') {
          blackKingIndex = elIndex
        }
      }
    });
    
    state.attackedByWhite = [...new Set(state.attackedByWhite)]
    state.attackedByBlack = [...new Set(state.attackedByBlack)]

    // set kings in check values
   if (state.attackedByBlack.includes(whiteKingIndex)){
      state.whiteInCheck = true
    }
    else {
      state.whiteInCheck = false
    }
    
    if (state.attackedByWhite.includes(blackKingIndex)) {
      state.blackInCheck = true
    }
    else { 
      state.blackInCheck = false
    }
  },

  kingNotInCheck(index, move) {

    let tempBoard = []
    let whiteAttacks = []
    let blackAttacks = []
    let whiteKingIndex = null
    let blackKingIndex = null
    let whiteInCheck = null
    let blackInCheck = null

    // create experimental board
    tempBoard = _cloneDeep(state.board)

    // play potential move on experimental board
    let piece = tempBoard[index].display
    tempBoard[index].display = null
    tempBoard[move].display = piece

    // determine if king is in check after potential move
    tempBoard.forEach(element => {
      
      if (element.display !== null) {
        let elIndex = tempBoard.findIndex(field => field.id === element.id)

        if (element.display.color === 'white') {
          whiteAttacks.push.apply(whiteAttacks, element.display.attacks(elIndex, tempBoard, 'white'))
        }
        else if (element.display.color === 'black') {
          blackAttacks.push.apply(blackAttacks, element.display.attacks(elIndex, tempBoard, 'black'))
        }

        if (element.display.id === 'K') {
          whiteKingIndex = elIndex
        }
        if (element.display.id === 'k') {
          blackKingIndex = elIndex
        }
      }
    });

    whiteAttacks = [...new Set(whiteAttacks)]
    blackAttacks = [...new Set(blackAttacks)]

    if (blackAttacks.includes(whiteKingIndex)){
      whiteInCheck = true
    }
    else {
      whiteInCheck = false
    }
    
    if (whiteAttacks.includes(blackKingIndex)) {
      blackInCheck = true
    }
    else { 
      blackInCheck = false
    }

    if (state.whiteToMove && whiteInCheck 
    || !state.whiteToMove && blackInCheck) {
      return false
    }
     
    else return true
  },

  // filter away moves that leave king in check
  filterMoves(arr, index) {
    let tempArr =[]
    arr.forEach(element => {
      if (this.kingNotInCheck(index, element)) {
        tempArr.push(element)
      }
    });
    return tempArr
  },

  calculateAllLegalMoves(board) {
    state.allLegalMoves = []

    if (state.whiteToMove) {
      board.forEach(element => {
        let elIndex = board.findIndex(field => field.id === element.id)
        if (element.display !== null && element.display.color === 'white') {
        state.allLegalMoves.push.apply(state.allLegalMoves, element.display.moves(elIndex, 'white'))
        }
      });
    }
    else {
      board.forEach(element => {
        let elIndex = board.findIndex(field => field.id === element.id)
        if (element.display !== null && element.display.color === 'black') {
          state.allLegalMoves.push.apply(state.allLegalMoves, element.display.moves(elIndex, 'black'))
        }
      });
    }
    state.allLegalMoves = [...new Set(state.allLegalMoves)]
  },

  //check if the same position occured 3 times (with the same player on the move)
  threefoldRepetition() {
    for (var element of state.threefoldHistory) {
      var count = 0
      for (var i = 0; i < state.threefoldHistory.length; i++) {
        if (state.threefoldHistory[i] === element) {
          count +=1
        if (count === 3) {
          state.messageBoard = 'Draw by threefold repetition'
          return true
        }
        }
      }
    }
    return false
  },
    

  fiftyMovesDraw() {
    if (state.fiftyMovesCount === 100) {
      state.messageBoard = 'Draw by 50 moves rule'
      return true
    }
    else return false
  },

  stalemate() {
    if (state.whiteToMove && !state.whiteInCheck && state.allLegalMoves.length === 0) {
      state.messageBoard = 'Draw by stalemate'
      return true
    }
    else if (!state.whiteToMove && !state.blackInCheck && state.allLegalMoves.length === 0) {
      state.messageBoard = 'Draw by stalemate'
      return true
    }
    else return false
  },

  insufficientMaterial() {
    let piecesInPlayWhite = []
    let piecesInPlayBlack = []
    let allPiecesInPlay = []

    state.board.forEach(element => {
      if (element.display !== null) {
        if (element.display.color === 'white') {
          piecesInPlayWhite.push({id: element.display.id, color: element.color})
          allPiecesInPlay.push(element.display.id)
        }
        else {
          piecesInPlayBlack.push({id: element.display.id, color: element.color})
          allPiecesInPlay.push(element.display.id)
        }
      }
    });

    if (allPiecesInPlay.length === 4
      && piecesInPlayWhite.some(item => item.id === 'B' && item.color === 'light')
      && piecesInPlayBlack.some(item => item.id === 'b' && item.color === 'light')) {
        state.messageBoard = 'Draw by insufficient material'
        return true
      }
    else if (allPiecesInPlay.length === 4
      && piecesInPlayWhite.some(item => item.id === 'B' && item.color === 'dark')
      && piecesInPlayBlack.some(item => item.id === 'b' && item.color === 'dark')) {
        state.messageBoard = 'Draw by insufficient material'
        return true
      }
    else if (allPiecesInPlay.length === 3) {
      if (allPiecesInPlay.includes('B')
      || allPiecesInPlay.includes('b')
      || allPiecesInPlay.includes('N')
      || allPiecesInPlay.includes('n')) {
        state.messageBoard = 'Draw by insufficient material'
        return true
      }
    }
    else if (allPiecesInPlay.length === 2) {
      state.messageBoard = 'Draw by insufficient material'
      return true
    }
    else return false
  },

  checkmate() {
    if (state.whiteToMove && state.whiteInCheck && state.allLegalMoves.length === 0) {
      state.result = '0-1'
      state.moves += '0-1'
      return true
    }
    else if (!state.whiteToMove && state.blackInCheck && state.allLegalMoves.length === 0) {
      state.result = '1-0'
      state.moves += '1-0'
      return true
    }
    else return false
  },

  checkDrawConditions() {
    if (this.threefoldRepetition()
    || this.fiftyMovesDraw()
    || this.stalemate()
    || this.insufficientMaterial()) {
    return true
  }
  else return false
  },

  playMove(field) {
    if (state.gameInProgress && state.playMode) {
      if (state.halfMove === 1) {
        this.resetSelected()
        // check if field is empty
        if (field.display === null) {
          state.messageBoard = 'Please click on a piece'
        }
        else {
          // check if it's this side's turn to move
          if (this.checkSideToMove(field.display)) {
            let message = state.whiteToMove ? 'black' : 'white' 
            state.messageBoard = 'It is not ' + `${message}` + ' turn to move'
          }
          else {
            field.selected = true
            // collect temporary move data
            state.startField = field
            state.pieceToPlay = field.display
            state.fieldIndex = state.board.findIndex(element => element.id === field.id)
            // calculate possible legal moves
            this.setLegalMoves(state.fieldIndex, state.pieceToPlay)
            state.halfMove += 1
            state.messageBoard = 'Game in progress'
          }
        }
      }
      else {
        state.fieldIndex = state.board.findIndex(element => element.id === field.id)
        // deselect piece to play
        if (state.startField.id === field.id) {
          this.resetTemporaryData()
          field.selected = false
        }
        //check for own attack
        else if (field.display !== null && state.pieceToPlay.color === field.display.color) {
          state.messageBoard = 'Cannot attack your own pieces'
        }
        // check if move is legal
        else if (!state.legalMoves.includes(state.fieldIndex)) {
          state.messageBoard = 'That is not a legal move'
        }
        else {
          field.selected = true
          // remember the piece standing on endfield if any
          let pieceTaken = field.display
          // execute move
          state.endField = field
          state.startField.display = null
          state.endField.display = state.pieceToPlay
          this.checkForEnPassant()
          this.checkForCastling()
          this.checkForPromotion()
          this.setEnPassantTarget()
          this.updateCastlingRights(state.pieceToPlay.id, state.fieldIndex, state.pieceToPlay.color)
          this.resetHighlights()
          // reset halfmove count
          state.halfMove = 1
          // add move number after white move
          if (state.whiteToMove) {
            state.moveCount += 1
            state.moves += `${state.moveCount}` + '. '
          }
          // add move notation
          state.moves += this.writeNotation()
          // change side to play
          state.whiteToMove = !state.whiteToMove
          // add position to game history
          state.gameHistory.push(this.boardToString())
          // add position to threefold history
          state.threefoldHistory.push(this.boardToString().slice(0, 65))
          // update game history index
          state.gameHistoryIndex += 1
          if (state.gameHistoryIndex > state.gameHistory.length - 1) {
            state.gameHistoryIndex = state.gameHistory.length - 1
          }
          // update 50 moves count
          if (pieceTaken !== null || state.pieceToPlay.id.toUpperCase() === 'P') {
            state.fiftyMovesCount = 0
          }
          else {state.fiftyMovesCount += 1}
          // calculate attacks and all legal moves for draw and checkmate conditions
          this.calculateAttacks(state.board)
          this.calculateAllLegalMoves(state.board)
          // check for draw
          if (this.checkDrawConditions()) {
            state.gameInProgress = false
            state.result = '1/2'
            state.moves += '1/2'
          }
          // check for checkmate
          else if (this.checkmate()) {
            state.gameInProgress = false
            state.messageBoard = 'Checkmate!'
          }
          else{
            if (state.whiteInCheck || state.blackInCheck) {
              state.messageBoard = 'Check!'
            }
            else {
            state.messageBoard = 'Game in progress'
            }
          }
        }
      }
    }    
  }
}

// highlight legal moves
watch(
  () => state.legalMoves,
  (value) => {
    state.board.forEach(element => {
      if (value.includes(state.board.findIndex(field => field.id === element.id))) {
        element.highlight = true
      }
      else {
        element.highlight =false
      }
    });
  }
)

export default {
  state,
  methods
}