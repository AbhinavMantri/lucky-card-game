var max_player = 4;

var deck;
var players;
var winner;

function initial_game() {
    deck = Array.from({length: 52}, (v, i) => i+1);
    players = Array.from({length: 4}, (v, i) => ({ number: i+1, cards: [] }));
    winner = [];
}

function shuffle(array) {
   return array.sort(() => Math.random() - 0.5);
}

function start_game() {
    // initialize the card deck and players
    initial_game();

    const gameBox = document.getElementById('game-box');
    gameBox.querySelector('.game-steps').innerHTML = '';

    remove_instruction('.ask_shuffle_box');

    const last_shuffle_player = localStorage.getItem('shuffle_player') ? +localStorage.getItem('shuffle_player') : null;
    const shuffle_player =  last_shuffle_player && last_shuffle_player < max_player ?  last_shuffle_player + 1 : 1;
    localStorage.setItem('shuffle_player', shuffle_player);

    const gameOverlay = document.getElementById('game-overlay');
    gameOverlay.className = "game-overlay show";
    
    set_instruction_box(`<b>Player-${shuffle_player}</b> need to shuffle the deck.`, doShuffle, "Shuffle Deck");
}

function doShuffle() {
    deck = shuffle(deck);

    const gameBox= document.getElementById('game-box');

    const shuffle_player = localStorage.getItem('shuffle_player') ? +localStorage.getItem('shuffle_player') : null;

    remove_instruction('.ask_shuffle_box');

    set_next_step(`1. <b>Player-${shuffle_player}</b> shuffled the deck.`, 'suffle_done');

    set_instruction_box(`<b>Player-${shuffle_player}</b> need to distribute the cards.`, doDistribute, "Distribute Cards");
}

function set_instruction_box(message, listener, btnLabel) {
    const gameBox = document.getElementById('game-box');
    const shuffle_ask_box = document.createElement('div');
    shuffle_ask_box.className += 'ask_shuffle_box';

    const shuffle_ask_message = document.createElement('p');
    shuffle_ask_message.innerHTML = message;
    
    const shuffle_ask_btn = document.createElement('button');
    shuffle_ask_btn.className += 'btn btn-primary';
    shuffle_ask_btn.innerHTML = btnLabel;
    shuffle_ask_btn.addEventListener('click', listener);

    shuffle_ask_box.appendChild(shuffle_ask_message);
    shuffle_ask_box.appendChild(shuffle_ask_btn);

    gameBox.appendChild(shuffle_ask_box);
}

function set_next_step(message, doneClass) {
    const gameBox= document.getElementById('game-box');
    const suffle_done = document.createElement('div');
    suffle_done.className += `game-step ${doneClass}`;
    const suffle_done_message = document.createElement('p');
    suffle_done_message.innerHTML = message;
    suffle_done.appendChild(suffle_done_message);

    gameBox.querySelector('.game-steps').appendChild(suffle_done);

    // gameBox.appendChild(suffle_done);
}

function remove_instruction(selector) {
    const ask_shuffle_box = document.getElementById('game-box').querySelector(selector);

    if(ask_shuffle_box && ask_shuffle_box.querySelector) {
        ask_shuffle_box.querySelector('button.btn').removeEventListener('click', doShuffle);
        ask_shuffle_box.remove();
    }
}

function doDistribute() {
    const shuffle_player = localStorage.getItem('shuffle_player') ? +localStorage.getItem('shuffle_player') : null;
    
    let i = shuffle_player < max_player ? shuffle_player + 1 : 1;
    let count = 0;
  
    // distribute till each player gets 3 cards.
    while(count < (max_player * 3)) {
        // select player for card distribution
        // for example if suffle player is 1 then order of distribution will be 2, 3, 4, 1
        const player = players[i-1];
        player.cards.push({...cardDeck[deck[0]], no: deck[0]});

        // remove card from deck as it distributed to player
        deck.splice(0, 1);

        i = i < max_player ? i + 1 : 1;
        count += 1;     
    }

    remove_instruction('.ask_shuffle_box');

    set_next_step(`2. <b>Player-${shuffle_player}</b> distributed cards from deck.`, 'suffle_done');

    // ask to show the card
    set_instruction_box(`Ask to display the each player's cards.`, showCards, "Show Cards");
}

