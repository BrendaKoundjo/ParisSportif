// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MatchManagement.sol";
import "./Wallet.sol";

contract SportsBetting is MatchManagement, Wallet {

    struct Bet {
        address user;
        uint256 amount;
        uint8 choice; // 0 = équipe1, 1 = équipe2, 2 = match nul
    }

    mapping(uint256 => Bet[]) public matchBets; // stocke tous les paris par match

    // 🔹 Placer un pari sur un match
    function placeBet(uint256 _matchId, uint8 _choice, uint256 _amount) public {
        require(_matchId > 0 && _matchId <= matchCount, "Match inexistant");
        require(!matches[_matchId].finished, "Match termine");
        require(_choice <= 2, "Choix invalide");
        require(balanceOf(msg.sender) >= _amount, "Solde insuffisant");

        // Débiter l'utilisateur
        balances[msg.sender] -= _amount;

        // Ajouter le pari
        matchBets[_matchId].push(Bet(msg.sender, _amount, _choice));

        // Mettre à jour les totaux du match
        if(_choice == 0) matches[_matchId].totalBetTeam1 += _amount;
        else if(_choice == 1) matches[_matchId].totalBetTeam2 += _amount;
        else matches[_matchId].totalBetDraw += _amount;
    }

    // 🔹 Distribuer les gains après le résultat
    function distributeGains(uint256 _matchId) internal {
        Match storage m = matches[_matchId];

        uint256 totalBets = m.totalBetTeam1 + m.totalBetTeam2 + m.totalBetDraw;
        uint256 winningPool;

        if(m.result == 0) winningPool = m.totalBetTeam1;
        else if(m.result == 1) winningPool = m.totalBetTeam2;
        else winningPool = m.totalBetDraw;

        if(winningPool == 0) return; // Pas de gagnants

        // Calculer gains et créditer wallet interne
        Bet[] storage bets = matchBets[_matchId];
        for(uint i = 0; i < bets.length; i++){
            if(bets[i].choice == m.result){
                // probabilité et cote
                uint256 proba = (winningPool * 1e18) / totalBets;
                uint256 cote = (1e18 * 1e18) / proba;
                uint256 gain = (bets[i].amount * cote) / 1e18;

                balances[bets[i].user] += gain; // créditer le wallet interne
            }
        }
    }

    // 🔹 Fonction publique pour clôturer un match et distribuer les gains
    function setMatchResult(uint256 _matchId, uint8 _result) public {
        setResult(_matchId, _result); // de MatchManagement
        distributeGains(_matchId);
    }

    // 🔹 Voir le nombre de paris sur un match
    function getNumberOfBets(uint256 _matchId) public view returns (uint) {
        return matchBets[_matchId].length;
    }

    // 🔹 Voir les paris d’un match
    function getBets(uint256 _matchId) public view returns (Bet[] memory) {
        return matchBets[_matchId];
    }
}
