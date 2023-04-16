# Rang

You must have node to be able to play the game.
To run the game, via command line:-

Open two terminals in the game folder.
First terminal:
cd frontend
npm i
npm start

Second terminal:
cd backend
npm i
node server.ts

You can then play as different players in 4 different tabs.

s
Rules and flow for RANG: 
We will be implementing the basic (vanilla) version of Rang that abides by the following
rules.
Players:
● To get a particular Rang game started, you need to have exactly 4 players who have
coordinated in pairs of 2. By default, we will be pairing player 1 with player 3, and
player 2 with 4.
Who decides the Rang? : ● From the deck of 52 cards, each of the four players are allotted a card randomly. ● Of the 4 cards displayed to each of the players, there will be one player who will get
the least ranked card and there will be one player who gets the highest ranked card.
You need to implement it such that there can be no two players who get a card of the
same rank. This implies that a single go would be enough to choose the player who
decides the Rang. ● The player who gets the highest ranked card decides the Rang at a later stage when
the game begins. You can assume that this player is named as R1 and the
corresponding partner of R1 is R2. On the parallel sides, the other two players can be
A1 and A2 who are together playing as a team.
● All the cards are restored back to the deck and shuffled.
Distributing the cards:
● R1 is given 5 cards randomly from the deck of 52 cards and is asked to choose the
Rang (one of hearts, diamonds, clubs and spades).
● The chosen Rang is fixed for the rest of the game.
● The remaining players are also given 5 cards each and this marks the end of round 1
of distribution.
● No two cards such that the two cards have the same suit and rank can be shared
between players.
● Proceeding to round 2 of distribution, from the remaining 32 cards, each of the 4
players are given 8 cards each.
Starting the game: ● R1 takes the lead to select a card and make it visible to other players.
● The teams take alternating turns so one of A1 or A2 follows and takes turn after R1.
Please see that the order of turns is fixed. It either has to be:
○ R1→ A1→R2→A2 in ALL of the rounds
OR
○ R1→ A2→R2→A1 in ALL of the rounds
● One round is completed when all of the 4 players are done taking their turns and
proposing their cards.
● The team whose player has put forth the highest ranked card or has cut off the thread
by throwing a rang card wins the round and takes the lead.
○ For instance, if A1 throws the highest ranked card and team A wins the round,
then A1 would take the lead for the following round. The order of turns would
be:
■ A1→R2→A2 → R1 if you chose R1→ A1→R2→A2 for the first
round.
OR
■ A1 → R1→A2→ R2 if you chose R1→ A2→R2→A1 for the first
round.
Who wins a round?: ● The player who leads a particular round decides what suit to play for the round.
● Every player is expected to propose a card of the same suit unless they do not have a
card of the same.
● In case that a player does not have the same suit, they have the option to choose from
a rang card or a non-rang card.
○ If they choose a rang card, they would be taking the lead unless some other
player proposes a rang card of a higher rank in the following turns of the same
round.
○ If they do not choose a rang card, they would not be taking the lead for the
round.
● In case a player tries to propose a card of a different suit despite having a card of the
same suit, they should be warned and asked to retry. ● The player who proposed the highest ranked card wins the round if every other player
has a card of the initial suit proposed.
● If there is any player who proposes a Rang card because they do not have a card of the
originally running suit, then the player with the highest ranked Rang card proposed
wins.
● Given that the Rang chosen is Hearts, consider the following flow:
○ A1 takes lead from last round and proposes Ace of Diamonds
○ R1 has Diamonds, so they propose 3 of Diamonds
○ A2 does not have Diamonds so they propose 2 of Clubs
○ R2 has Diamonds, so they propose 5 of Diamonds
○ Hence, A1 is clearly senior and team A wins the round.
○ A1 is again leading since they came senior in the last round.
○ A1 proposes 5 of Spades
○ R1 has no Spades so they propose 5 of Hearts (which is the Rang) ○ A2 has Spades so they propose Ace of Spades
○ R2 has Spades so they propose 3 of Spades
○ Hence, R1 is senior-most and team R wins the round.
○ R1 proposes 4 of Clubs
○ A2 proposes 3 of Clubs
○ R2 proposes 5 of Clubs
○ A1 has no Clubs nor a Rang card, so they just propose Queen of Diamonds.
○ Hence, R2 senior-most and team R wins the round.
● The above listed are just a few of the flows. You will be tested on all possible
game flows that abide by the rules listed in the previous section.
Who wins the game?:
● The pair who is first to win 7 rounds wins