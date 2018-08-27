/* script
* Bogdan Pasterak
* TODO: sctipt support Box Word game
* 25/8/2018
*/

// Variables used in the game
const GAME = {
  side: 0,
  blocks: [],
  pos: [],
  words: []
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
// An array with the layout of cards
const arrangement = [
  [2, 3, 3, 3, 3, 4, 3, 3, 4, 4, 5, 5, 5, 6],
  [2, 3, 2, 3, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6],
  [0, 0, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 6],
  [0, 0, 0, 0, 0, 0, 3, 4, 4, 4, 5, 5, 5, 6]
];

// Calculation of some game parameters
GAME.set = function() {
  this.couples = parseInt($('#couples').val());
  this.stakes = parseInt($('#stakes').val());
  this.col = 2 + (this.stakes > 6) + (this.stakes > 12);  // true == 1, false == 0
  this.row = 2 + (this.stakes > 4) + (this.stakes > 9) + (this.stakes > 16) + (this.stakes > 20);
  this.landscape = ($(this.board).width() > $(this.board).height());
  // calculate size of cards
  const cW = this.board.clientWidth / ((this.landscape) ? this.row : this.col);
  const cH = this.board.clientHeight / ((this.landscape) ? this.col : this.row);
  this.size = ((cW > cH) ? cH : cW) | 0;
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
    //console.log(size);

    // size of block
    const blocks = document.getElementsByClassName('square');


    GAME.blocks.forEach((block, index) => {
      block.style.width = GAME.side +'px';
      block.style.height = GAME.side +'px';
      move(index);
    });

  }


  // saving the size of audience and board
  //GAME.rectBoard = $('.board')[0].getBoundingClientRect();

  // repaint screen
  //GAME.set();
  //resetBoard();
  //setingCards();
};

const clickLeter = (e) => {
  //console.log(e.target);
  const nr = parseInt(e.target.id.slice(1));
  const pos = GAME.pos.indexOf(nr);
  const neigh = neighbors(pos);

  if (neigh.includes(-1)) {
    const where = GAME.pos.indexOf(-1);
    // swap
    GAME.pos[where] = nr;
    GAME.pos[pos] = -1;
    move(nr);
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
  let v = 0, c = 0, char, p;

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
  //shuffle
  for (var i = 0; i < 15; i++) {
    p = l[i];
    c = (Math.random() * 15) | 0;
    l[i] = l[c];
    l[c] = p;
  }

  //console.log(l + '  ' + v + '  ' + p + '  ' + l.length);
  return l;
};

// TODO: start again
const restart = () => {

  if (GAME.words.length == 0) {
    GAME.words = JSON.parse(words);
  }
  GAME.letters = randomLetters();
  console.log(GAME.letters);
  // turn off owation
  // if (cards.intervalOvations != undefined) {
  //   clearInterval(cards.intervalOvations);
  //   cards.intervalOvations = undefined;
  // }
  // draw and set new cards
  resetBoard();
  // drawingCards();
  // setingCards();
};


// TODO: Function for redrawing the board
const resetBoard = () => {
  const board = document.getElementById('board');
  const abc = 'abcdefghijklmnopqrstuvwxyz';
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
    block.addEventListener("click", clickLeter);
    board.append(block);
    GAME.blocks.push(block);
    GAME.pos[index] = index;
    console.log();
  }
  GAME.pos[15] = -1;
};

// TODO: drawing cards
const drawingCards = () => {
  let rnd;

  // clear seting
  for (let i = 0; i < 24; i++){
    cards.No[i] = 0;
    cards.flipp[i] = false;
  }
  cards.search[2] = -1;
  cards.search[1] = -1;
  cards.search[0] = -1;
  cards.moves = 0;
  cards.time = 0;
  // stop clock
  if (cards.intervalID != undefined) {
    clearInterval(cards.intervalID);
    cards.intervalID = undefined;
  }
  // clear visible elements
  $('#moves').html('0');
  $('#time').html('0:00');
  calcStars();

  // fill colection
  for (let i = 1; i <= cards.stakes / cards.couples; i++){
    // i -> number of sets
    for (let j = 0; j < cards.couples; j++){
      // j -> card number in the set
      do {
        rnd = (Math.random() * cards.stakes) | 0;
      } while (cards.No[rnd] != 0);
      // draw until you find an empty space
      cards.No[rnd] = i;
    }
  }
};

