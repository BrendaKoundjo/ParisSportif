// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MatchManagement {

    struct Match {
        string team1;
        string team2;
        bool finished;
        uint8 result; // 0 = équipe1, 1 = équipe2, 2 = match nul
        uint256 totalBetTeam1;
        uint256 totalBetTeam2;
        uint256 totalBetDraw;
    }

    uint256 public matchCount; // nombre de matchs créés
    mapping(uint256 => Match) public matches; // stockage des matchs par ID
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // 🔹 Créer un match
    function createMatch(string memory _team1, string memory _team2) public {
        require(msg.sender == owner, "Seul le proprietaire peut creer un match");
        matchCount++;
        matches[matchCount] = Match({
            team1: _team1,
            team2: _team2,
            finished: false,
            result: 0,
            totalBetTeam1: 0,
            totalBetTeam2: 0,
            totalBetDraw: 0
        });
    }

    // 🔹 Enregistrer le résultat du match
    function setResult(uint256 _matchId, uint8 _result) public {
        require(msg.sender == owner, "Seul le proprietaire peut enregistrer le resultat");
        require(_matchId > 0 && _matchId <= matchCount, "Match inexistant");

        Match storage m = matches[_matchId];
        require(!m.finished, "Match deja termine");
        require(_result <= 2, "Resultat invalide");

        m.result = _result;
        m.finished = true;
    }

    // 🔹 Vérifier si un match est terminé
    function isFinished(uint256 _matchId) public view returns(bool) {
        require(_matchId > 0 && _matchId <= matchCount, "Match inexistant");
        return matches[_matchId].finished;
    }
}
