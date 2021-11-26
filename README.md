# blackjackbot
A bot created on discord for playing blackjack
hello world

adjust server ID in drawcards and startbj

planned procedure:
!startbj
1. players enters joinbj to participate in the blackjack game. playersList updated to a list of all players. gameApproval updated to true.
new file 'bjInfo.js' is created, new variables playersList and gameApproval are created in bjInfo.js

2. !choosedealer is activated; checks gameApproval is true, return if false. bot chooses random dealer from playersList, into new variable dealerID. dealerApproval updated to true.
new variables dealerID and dealerApproval are created in bjInfo.js

3. !placebets activated; checks dealerApproval, return if false. bot creates list of [id : bet amount]. betApproval updated to true. *bot only carries on once all player has placed bets. if not betApproval remains false.
new variables betList and betApproval are created in bjInfo.js

4. only dealer activates !dealcards. 2 cards dealt randomly to each player via private message.
once all cards dealt, bot says "all cards dealt, initiating hit/stand phase"

5. bot says "player 1, hit or stand?". this loops until all players dealt. dealer will be the last to "hit/stand".
    pre hit/stand phase:
        - if player gets 21, player wins 1.5x of his own bet.
        - if dealer gets 21, player loses 1.5x of his own bet.
        - if both gets 21, no exhange of money.
    after hit/stand phase:
        - if dealer busts, automatically revealed and he pays everyone 1x of their bet.
        - if dealer has the higher hand, player loses 1x of bet.
        - if player has the higher hand, player wins 1x of bet.
        - if both same value, no exchange.

order: startbj, choosedealer, placebets, dealcards, hitstand


into console:
    type npm run dev or npm run start
    main blackjack: !<command>

    ping: "ping"
    imgs: "fap to <name>"