// TODO: setting cards according to the pattern
const setingCards = () => {
  // to which row or column to add (string of class and no.)
  let who;
  // index in the pattern
  const which = (((cards.stakes - 4) / 2) | 0) + (cards.stakes > 8) + (cards.stakes > 14) + (cards.stakes > 20);
  // index of card
  let index = 0;

  for (let i = 0; i < cards.col; i++){
    // i -> cloumn or row (depending on the view)
    who = '.my-' + ((cards.landscape) ? 'row' : 'col') + ':eq(' + i + ')';
    for (let j = 0; j < arrangement[i][which]; j++) {
      // j -> position in a row or column
      // creates a card
      let card = $(buildCard(index));
      // adding click event with prevent dragable
      $(card).children().on("mouseup mousedown", function(event) {
        event.preventDefault();
        if (event.type == "mouseup"){
          flipp(this);
        }
      });
      // set card
      $(who).append(card);
      index++
    }
  }
  // set size of cards
  $('.card-box').width(cards.size + 'px');
  $('.card-box').height(cards.size + 'px');
};

// TODO: Card rollover function
const flipp = (sender) => {
  // variable
  const index = parseInt($(sender).attr('id'));
  const front = ! cards.flipp[index];
  let id0, id1, id2;

  // if I check
  if (front){
    // next move
    cards.moves++;
    // show muves
    $('#moves').html(cards.moves);
    // turn the card
    $(sender).toggleClass('flipped');
    cards.flipp[index] = front;
    // start clock if stoped
    if (cards.intervalID == undefined ){
      cards.intervalID = setInterval(addSecond, 1000);
    }
    // are they any reversed ?
    if (cards.search[0] >= 0) {
      // if the first one is the same ?
      if (cards.No[index] == cards.No[cards.search[0]]) {
        // all included ?
        if (cards.couples == 2 || (cards.couples == 3 && cards.search[1] >= 0) || (cards.couples == 4 && cards.search[1] >= 0 && cards.search[2] >= 0)) {
          // reset the search
          cards.search[2] = -1;
          cards.search[1] = -1;
          cards.search[0] = -1;
          // hurra
          for (let i = 0; i < ((Math.random() * 10) | 0) + 7; i++) {
            setTimeout(function() {
              throwHat();
            },(Math.random() * 1500) | 0);
          }
          // is this the last set ?
          if ($('.flipped').length == cards.stakes) {
            // stop clock
            if (cards.intervalID != undefined) {
              clearInterval(cards.intervalID);
              cards.intervalID = undefined;
            }
            // ovations !!!
            if (cards.intervalOvations == undefined ){
              cards.intervalOvations = setInterval(ovations, 200);
            }
            win();
          }
        } else {
        // not all in the set, enter and search further
          if (cards.search[1] == -1) {
            // second
            cards.search[1] = index;
          } else {
            // or third
            cards.search[2] = index;
          }
        }
      } else {
      // not the same
        // id of previous searches
        id0 = leadingZero(cards.search[0]);
        if (cards.couples > 2 && cards.search[1] >= 0) {
          id1 = leadingZero(cards.search[1]);
        }
        if (cards.couples == 4 && cards.search[2] >= 0) {
          id2 = leadingZero(cards.search[2]);
        }
        // cover the wrong one
        setTimeout(function() {
          $(sender).toggleClass('flipped');
          $('#' + id0).toggleClass('flipped');
          if (id1 != undefined) {
            $('#' + id1).toggleClass('flipped');
          }
          if (id2 != undefined) {
            $('#' + id2).toggleClass('flipped');
          }
        }, 600);
        // start searching again
        cards.flipp[index] = false;
        cards.flipp[cards.search[0]] = false;
        cards.search[0] = -1;
        if (id1 != undefined) {
          cards.flipp[cards.search[1]] = false;
          cards.search[1] = -1;
        }
        if (id2 != undefined) {
          cards.flipp[cards.search[2]] = false;
          cards.search[2] = -1;
        }
        // the audience can also be wrong !!!!
        if (Math.random() < 0.2) {
          throwHat();
        }
      }
    // start looking for a pair
    } else {
      cards.search[0] = index;
    }
  }

};

// TODO: Creates a card
const buildCard = (nr) => {
  const pattern = leadingZero(cards.No[nr]);
  const index = leadingZero(nr);
  let card = '';

  card += '<div class="card-box">';
  card += '<div class="card';
  // if it was rotated, turn it
  if (cards.flipp[nr]){
    card += ' flipped';
  }
  card += '" id="' + index + '">';

  card += '<figure class="back">';
  card += '<img src="img/bowl.png">';
  card += '</figure>';

  card += '<figure class="front">';
  card += '<img src="img/fruti' + pattern + '.png">';
  card += '</figure>';

  card += '</div>'; // end card
  card += '</div>'; // end card-box
  return card;
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