import { Socket } from "socket.io-client" 
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { useNavigate } from "react-router-dom"

interface HomePageProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> //this is the type for sockets 
    //you can always add more functions/objects that you would like as props for this component
}

function GameView({socket}:HomePageProps){

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
                <h1>Rang</h1>
                </div>
                <div className="game-table-container">
                <div className="game-table">
                    <div className="card-area">
                    <div className="card-area-rows output-row-one">
                        <div className="card rank-7 spades">
                        <span className="rank">7</span>
                        <span className="suit">&spades;</span>
                        </div>
                    </div>
                    <div className="card-area-rows output-row-two">
                        <div className="card rank-7 spades">
                        <span className="rank">7</span>
                        <span className="suit">&spades;</span>
                        </div>
                        <div className="card rank-7 spades">
                        <span className="rank">7</span>
                        <span className="suit">&spades;</span>
                        </div>
                    </div>
                    <div className="card-area-rows output-row-three">
                        <div className="card rank-7 spades">
                        <span className="rank">7</span>
                        <span className="suit">&spades;</span>
                        </div>
                    </div>
                    </div>

                    <div className="game-players-container">
                    <div className="player-tag player-one">Esha</div>
                    </div>

                    <div className="game-players-container">
                    <div className="player-tag player-two">Saood</div>
                    </div>

                    <div className="game-players-container">
                    <div className="player-tag player-three">Ahmed</div>
                    </div>

                    <div className="game-players-container">
                    <div className="player-tag player-four">Mahd</div>
                    </div>
                </div>
                </div>
                <div className="select-rang-container">
                <h3>Select Rang:</h3>
                <button className="button-select-rang">Diamond</button>
                <button className="button-select-rang">Hearts</button>
                <button className="button-select-rang">Spades</button>
                <button className="button-select-rang">Clubs</button>
                </div>
            </div>
            <div className="messages-and-cards-container">
                <div className="right-side-container messages-container">
                <h1>Messages</h1>
                <div className="message-box">
                    <div className="message-content-container">
                    latest message comes here
                    </div>
                    <div className="message-content-container">
                    Goodluck for the assignment!
                    </div>
                </div>
                </div>
                <div className="right-side-container my-cards-container">
                <h1>My Cards</h1>
                <div className="my-cards-inner-container">
                    <ul className="hand">
                    <li>
                        <a className="card rank-7 spades">
                        <span className="rank">7</span>
                        <span className="suit">&spades;</span>
                        </a>
                    </li>
                    <li>
                        <a className="card rank-q hearts">
                        <span className="rank">Q</span>
                        <span className="suit">&hearts;</span>
                        </a>
                    </li>
                    <li>
                        <a className="card rank-2 diams">
                        <span className="rank">2</span>
                        <span className="suit">&diam;</span>
                        </a>
                    </li>
                    <li>
                        <a className="card rank-a spades">
                        <span className="rank">A</span>
                        <span className="suit">&clubs;</span>
                        </a>
                    </li>
                    <li>
                        <a className="card rank-6 diams">
                        <span className="rank">6</span>
                        <span className="suit">&diams;</span>
                        </a>
                    </li>
                    </ul>
                
                </div>
                </div>
            </div>
            </div>
        </body>
        </html>
    
    )

}
export default GameView