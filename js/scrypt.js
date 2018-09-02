/* script
* Bogdan Pasterak
* TODO: sctipt support Box Word game
* 25/8/2018
*/

// Variables used in the game
const GAME = {
  side: 0,
  blocks: [],
  letters: [],
  pos: [],
  words: [],
  matchedWord: [],
  moves: 0,
  blockade: false,
  intervalID: undefined,
  time: 0,
  mobi: false,
  score: false
};


// TODO: Registration of new events and initialization
$(function() {
  GAME.mobi = function() {
    try{ document.createEvent("TouchEvent"); return true; }
    catch(e){ return false; }
  }();


  //howManyMovesPromise('dupa').then(() => (console.log('Po ptokach')));

  // spreading the elements of the game (for phones in the landscape position )
  $( window ).resize(function() {
    reorganization();
  });
  // events for button and selects
  $('button').click(function() {
    restart();
  });
  restart();

  howManyMoves(GAME.matchedWord[0]);
  // start !
  reorganization();
  //choiceCouples();
});

// TODO: start again
const restart = () => {
  const board = document.getElementById('board');
  // DB words
  if (GAME.words.length == 0) {
    GAME.words = JSON.parse(words);
    if (GAME.mobi) board.addEventListener('touchend', released);
    else board.addEventListener('mouseup', released);

  }
  do {
    // array letters (matchedWord => possible layouts)
    GAME.letters = randomLetters();
    // draw blocks
    resetBoard();
  } while ( win() );
  // not too easy
  GAME.moves = 0;
  document.getElementById('moves').innerHTML ='0';
  // stop clock
  if (GAME.intervalID != undefined) {
    clearInterval(GAME.intervalID);
    GAME.intervalID = undefined;
  }
  GAME.time = 0;
  document.getElementById('time').innerHTML = '0:00';
};

// TODO: Function for redrawing the board
const resetBoard = () => {
  const board = document.getElementById('board');
  // clear board
  board.innerHTML = '';
  GAME.blocks = [];
  GAME.pos = new Array(16);

  // build 15 blocks and set position
  for(var index = 0; index < 15; index++) {
    const block = document.createElement('DIV');
    block.classList.add('square');
    block.setAttribute('id', 's' + index);
    const letter = document.createElement('H1');
    letter.appendChild(document.createTextNode(GAME.letters[index]));
    block.append(letter);
    block.style.width = GAME.side +'px';
    block.style.height = GAME.side +'px';
    block.style.backgroundImage = 'url(./img/m' + (10 + index) + '.png)';
    if (GAME.mobi) block.addEventListener('touchstart', clickLeter);
    else block.addEventListener('mousedown', clickLeter);
    board.append(block);
    GAME.blocks.push(block);
    GAME.pos[index] = index;
  }
  GAME.pos[15] = -1;
};

// TODO: resize window ( turning the phone )
const reorganization = () => {
  const playground = document.getElementById('playground');
  const board = document.getElementById('board');
  const left = document.getElementById('my-col-left');
  const right = document.getElementById('my-col-right');

  // putting playground to the side
  if ( screen.width > screen.height && screen.width < 720) {
   if ( left.contains(playground) ) {
      left.style.width = "40%";
      right.style.width = "57%";
      right.append(playground);
    }
  } else {
  // or back
   if ( right.contains(playground) ) {
      right.style = null;
      left.style = null;
      left.append(playground);
      const footer = document.getElementById('footer');
      left.append(footer);
    }
  }

  // square board
  const rect = playground.getBoundingClientRect();
  const size = Math.floor(((rect.width > rect.height) ? rect.height : rect.width) / 4) * 4;

  if ( GAME.side != size / 4 ) {
    GAME.side = size / 4;
    board.style.width = size + "px";
    board.style.height = size + "px";
    // size of block
    GAME.blocks.forEach((block, index) => {
      block.style.width = GAME.side +'px';
      block.style.height = GAME.side +'px';
      move(index);
    });
  }
};

const released = (e) => {
  //console.log('released');
  GAME.blockade = false;
};
const clickLeter = (e) => {
  //console.log(e.target);
  const nr = parseInt(e.target.id.slice(1));
  const pos = GAME.pos.indexOf(nr);
  const neigh = neighbors(pos);
  let word, n;

  if (! GAME.blockade) {

    if (neigh.includes(-1)) {
      // start clock if stoped
      if (GAME.intervalID == undefined ){
        GAME.intervalID = setInterval(addSecond, 1000);
      }

      const where = GAME.pos.indexOf(-1);
      // swap
      GAME.blockade = true;
      GAME.pos[where] = nr;
      GAME.pos[pos] = -1;
      move(nr);
      GAME.moves++;
      document.getElementById('moves').innerHTML = GAME.moves;
    } else {
      //console.log('shakes');
      shake(nr);
    }
    if ( win() ) {
      //console.log(GAME.score);
      show();
      // stop clock
      if (GAME.intervalID != undefined) {
        clearInterval(GAME.intervalID);
        GAME.intervalID = undefined;
      }
    }
  }
};