function showCards() {
    const gameBox = document.getElementById('game-box');
    const gameStep = document.createElement('div');
    
    gameStep.className += `row game-step show-cards`;

    for(let i = 0; i < players.length; i++) {
        const { cards } = players[i];
        const playerRow = document.createElement('div');

        playerRow.className += `col-md-6 player-cards`;

        const player_name = document.createElement('p');
        // player_name.className += `col-md-12`;
        player_name.innerHTML = `Player-${i+1}`;

        playerRow.appendChild(player_name);

        const playCardRow = document.createElement('div');
        playCardRow.className += 'row';
        
        for(let j = 0; j < cards.length; j++) {
            set_card(cards[j], playCardRow);
        }

        playerRow.appendChild(playCardRow);

        gameStep.appendChild(playerRow);
    }

    remove_instruction('.ask_shuffle_box');

    gameBox.querySelector('.game-steps').appendChild(gameStep);

    set_instruction_box(`Find out the winner`, calcWinner, "Calculate Winner");
}

function set_card(card, row) {
    const elem = document.createElement('div');
    elem.className += 'col-md-4';

    elem.innerHTML = `<img src="img/${card.no}.png" alt="${card.no}" />`;

    row.appendChild(elem);
}

function calcWinner() {
    winner = players.reduce((w, p) => {
        if(w && w.length > 0) {
            const win = compare_player(w[0], p);
            if(win && w[0].number === win.number) return w;
            return win ? [win] : [...w, p];  
        } 

        return [p];
    }, []); 

    if(winner && winner.length === 1) {
        remove_instruction('.ask_shuffle_box');

        const winpop = document.getElementById('winner-pop');
        winpop.className += ' show';

        winpop.querySelector('p').innerHTML = `<b>Player-${winner[0].number}</b> won this game.`;
    }

    if(winner && winner.length > 1) {
        additional_distribution();
    }
}

function compare_player(p1, p2) {
    //check trail and then sequence and then pair of two and then highest number card value
    return rules.compareTrail(p1, p2) || rules.compareSeq(p1, p2) || rules.comparePairs(p1, p2) || rules.compareHighest(p1, p2); 
}

function restart_game() {
    const winpop = document.getElementById('winner-pop');
    winpop.className = 'winner-pop';

    winpop.querySelector('p').innerHTML = '';
    
    this.start_game();
}

function additional_distribution() {
    const shuffle_player = localStorage.getItem('shuffle_player') ? +localStorage.getItem('shuffle_player') : null;
    remove_instruction('.ask_shuffle_box');

    const tiepop = document.getElementById('tie-pop');
    tiepop.querySelector('.btn').className = 'btn btn-primary';

    winner = winner.map(d => ({...d, cards: [] })); 

    const distribute = () => {
        let i = shuffle_player + 1;
        let d = winner.filter(it => it.cards.length > 0);

        // distribute one card to all winners
        while(winner.length > d.length) {
            const p = winner.find(d => d.number === i);
            
            i = i === players.length ? 1 : i + 1;

            if(!p) continue;

            // distribute card
            p.cards.push({ ...cardDeck[deck[0]], no: deck[0] });
            deck.splice(0, 1);
            
            d = winner.filter(it => it.cards.length);
        }
    }

    while(1) {
        distribute();

        show_distribute_card();

        winner = winner.reduce((w, p) => {
            if(w && w.length > 0) {
                const win = rules.compareHighest(w[0], p);
                if(win && w[0].number === win.number) return w;
                return win ? [ win ] : [...w, p];  
            } 
    
            return [p];
        }, []);

        if(winner && winner.length === 1)
            break;


        winner = winner.map(d => ({...d, cards: [] })); 
    }

    if(winner && winner.length === 1) {
        tiepop.querySelector('.btn').className = 'btn btn-primary hide';

        setTimeout(() => {
            const winpop = document.getElementById('winner-pop');
            winpop.className += ' show';

            winpop.querySelector('p').innerHTML = `<b>Player-${winner[0].number}</b> won this game.`;

            const tiepop = document.getElementById('tie-pop');
            tiepop.className = 'tie-pop';

            tiepop.querySelector('.tie-cards').innerHTML = '';            
        }, 2000);
    }
}

function show_distribute_card() {
    const tiepop = document.getElementById('tie-pop');
    tiepop.className = 'tie-pop show';

    const row = tiepop.querySelector('.tie-cards');
    row.innerHTML = '';

    for(let i = 0; i < winner.length; i++) {
        const w = winner[i];
        const card = w.cards[0];
        const col = document.createElement('div');
        col.className = 'col-md-3';

        col.innerHTML = `<p>Player-${w.number}</p><img src="img/${card.no}.png" alt="${card.no}" />`;

        row.appendChild(col);
    }
}