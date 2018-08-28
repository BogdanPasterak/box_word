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
  matchedWord: []
  /*


  couples: 0,
  stakes: 0,
  col: 0,
  row: 0,
  size: 0,
  moves: 0,
  time: 0,
  intervalID: undefined,
  intervalOvations: undefined,
  landscape: true,
  No: Array(24),
  flipp: Array(24),
  search: Array(3),
  sizeHat: 70,
  rectAudience: undefined,
  rectBoard: undefined
  */
};


// TODO: Registration of new events and initialization
$(function() {

  // spreading the elements of the game (for phones in the landscape position )
  $( window ).resize(function() {
    reorganization();
  });
  // events for button and selects
  $('button').click(function() {
    restart();
  });
  $('#couples').change(function() {
    choiceCouples();
  });
  $('#stakes').change(function() {
    choiceStakes();
  });
  restart();
  // start !
  reorganization();
  //choiceCouples();
});

// TODO: start again
const restart = () => {
  // DB words
  if (GAME.words.length == 0) {
    GAME.words = JSON.parse(words);
  }
  // array letters (matchedWord => possible layouts)
  GAME.letters = randomLetters();
  // draw blocks
  resetBoard();
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
    // letter.addEventListener('onselect', (e) => e.preventDefault());
    letter.appendChild(document.createTextNode(GAME.letters[index]));
    block.append(letter);
    block.style.width = GAME.side +'px';
    block.style.height = GAME.side +'px';
    block.addEventListener("click", clickLeter);
    board.append(block);
    GAME.blocks.push(block);
    GAME.pos[index] = index;
    console.log();
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

const clickLeter = (e) => {
  //console.log(e.target);
  const nr = parseInt(e.target.id.slice(1));
  const pos = GAME.pos.indexOf(nr);
  const neigh = neighbors(pos);
  let word, n;

  if (neigh.includes(-1)) {
    const where = GAME.pos.indexOf(-1);
    // swap
    GAME.pos[where] = nr;
    GAME.pos[pos] = -1;
    move(nr);
  }

  for (let row = 0; row < 4; row++) {
    word = "";
    for (let col = 0; col < 4; col++) {
      n = row * 4 +col;
      if (GAME.pos[n] != -1) {
       word += GAME.letters[GAME.pos[n]];
     }
    }
    if (GAME.matchedWord.includes(word))
      console.log(word);
  }
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
  let v = 0, c = 0, char, p, exp, ex2, ex3;
  let matchedWord;

  const word = GAME.words[((Math.random() * GAME.words.length) | 0)].w;
  document.getElementById('text').value = word;

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

  return l;
};


// TODO: Time counting timer
const addSecond = () => {
  let time, min, sec;

  cards.time++;
  time = (cards.time / 3600) | 0;
  min = ((cards.time % 3600) / 60 ) | 0;
  sec = cards.time % 60;

  time = ((time == 0) ? min : time + ':' + leadingZero(min)) + ':' + leadingZero(sec);
  // show time
  $('#time').html(time);
  // also show stars
  calcStars();
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

// TODO: Adds a leading zero
const leadingZero = (nr) => {
  return ((nr < 10) ? '0' : '') + nr;
};

// TODO: victory
const win = () => {
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