// TODO: Time counting timer
const addSecond = () => {
  let time, min, sec;

  GAME.time++;
  time = (GAME.time / 3600) | 0;
  min = ((GAME.time % 3600) / 60 ) | 0;
  sec = GAME.time % 60;

  time = ((time == 0) ? min : time + ':' + leadingZero(min)) + ':' + leadingZero(sec);
  // show time
  document.getElementById('time').innerHTML = time;
  // also show stars
};

// TODO: Adds a leading zero
const leadingZero = (nr) => {
  return ((nr < 10) ? '0' : '') + nr;
};

// check if win
const win = () => {
  let n, word, ch, score = new Array(11);
  for (var i = 0; i < score.length; i++) { score[i] = new Array(4); }

  for (let row = 0; row < 4; row++) {
    //word = "";
    for (let col = 0; col < 4; col++) {
      n = row * 4 +col;
      if (GAME.pos[n] != -1) {
        ch = GAME.letters[GAME.pos[n]];
        // row
        score[row][col] = ch;
        // col
        score[col + 4][row] = ch;
        // scowl 3 of 4
        if (row == col) score[8][row] = ch;
        if (row + col == 3) {
          score[9][row] = ch;
          score[10][col] = ch;
        }
        //word += GAME.letters[GAME.pos[n]];
      }
    }
  }

  GAME.score = score.map(s => s.join(''));
  score = GAME.score.filter(s => s.length == 4);
  score = score.filter(s => GAME.matchedWord.includes(s));

  //console.log(score);
  return score.length > 0;
};

const show = () => {
  p = new Array(16);
  for (var i = 0; i < 16; i++) { p[i] = false; }

  for ( let i = 0; i < 4; i++){
    if ( GAME.score[i].length == 4 && GAME.matchedWord.includes(GAME.score[i]) ) {
      p[i * 4] = true; p[i * 4 + 1] = true; p[i * 4 + 2] = true; p[i * 4 + 3] = true;
    }
    if ( GAME.score[i + 4].length == 4 && GAME.matchedWord.includes(GAME.score[i + 4]) ) {
      p[i] = true; p[i + 4] = true; p[i + 8] = true; p[i + 12] = true;
    }
  }
  if ( GAME.score[8].length == 4 && GAME.matchedWord.includes(GAME.score[8]) ) {
    p[0] = true; p[5] = true; p[10] = true; p[15] = true;
  }
  if ( GAME.score[9].length == 4 &&
      (GAME.matchedWord.includes(GAME.score[9]) || GAME.matchedWord.includes(GAME.score[10]))) {
    p[3] = true; p[6] = true; p[9] = true; p[12] = true;
  }

  //console.log(p);
  for (var i = 0; i < p.length; i++) {
    if (p[i]) {
      GAME.blocks[GAME.pos[i]].style.color = 'red';
      shake(GAME.pos[i],500);
    }
  }
};

const shake = (nr, t = 100) => {
  const block = GAME.blocks[nr];

  block.style.animation = 'shake ' + t + 'ms';
  setTimeout(function() {
    block.style.animation = 'none';
  }, t);
};

// set block on position in array GAME.pos
const move = (nr) => {
  const where = GAME.pos.indexOf(nr);

  GAME.blocks[nr].style.left = (((where % 4) - (nr % 4)) * GAME.side) + 'px';
  GAME.blocks[nr].style.top = ((((where / 4) | 0) - ((nr / 4) | 0)) * GAME.side) + 'px';
};

// return array neighbors (-1 empty)
const neighbors = (p) => {
  let n = [];

  if ( p % 4 > 0 ) n.push(GAME.pos[p - 1]);
  if ( p % 4 < 3 ) n.push(GAME.pos[p + 1]);
  if ( ((p / 4) | 0) > 0 ) n.push(GAME.pos[p - 4]);
  if ( ((p / 4) | 0) < 3 ) n.push(GAME.pos[p + 4]);

  return n;
};

