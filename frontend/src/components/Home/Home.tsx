import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import './rang.css'
import { useState, useEffect } from "react"

//create an interface for the props that you want to pass to this component
interface HomePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    //you can always add more functions/objects that you would like as props for this component
}

interface CardInterface {

    Value: String,
    Suit: String
}


function HomePage({socket}:HomePageProps){

    const [waiting, setWaiting] = useState(true)
    const [tempName, setTempName] = useState("username")

    const [user1,setUser1] = useState("Waiting")
    const [user2,setUser2] = useState("Waiting")
    const [user3,setUser3] = useState("Waiting")
    const [user4,setUser4] = useState("Waiting")

    const [user1CardRank,setuser1CardRank] = useState('')
    const [user2CardRank,setuser2CardRank] = useState('')
    const [user3CardRank,setuser3CardRank] = useState('')
    const [user4CardRank,setuser4CardRank] = useState('')
    const [user1CardType,setUser1CardType] = useState(<span> </span>)
    const [user2CardType,setUser2CardType] = useState(<span> </span>)
    const [user3CardType,setUser3CardType] = useState(<span> </span>)
    const [user4CardType,setUser4CardType] = useState(<span> </span>)

    const [rang,setRang] = useState('')
    const [rangAllowed, setRangAllowed] = useState(false)
    const [playStart, setPlayStart] = useState(false)

    const [currentUser, setCurrentUser] = useState(0)
    const [currentTurn, setCurrentTurn] = useState(0)
    const [currentHand, setCurrentHand] = useState([])
    const [roundSuit, setRoundSuit] = useState('')
    const [gameOver, setGameOver] = useState(false)
    
    const [messages,setMessages] = useState(["Welcome"])
    const [errMsg, setErrMsg] = useState('')
    const [mode, setMode] = useState("Playing")

    const addingMessage = (str: string) => {

        let tempList = messages
        tempList.push(str)
        setMessages(tempList)
    }
    
    const convertSuit = (str: String) => {
        if (str === "Diamond"){
            return (<span> &diams;</span>)
        }
        else if(str === "Hearts"){
            return (<span> &hearts;</span>)
        }
        else if(str === "Clubs"){
            return (<span> &clubs;</span>)
        }
        else {
            return (<span> &spades;</span>)
        }
    }
    
    const onRangClick = (n: number) =>{
        if (currentUser !== currentTurn){
            socket.emit('errMessage', {data: {message: "You are not the Rang Selector"}})
            return
        }
        if (rang === '' && rangAllowed){
            if (n===1){socket.emit('Rang',{data:{rang:'Diamond'}}) }
            else if (n===2){ socket.emit('Rang',{data:{rang:'Hearts'}}) }
            else if (n===3){ socket.emit('Rang',{data:{rang:'Spades'}}) }
            else if (n===4){ socket.emit('Rang',{data:{rang:'Clubs'}}) }

            setuser1CardRank('')
            setUser1CardType(<span></span>)
            setuser2CardRank('')
            setUser2CardType(<span></span>)
            setuser3CardRank('')
            setUser3CardType(<span></span>)
            setuser4CardRank('')
            setUser4CardType(<span></span>)

        }
        else{
            socket.emit('errMessage', {data: {message: "Rang already selected"}})
        }
    }
    const onRangReceived = (n: number) => {
        if (rang === ''){
            let tempRang = ''
            if (n===1){setRang('Diamond');tempRang = 'Diamond'}
            else if (n===2){setRang('Hearts');tempRang = 'Hearts'}
            else if (n===3){setRang('Spades');tempRang = 'Spades' }
            else if (n===4){setRang('Clubs');tempRang = 'Clubs' }

            setuser1CardRank('')
            setUser1CardType(<span></span>)
            setuser2CardRank('')
            setUser2CardType(<span></span>)
            setuser3CardRank('')
            setUser3CardType(<span></span>)
            setuser4CardRank('')
            setUser4CardType(<span></span>)
            addingMessage(tempRang + " has been selected as Rang")
            setRangAllowed(false)
            setPlayStart(true)
            
        }
        else{
            console.log("Rang already selected")
            
        }
    }

    const haveRoundSuit = () => {
        const temp = currentHand.filter((card:CardInterface) => {
            if (card.Suit === roundSuit){
                return true
            }
            else{
                return false
            }
        })
        if (temp.length > 0){
            return true
        }
        else{
            return false
        }
    }

    const cardPlayClick = (v: String, s: String)=> {

        if (gameOver){
            socket.emit('errMessage', {data: {message: "Game is over!"}})
            return
        }
        
        if (currentUser !== currentTurn){
            socket.emit('errMessage', {data: {message: "It is not your turn"}})
            return
        }
        if (playStart === false){
            socket.emit('errMessage', {data: {message: "Game hasn't started"}})
            return
        }

        if (roundSuit !== ''){
            if (haveRoundSuit() && s !== roundSuit){
                socket.emit('errMessage', {data: {message: "Please play valid card"}})
                return 
            }
        }
        const x = currentHand.filter((card: CardInterface)=> {
        if (card.Value !== v || card.Suit !== s){
            return true
        }
        else{
            return false
        }
        })
        setCurrentHand(x)

        socket.emit('cardPlay',{data:{player: currentUser, card: {Value:v, Suit: s}}}) 

    }

    useEffect ( () => {
    socket.on('connect', () => {

        console.log("Connection detected")
        let currUse = 0

        socket.on('userConn', (serverResponse)=> {
            setCurrentUser(serverResponse.data.current)
            currUse = serverResponse.data.current
            const id1 = serverResponse.data.id1
            const id2 = serverResponse.data.id2
            const id3 = serverResponse.data.id3
            const id4 = serverResponse.data.id4
            
            if (id1 === false){setUser1("Waiting")}
            if (id2 === false){setUser2("Waiting")}
            if (id3 === false){setUser3("Waiting")}
            if (id4 === false){setUser4("Waiting")}
        })

        socket.on('username', (serverResponse) => {
            console.log(serverResponse.data)
            setUser1(serverResponse.data.name1)
            setUser2(serverResponse.data.name2)
            setUser3(serverResponse.data.name3)
            setUser4(serverResponse.data.name4)
        })

        socket.on('cardDraw', (serverResponse) => {

            setuser1CardRank(serverResponse.data.c1.Value)
            setuser2CardRank(serverResponse.data.c2.Value)
            setuser3CardRank(serverResponse.data.c3.Value)
            setuser4CardRank(serverResponse.data.c4.Value)

            setUser1CardType(convertSuit(serverResponse.data.c1.Suit))
            setUser2CardType(convertSuit(serverResponse.data.c2.Suit))
            setUser3CardType(convertSuit(serverResponse.data.c3.Suit))
            setUser4CardType(convertSuit(serverResponse.data.c4.Suit))
            
            setCurrentTurn(serverResponse.data.next)
            addingMessage(`The Player to select Rang is: ${serverResponse.data.nextname}`)
            socket.emit('getFive',{data: "Drawing first 5 cards"})

        })

        socket.on('cardPlay', (serverResponse) => {

            if (serverResponse.data.player === 1){
                setuser1CardRank(serverResponse.data.Value)
                setUser1CardType(convertSuit(serverResponse.data.Suit))
            }
            else if (serverResponse.data.player === 2){
                setuser2CardRank(serverResponse.data.Value)
                setUser2CardType(convertSuit(serverResponse.data.Suit))
            }
            else if (serverResponse.data.player === 3){
                setuser3CardRank(serverResponse.data.Value)
                setUser3CardType(convertSuit(serverResponse.data.Suit))
            }
            else if (serverResponse.data.player === 4){
                setuser4CardRank(serverResponse.data.Value)
                setUser4CardType(convertSuit(serverResponse.data.Suit))
            }

            setCurrentTurn(serverResponse.data.next)
            addingMessage(`The Next Turn is: ${serverResponse.data.nextname}`)

        })

        socket.on ('resetBoard', (serverResponse) => {

            setuser1CardRank('')
            setUser1CardType(<span></span>)
            setuser2CardRank('')
            setUser2CardType(<span></span>)
            setuser3CardRank('')
            setUser3CardType(<span></span>)
            setuser4CardRank('')
            setUser4CardType(<span></span>)
            
        })

        socket.on('roundRang', (serverResponse) => {
            setRoundSuit(serverResponse.data.rang)
            const temp = serverResponse.data.rang 
            if (temp !== ''){
                addingMessage("New round, with suit: "+ serverResponse.data.rang)
            }
        })


        socket.on('getFive', (serverResponse) => {
            if (currUse === 1){
                setCurrentHand(serverResponse.data.deck1)
            }
            else if (currUse === 2){
                setCurrentHand(serverResponse.data.deck2)
            }
            else if (currUse === 3){
                setCurrentHand(serverResponse.data.deck3)
            }
            else if (currUse === 4){
                setCurrentHand(serverResponse.data.deck4)
            }

            setRangAllowed(true)

        })

        socket.on('getRest', (serverResponse) => {
            if (currUse === 1){
                setCurrentHand(serverResponse.data.deck1)
            }
            else if (currUse === 2){
                setCurrentHand(serverResponse.data.deck2)
            }
            else if (currUse === 3){
                setCurrentHand(serverResponse.data.deck3)
            }
            else if (currUse === 4){
                setCurrentHand(serverResponse.data.deck4)
            }

        })

        socket.on('Rang', (serverResponse)=> {

            if (serverResponse.data.rang === "Diamond"){onRangReceived(1)}
            else if (serverResponse.data.rang === "Hearts"){onRangReceived(2)}
            else if (serverResponse.data.rang === "Spades"){onRangReceived(3)}
            else if (serverResponse.data.rang === "Clubs"){onRangReceived(4)}
            
            socket.emit('getRest',{data: "Drawing rest of 8 cards"})
        })

        socket.on('WinnerFound', (serverResponse) => {
            addingMessage(serverResponse.data.winner)
            setGameOver(true)
        })
        
        socket.on('errMessage', (serverResponse) => {
            const temp = serverResponse.data

            if (temp === "There already are 4 players"){
                setMode("Spectating")
            }
            setErrMsg(serverResponse.data)
            addingMessage(temp)
        })


    })
    },[currentUser]
    )

    if (waiting){

        const handleClick = (socket: Socket) => {
            console.log('Socket ID:', socket.id);
            console.log(tempName)
            socket.emit('username', {data: {username: tempName}})
            setWaiting(false)
        };
        const onNameChange = (e:any) =>{
            setTempName(e.target.value)
        }

        return(
            <div className="sampleHomePage">
            <h1 className="sampleTitle">My Game</h1>
            <div className="sampleMessage">
            <input  value={tempName} onChange={onNameChange}></input>
            <button  onClick={() => handleClick(socket)}>Click me to join Rang Game</button>
            </div>
        </div>
        )

    }
    else{

    return(
        <html lang="en">
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Rang</title>
        </head>
        <body>
            <div className="main-container playingCards">
            <div className="game-container">
                <div className="heading-container">
                <h1>{mode} Rang as {tempName}</h1>
                
                </div>
                <div className="game-table-container">
                <div className="game-table">
                    <div className="card-area">
                    <div className="card-area-rows output-row-one">
                        <div className="card rank-7 spades">
                        <span className="rank">{user3CardRank}</span>
                        <span className="suit">
                            {user3CardType}
                        </span>
                        </div>
                    </div>
                    <div className="card-area-rows output-row-two">
                        <div className="card rank-7 spades">
                        <span className="rank">{user2CardRank}</span>
                        <span className="suit">
                            {user2CardType}
                        </span>
                        </div>
                        <div className="card rank-7 spades">
                        <span className="rank">{user4CardRank}</span>
                        <span className="suit">
                            {user4CardType}
                        </span>
                        </div>
                    </div>
                    <div className="card-area-rows output-row-three">
                        <div className="card rank-7 spades">
                        <span className="rank">{user1CardRank}</span>
                        <span className="suit">
                            {user1CardType}
                        </span>
                        </div>
                    </div>
                    </div>

                    <div className="game-players-container">
                    <div className="player-tag player-one">{user1}</div>
                    </div>

                    <div className="game-players-container">
                    <div className="player-tag player-two">{user2}</div>
                    </div>

                    <div className="game-players-container">
                    <div className="player-tag player-three">{user3}</div>
                    </div>

                    <div className="game-players-container">
                    <div className="player-tag player-four">{user4}</div>
                    </div>
                </div>
                </div>
                <div className="select-rang-container">
                <h3>Select Rang:</h3>
                <button className="button-select-rang" onClick={() => onRangClick(1)}>Diamond</button>
                <button className="button-select-rang" onClick={() => onRangClick(2)}>Hearts</button>
                <button className="button-select-rang" onClick={() => onRangClick(3)}>Spades</button>
                <button className="button-select-rang" onClick={() => onRangClick(4)}>Clubs</button>
                <h3>Current Rang: {rang}</h3>
                </div>
            </div>
            <div className="messages-and-cards-container">
                <div className="right-side-container messages-container">
                <h1>Messages</h1>
                
                <div className="message-box">
                    {
                    messages.map((list_item:String)=> {
                        return (
                            <div className="message-content-container">
                            {list_item}
                            </div>
                        )
                        })
                    }
                </div>
                </div>

                <div className="right-side-container my-cards-container">
                <h1>My Cards</h1>
                <div className="my-cards-inner-container">
                    <ul className="hand">
                    {
                    currentHand.map((list_item:CardInterface)=> {
                        return (
                            <li>
                                <a className="card">
                                    <button onClick={() => cardPlayClick(list_item.Value,list_item.Suit)}>
                                    <span className="rank">{list_item.Value}</span>
                                    <span className="suit">{convertSuit(list_item.Suit)}</span>
                                    </button>
                                </a>
                            </li>
                        )
                        })
                    }
                    </ul>
                
                </div>
                </div>

            </div>
            </div>
        </body>
        </html>
    
    )
    }

}
export default HomePage
