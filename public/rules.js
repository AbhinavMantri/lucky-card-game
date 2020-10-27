var rules = {
    getIndex: function(p) {
        const seqs = [];

        p.cards.forEach(c => {
            seqs.push(Object.keys(cards).findIndex(k => cards[k] === c.card));
        });

        return seqs;
    },
    hasTrail: function(p) {
        const { cards } = p || {};
        return cards[0].card === cards[1].card && cards[1].card === cards[2].card;
    },
    hasSeq: function(p) {
        const seqs = this.getIndex(p);

        const withFirst = (seqs[0] === seqs[1] - 1 && seqs[1] === seqs[2] - 1) || (seqs[0] === seqs[2] - 1 && seqs[2] === seqs[1] - 1);
        const withSec = (seqs[1] === seqs[2] - 1 && seqs[2] === seqs[0] - 1) || (seqs[1] === seqs[0] - 1 && seqs[0] === seqs[2] - 1);
        const withThird = (seqs[2] === seqs[1] - 1 && seqs[1] === seqs[0] - 1) || (seqs[2] === seqs[0] - 1 && seqs[0] === seqs[1] - 1);

        return (withFirst || withSec || withThird); 
    },
    hasPair: function(p) {
        // const seqs = this.getIndex(p);
        const { cards } = p || {};

        const pair1 = (cards[0].card === cards[1].card || cards[0].card === cards[2].card) ? cards[0].card  : undefined;
        const pair2 = (cards[1].card === cards[2].card) ? cards[1].card  : undefined;

        return pair1 || pair2;
    },
    findHighest: function(p) {
        const seqs = this.getIndex(p);
        console.log(seqs);

        return seqs.includes(0) ? cards[0] : cards[Math.max(...seqs)];
    },
    compareTrail: function(p1, p2) {
        const isP1Trail = this.hasTrail(p1);
        const isP2Trail = this.hasTrail(p2);

        const highP1 = this.findHighest(p1);
        const highP2 = this.findHighest(p2);

        let winner = isP1Trail && isP2Trail ? this.getHighestWinner(p1, p2, highP1, highP2) : undefined;
        winner = winner ? winner : ((isP1Trail || isP2Trail) ? (isP1Trail ? p1 : p2) : undefined);

        return winner; 
    },
    compareSeq: function(p1, p2) {
        const isP1Seq = this.hasSeq(p1);
        const isP2Seq = this.hasSeq(p2);

        const highP1 = this.findHighest(p1);
        const highP2 = this.findHighest(p2);

        let winner = isP1Seq && isP2Seq ? this.getHighestWinner(p1, p2, highP1, highP2) : undefined;
        winner = winner ? winner : ((isP1Seq || isP2Seq) ? (isP1Seq ? p1 : p2) : undefined);
        
        return winner;
    },
    comparePairs: function(p1, p2) {
        const isP1Pair = this.hasPair(p1);
        const isP2Pair = this.hasPair(p2);

        // const highP1 = this.findHighest(p1);
        // const highP2 = this.findHighest(p2);

        let winner = isP1Pair && isP2Pair ? this.getHighestWinner(p1, p2, isP1Pair, isP2Pair) : undefined;
        winner = winner ? winner : ((isP1Pair || isP2Pair) ? (isP1Pair ? p1 : p2) : undefined);
        
        return winner;
    },
    compareHighest: function(p1, p2) {
        const highP1 = this.findHighest(p1);
        const highP2 = this.findHighest(p2);

       return this.getHighestWinner(p1, p2, highP1, highP2);
    },
    getHighestWinner: function(p1, p2, h1, h2) {
        if(h1 !== h2) {
            const indexP1 = cards.findIndex(d => d === h1);
            const indexP2 = cards.findIndex(d => d === h2);

            return indexP1 === 0 || indexP2 === 0 ? (indexP1 === 0 ? p1 : p2) : (indexP1 > indexP2) ? p1 : p2;
        }

        return undefined;
    }
};