// TODO: Select function to choose stakes
const randomLetters = () => {
  const prop = [4,5,5,6,6,6,6,6,7,7,8];
  const vowel = ['a','e','i','o','u'];
  const bcd = 'bcdfghjklmnpqrstvwxyz';
  const l = [];
  const list = document.getElementById('words');
  let v = 0, c = 0, char, p, exp, ex2, ex3, node;
  let matchedWord;

  const word = GAME.words[((Math.random() * GAME.words.length) | 0)].w;

  // random word and count noumber of vowel
  for (var i = 0; i < 4; i++) {
    char = word.charAt(i);
    l.push(char);
    if (vowel.includes( char ))
      v++;
    else
      c++;
  }
  p = prop[((Math.random() * prop.length) | 0)] - v;
  for (var i = 0; i < p; i++) {
    l.push(vowel[((Math.random() * 5) | 0)]);
  }
  for (var i = l.length; i < 15; i++) {
    l.push(bcd.charAt((Math.random() * bcd.length) | 0));
  }
  //shuffle letter
  for (var i = 0; i < 15; i++) {
    p = l[i];
    c = (Math.random() * 15) | 0;
    l[i] = l[c];
    l[c] = p;
  }

  // filter mached words
  matchedWord = GAME.words.filter(word => (
    word.w.split('').map( le => l.includes(le)).filter(b => !b).length == 0
  ));

  // if any letter repeats itself
  // and there is no such thing for it, throw away the word
  matchedWord = matchedWord.filter(word => (
    exp = new RegExp(word.w.charAt(0),"g"),
    ex2 = new RegExp(word.w.charAt(1),"g"),
    ex3 = new RegExp(word.w.charAt(2),"g"),
    ! ((word.w.match(exp).length > l.join('').match(exp).length) ||
    (word.w.match(ex2).length > l.join('').match(ex2).length) ||
    (word.w.match(ex3).length > l.join('').match(ex3).length))
  ));

  // json to array
  GAME.matchedWord = matchedWord.map(word => word.w);

  list.innerHTML = '';
  node = document.createElement('OPTION');
  node.setAttribute('value', '');
  node.appendChild(document.createTextNode(''));
  list.append(node);

  GAME.matchedWord.forEach((word) => {
    node = document.createElement('OPTION');
    node.setAttribute('value', word);
    node.appendChild(document.createTextNode(word));
    list.append(node);
  });

  return l;
};

// TODO: Drowing a stars
const calcStars = (nr) => {
  const place = $('.stars');
  let stars;
  let star;

  // fewer stars if you're too slow ( 2 sec per move)
  stars = ((cards.time / cards.moves) / 2) | 0;
  // fewer stars if too many missed ones
  stars += (cards.moves / (cards.stakes * 1.7)) | 0;
  // max 3
  stars = 3 - stars;
  // set stars
  $(place).html('');
  for ( let i = 0; i < 3; i++) {
    if (stars > 0) {
      stars--;
      star = $('<i class="fas fa-star"></i>');
    } else {
      star = $('<i class="far fa-star"></i>');
    }
    $(place).append(star);
  }
};



const howManyMoves = (word) => {

  console.log(word);
  let p = GAME.pos.slice();
  p[15] = 14;
  p[14] = -1;

  let ans = recurent([], p);

  console.log('Wynik Koncowy');
  console.log(ans);

};

const DEPTH = 2;

const recurent = (moves, pos) => {

  if (moves.length == 2 && moves[0] == 'right' && moves[1] == 'down') {
    console.log('Jest !!! ---------------------------------');
    return moves;
  }
  if (moves.length > DEPTH) {
    moves.push('stop');
    return moves;
  }

  let way = [];
  let empty = pos.indexOf(-1);

  if (empty > 3) way.push('down');
  if (empty < 12) way.push('up');
  if (empty % 4) way.push('right');
  if (empty % 4 < 3) way.push('left');
  console.log('pozycje w recurent plus byłe ruchy ,   poziom : ' + moves.length);
  //console.log(way);
  console.log(pos);
  console.log(moves);

  let movesN, posN, movesA , movesB;


  way.forEach(function(d) {
    movesN = moves.slice();
    posN = pos.slice();

    switch (d) {
      case 'right':
      console.log('w petli drog jazda w prawo');
      posN[empty] = posN[empty - 1];
      posN[empty - 1] = -1;
      movesN.push(d);
      movesA = recurent(movesN, posN);
      break;
      case 'down':
      console.log('w petli drog jazda w duł');
      posN[empty] = posN[empty - 4];
      posN[empty - 4] = -1;
      movesN.push(d);
      movesB = recurent(movesN, posN);
      break;
    }



  });
  console.log('A');
  console.log(movesA);
  console.log('B');
  console.log(movesB);

  //moves.push(moves.length);

  return movesA;
};


const howManyMovesPromise = (word) => {
  return new Promise(function(r) {
    console.log('3 sekund ' + word);
    window.setTimeout(function() {
      r();
    }, 3000);
  });

};


// TODO: victory
const victory = () => {
  const again = $('<div class="win"></div>');
  const inside = $('<div class="again"></div>)');
  const btn = $('<button class="btn-again"> AGAIN ! </button>');

  $(inside).append($('<p>YOU WON !!</p>'));
  $(inside).append($('<p>Your result: <strong class="stars"></strong></p>'));
  $(inside).append($('<p></p>').text('Your moves: ' + cards.moves ));
  $(inside).append($('<p></p>').text('Your time: ' + $('#time').text()));
  $(inside).append(btn);

  $(btn).click(function() {
    $('.container')[0].style.filter = '';
    restart();
    $(again).remove();
  });

  again.append(inside);

  $('.container')[0].style.filter = 'blur(2px)';

  $('body').append(again);

  // show stars
  calcStars();

};