const { Socket } = require( "socket.io");

const express = require("express");
const app = express();
const http = require("http");
const {Server} = require('socket.io')
const cors = require('cors')

app.use(cors())
const server = http.createServer(app)
const io = new Server(
    server,{cors:{
        origin:"http://localhost:3001",
        methods: ["GET", "POST"]
    },
})



server.listen(3001, ()=>{
    console.log("SERVER IS LISTENING ON PORT 3001")
})

const clients = new Map();


let id1 = false;
let id2 = false;
let id3 = false;
let id4 = false;
let latest = 5

const getID = () => {

    let id = 0;
    if (id1 === false) {
        id1 = true;
        id = 1;
    }
    else if (id2 === false){
        id2 = true;
        id = 2;
    }
    else if (id3 === false){
        id3 = true;
        id = 3;
    }
    else if (id4 === false){
        id4 = true;
        id = 4;
    }
    else {
        id = latest;
        latest ++
    }

    return id;
    
}

var suits = ["Spades", "Diamond", "Clubs", "Hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function getDeck()
{
	let deck = new Array();

	for(let i = 0; i < suits.length; i++)
	{
		for(let x = 0; x < values.length; x++)
		{
			let card = {Value: values[x], Suit: suits[i]};
			deck.push(card);
		}
	}

	return deck;
}

function shuffle(deck)
{
	// for 1000 turns
	// switch the values of two random cards
	for (let i = 0; i < 1000; i++)
	{
		let location1 = Math.floor((Math.random() * deck.length));
		let location2 = Math.floor((Math.random() * deck.length));
		let tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
    return deck
}

function unique_deck(deck){

    let res = [deck[0]]
    for (let i = 1; i < deck.length; i++)
	{
        let missing = true
        for (let k=0; k< res.length; k++){
            if (deck[i].Value === res[k].Value){
                missing = false
            }
        }
        if (missing){
            res.push(deck[i])
        }
	}
    return res
}

const predeck = getDeck()
const tempdeck = shuffle(predeck)
const gameDeck = shuffle(predeck)
const unideck = unique_deck(tempdeck)

function divideDeck(){
    const chunkSize = 13;
    var decks = [[]]
    for (let i = 0; i < gameDeck.length; i += chunkSize) {
        const chunk = gameDeck.slice(i, i + chunkSize);
        decks.push(chunk)
    }
    decks.shift()
    return decks
}

const distribution = divideDeck()
const deck1 = distribution[0]
const deck2 = distribution[1]
const deck3 = distribution[2]
const deck4 = distribution[3]

function firstFive(quartet_decks){
    let res = [{}]
    for (let i=0; i< 4; i++ ){
        let temp = [{}]
        for (let k=0; k<5;k++){
            temp.push(quartet_decks[i][k])
        }
        temp.shift()
        res.push(temp)
    }
    res.shift()
    return res
}

const first5Dist = firstFive([deck1,deck2,deck3,deck4])
const first1 = first5Dist[0]
const first2 = first5Dist[1]
const first3 = first5Dist[2]
const first4 = first5Dist[3]


function getLargest(quartet) {

    for (let i=1; i <= 4; i++){
        if (quartet[i-1].Value === 'A'){
            return i
        }
    }
    for (let i=1; i <= 4; i++){
        if (quartet[i-1].Value === 'K'){
            return i
        }
    }
    for (let i=1; i <= 4; i++){
        if (quartet[i-1].Value === 'Q'){
            return i
        }
    }
    for (let i=1; i <= 4; i++){
        if (quartet[i-1].Value === 'J'){
            return i
        }
    }

    var nums = [0,0,0,0]
    
    for (var i = 0; i < 4; i++){
        nums[i] = parseInt(quartet[i].Value);
    }

    let max = 0;
    let result = 1;
    for (let i=1; i <= 4; i++){
        if (nums[i-1] > max){
            max = nums[i-1]
            result = i
        }
    }
    return result

}

let roundCounter = 0;
let roundStart = 0;

let roundCards = [
    {
        Value: '',
        Suit: 'None'
    },
    {
        Value: '0',
        Suit: 'None'
    },
    {
        Value: '0',
        Suit: 'None'
    },
    {
        Value: '0',
        Suit: 'None'
    },
    {
        Value: '0',
        Suit: 'None'
    },

]

function valueCompare(a, b){

    if (a === 'A'){return true}
    if (b === 'A'){return false}
    if (a === 'K'){return true}
    if (b === 'K'){return false}
    if (a === 'Q'){return true}
    if (b === 'Q'){return false}
    if (a === '10'){return true}
    if (b === '10'){return false}

    if (a>b){return true}
    else{
        return false
    }

}

let rang = ''
let roundsuit = ''

function RoundSenior () {

    let max = roundCards[roundStart]
    let res = roundStart

    for (let i=1; i<= 4; i++){
        if (roundCards[i].Suit === rang ){
            if (max.Suit !== rang){
                max = roundCards[i]
                res = i
            }
            else{
                if (valueCompare(roundCards[i].Value, max.Value)){
                    max = roundCards[i]
                    res = i
                }
            }
        }
        else{
            if (valueCompare(roundCards[i].Value , max.Value)){
                if (roundCards[i].Suit === roundsuit){
                    max = roundCards[i]
                    res = i
                }
            }
        }
    }

    return res

}

let scores = [0,0,0,0,0]
let usernames = ["Waiting","Waiting","Waiting","Waiting","Waiting"]

io.on("connection",(conn)=>{

    const id = getID()

    if (id>4){
        // for (let client of clients.keys()){
            conn.emit('errMessage', {data: "There already are 4 players"})
        // }
    }
    
    clients.set(conn, id)
    console.log("user connected with an id", id, "and ", conn.id)

    for (let client of clients.keys()){
        client.emit('userConn', {data: {id1: id1, id2: id2, id3: id3, id4: id4, current: clients.get(client) }})
    }

    if (id1===true && id2===true && id3===true && id4===true){
        const c1 = unideck[0]
        const c2 = unideck[1]
        const c3 = unideck[2]
        const c4 = unideck[3]

        const next_turn = getLargest([c1,c2,c3,c4])
        for (let client of clients.keys()){
            client.emit('cardDraw', {data: {c1: c1, c2: c2, c3: c3, c4: c4, next: next_turn, nextname:usernames[next_turn] }})
        }
        roundStart = next_turn

    }

    conn.on("Rang",(myData)=>{
        rang = myData.data.rang
        for (let client of clients.keys()){
            client.emit('Rang', {data:{rang: myData.data.rang}})
        }
    })

    conn.on("getFive", (myData)=> {
        for (let client of clients.keys()){
            client.emit('getFive', {data:{deck1: first1, deck2: first2, deck3: first3, deck4: first4}})
        }
        
    })

    conn.on("getRest", (myData)=> {

        for (let client of clients.keys()){
            client.emit('getRest', {data:{deck1: deck1, deck2: deck2, deck3: deck3, deck4: deck4}})
        }
        
    })

    conn.on("username", (myData) => {
        if (id <= 4){
            usernames[id] = myData.data.username

            for (let client of clients.keys()){
                client.emit('username', {data: {
                    name1: usernames[1], 
                    name2: usernames[2],
                    name3: usernames[3],
                    name4: usernames[4],
                    }})
            }
        }

    })

    conn.on("errMessage", (myData)=> {

        for (let client of clients.keys()){
            client.emit('errMessage', {data: myData.data.message + " " + usernames[id]})
        }
        
    })

    conn.on("cardPlay", (myData) => {
        
        let tt = myData.data.card
        roundCards[myData.data.player] = tt

        if (myData.data.player === roundStart){
            roundsuit = myData.data.card.Suit
            for (let client of clients.keys()){
                client.emit('resetBoard', {data: "Reset boards Message"})
                client.emit('roundRang', {data: {rang: myData.data.card.Suit}})
            }
        }

        if (roundCounter === 3){
            let next = RoundSenior()
            scores[next] += 1
            roundStart = next

            for (let client of clients.keys()){
                client.emit('cardPlay', {data:{
                    player: myData.data.player, 
                    Value: myData.data.card.Value,
                    Suit: myData.data.card.Suit,
                    next: next,
                    nextname:usernames[next],
                    reset: true
                }})
                client.emit('roundRang', {data: {rang: ''}})
            }

            if (scores[1]+scores[3]>=7){

                for (let client of clients.keys()){
                    client.emit('WinnerFound', {data: {winner: "User 1 and 3 have won!"} })
                }

            }
            else if (scores[2]+scores[4]>=7){

                for (let client of clients.keys()){
                    client.emit('WinnerFound', {data: {winner: "User 2 and 4 have won!"} })
                }

            }

            roundCounter = 0
        }
        else{
            let next = 0

            if (myData.data.player === 1){ next = 2}
            else if (myData.data.player === 2){next = 3}
            else if (myData.data.player === 3){next = 4}
            else if (myData.data.player === 4){next = 1}


            for (let client of clients.keys()){
                client.emit('cardPlay', {data:{
                    player: myData.data.player, 
                    Value: myData.data.card.Value,
                    Suit: myData.data.card.Suit,
                    next: next,
                    nextname:usernames[next],
                    reset: false
                }})
            }

            roundCounter += 1
        }
       
    })

    conn.on("disconnect", ()=> {
        const thisID = clients.get(conn)
        if (thisID === 1){
            id1 = false;
        }
        if (thisID === 2){
            id2 = false;
        }
        if (thisID === 3){
            id3 = false;
        }
        if (thisID === 4){
            id4 = false;
        }
        console.log("Connection disconnected by client " + thisID + " and " + conn.id);
        for (let client of clients.keys()){
            client.emit('userConn', {data: {id1: id1, id2: id2, id3: id3, id4: id4, current: clients.get(client) }})
        }
    })

})


