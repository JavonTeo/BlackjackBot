# blackjackbot
## A bot created on discord for playing blackjack

### *Before starting the game, a few steps have to be taken:*
1. Check tokens under .env contains:
    a) serverid
    b) bottoken
2. Adjust serverID and bottoken are correct in drawcards and startbj
    Line 15 startbj/Line 29 drawcards: "membersArr = clients.gu....get(process.env."XXX").memb...", ensure "XXX" is of the correct server id

### Bot Commands:
There are 2 types of commands: a) those with "!" prefix, b) those without.
- *Commands prefixing with "!" are those related to the main blackjack game*
    1. "startbj" : collects the players (those who reply "joinbj")
    2. "choosedealer" : chooses dealer
    3. "placebets": collect bet amount from every player
    4. "dealcard": dealer-only command. deal cards to all players, via bot Direct Message
    5. "21check": check if any player has ban luck/ban ban, and the game ends. else game continues
    6. "zao" : allows player to escape the game if he has exactly 15
    7. "hitstand": intitiates hit/stand phase for all players, turn by turn
    8. "open": dealer-only command. must have a subsequent argument of a players name. reveals player cards
    9. "dealerhitstand": dealer-only command. hit/stand for dealer
    10. "wnl": display the winnings and losses of all players at the end of a game
    11. "clearcache": deletes file bjInfo.json for a new game
    12. "whoisdealer": displays dealer name
    13. "shutdown": prints a message on server telling all server members the bot will shutdown
- *Commands without "!" prefix are miscellaneous functions"
    1. "ping" : bot says "pong"

planned procedure:

`!startbj`
1. players enters joinbj to participate in the blackjack game. playersList updated to a list of all players. gameApproval updated to true. new file 'bjInfo.js' is created, new variables playersList and gameApproval are created in bjInfo.js

`!choosedealer`

2. checks gameApproval is true, return if false. bot chooses dealer from playersList, stored in new variable dealerID. dealerApproval updated to true. New variables dealerID and dealerApproval are created in bjInfo.json

`!placebets`

3. checks dealerApproval, return if false. bot creates list of [id : bet amount]. betApproval updated to true. *bot only carries on once all player has placed bets. if not betApproval remains false. new variables betList and betApproval are created in bjInfo.js

`!21check`

4. game ends if anyone has 21 with the 2 card dealt. 

`!dealcards`

5. 2 cards dealt randomly to each player via private message. once all cards dealt, bot says "all cards dealt, initiating hit/stand phase"

`!hitstand`

6. bot says "player 1, hit or stand?". this loops until all players dealt. dealer will be the last to "hit/stand".
    pre hit/stand phase:
        - if player gets 21, player wins 1.5x of his own bet.
        - if dealer gets 21, player loses 1.5x of his own bet.
        - if both gets 21, no exhange of money.
    after hit/stand phase:
        - if dealer busts, automatically revealed and he pays everyone 1x of their bet.
        - if dealer has the higher hand, player loses 1x of bet.
        - if player has the higher hand, player wins 1x of bet.
        - if both same value, no exchange.

`!open <playername>`

7. Dealer only command. Reveals players hand.

`!dealer hitstand`

8. Dealer only command. Hit stand phase for the dealer.

`!wnl`

9. Display winnings and losses of all players.

#### order: startbj, choosedealer, placebets, dealcards, 21check, hitstand, open, dealerhitstand, wnl


## into console: type npm run dev or npm run start
