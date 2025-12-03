// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ParisSportifs {
    
    // === STRUCTURES ===
    struct Match {
        string equipe1;
        string equipe2;
        bool termine;
        uint8 resultat; // 0 = équipe1, 1 = équipe2, 2 = match nul
        uint256 misesEquipe1;
        uint256 misesEquipe2;
        uint256 misesEgalite;
    }

    struct Pari {
        address parieur;
        uint256 montant;
        uint8 choix; // 0 = équipe1, 1 = équipe2, 2 = match nul
    }

    // === VARIABLES D'ÉTAT ===
    uint256 public numeroMatch; // nombre de matchs créés
    mapping(uint256 => Match) public matchs; // stockage des matchs par ID
    mapping(address => uint256) public soldes; // soldes des utilisateurs
    mapping(uint256 => Pari[]) public parisDuMatch; // stocke tous les paris par match
    address public proprio;

    // === ÉVÉNEMENTS ===
    event MatchCree(uint256 indexed id, string equipe1, string equipe2);
    event PariPlace(address indexed parieur, uint256 indexed matchId, uint8 choix, uint256 montant);
    event ResultatFixe(uint256 indexed matchId, uint8 resultat);
    event GainsDistribues(address indexed gagnant, uint256 montant);
    event Depot(address indexed user, uint256 montant);
    event Retrait(address indexed user, uint256 montant);

    constructor() {
        proprio = msg.sender;
    }

    // === FONCTIONS WALLET ===
    
    // Déposer de l'ETH dans le contrat
    function deposer() public payable {
        require(msg.value > 0, "Vous devez envoyer de l'ETH");
        soldes[msg.sender] += msg.value;
        emit Depot(msg.sender, msg.value);
    }

    // Retirer son solde
    function retirer(uint256 _montant) public {
        require(soldes[msg.sender] >= _montant, "Solde insuffisant");
        soldes[msg.sender] -= _montant;

        // Transfert sécurisé pour éviter la réentrance
        (bool success, ) = payable(msg.sender).call{value: _montant}("");
        require(success, "Echec du transfert");
        
        emit Retrait(msg.sender, _montant);
    }

    // Voir le solde d'un utilisateur
    function monSolde() public view returns(uint256) {
        return soldes[msg.sender];
    }

    // === FONCTIONS MATCH MANAGEMENT ===
    
    // Créer un match
    function creerMatch(string memory _equipe1, string memory _equipe2) public {
        require(msg.sender == proprio, "Seul le proprietaire peut creer un match");
        numeroMatch++;
        matchs[numeroMatch] = Match({
            equipe1: _equipe1,
            equipe2: _equipe2,
            termine: false,
            resultat: 0,
            misesEquipe1: 0,
            misesEquipe2: 0,
            misesEgalite: 0
        });
        
        emit MatchCree(numeroMatch, _equipe1, _equipe2);
    }

    // Vérifier si un match est terminé
    function estTermine(uint256 _matchId) public view returns(bool) {
        require(_matchId > 0 && _matchId <= numeroMatch, "Match inexistant");
        return matchs[_matchId].termine;
    }

    // === FONCTIONS PARIS ===
    
    // Placer un pari sur un match
    function parier(uint256 _matchId, uint8 _choix, uint256 _montant) public {
        require(_matchId > 0 && _matchId <= numeroMatch, "Match inexistant");
        require(!matchs[_matchId].termine, "Match termine");
        require(_choix <= 2, "Choix invalide");
        require(soldes[msg.sender] >= _montant, "Solde insuffisant");

        // Débiter l'utilisateur
        soldes[msg.sender] -= _montant;

        // Ajouter le pari
        parisDuMatch[_matchId].push(Pari(msg.sender, _montant, _choix));

        // Mettre à jour les totaux du match
        if(_choix == 0) matchs[_matchId].misesEquipe1 += _montant;
        else if(_choix == 1) matchs[_matchId].misesEquipe2 += _montant;
        else matchs[_matchId].misesEgalite += _montant;
        
        emit PariPlace(msg.sender, _matchId, _choix, _montant);
    }

    // Fixer le résultat et distribuer les gains
    function fixerResultat(uint256 _matchId, uint8 _resultat) public {
        require(msg.sender == proprio, "Seul le proprietaire peut fixer le resultat");
        require(_matchId > 0 && _matchId <= numeroMatch, "Match inexistant");
        require(!matchs[_matchId].termine, "Match deja termine");
        require(_resultat <= 2, "Resultat invalide");

        Match storage m = matchs[_matchId];
        m.resultat = _resultat;
        m.termine = true;
        
        emit ResultatFixe(_matchId, _resultat);

        // Distribuer les gains
        _distribuerGains(_matchId);
    }

    // === FONCTIONS CALCUL COTES ===
    
    // Calculer la cote pour un choix donné
    function calculerCote(uint256 _matchId, uint8 _choix) public view returns(uint256) {
        require(_matchId > 0 && _matchId <= numeroMatch, "Match inexistant");
        require(_choix <= 2, "Choix invalide");
        
        Match storage m = matchs[_matchId];
        uint256 totalMises = m.misesEquipe1 + m.misesEquipe2 + m.misesEgalite;
        
        if(totalMises == 0) return 1e18; // Cote de 1.0 si pas de paris
        
        uint256 misesChoix;
        if(_choix == 0) misesChoix = m.misesEquipe1;
        else if(_choix == 1) misesChoix = m.misesEquipe2;
        else misesChoix = m.misesEgalite;
        
        if(misesChoix == 0) return 1e18; // Cote de 1.0 si pas de paris sur ce choix
        
        // Proba = misesChoix / totalMises
        // Cote = 1 / Proba = totalMises / misesChoix
        // On multiplie par 1e18 pour la précision décimale
        return (totalMises * 1e18) / misesChoix;
    }
    
    // Calculer la probabilité pour un choix donné (en pourcentage * 100)
    function calculerProba(uint256 _matchId, uint8 _choix) public view returns(uint256) {
        require(_matchId > 0 && _matchId <= numeroMatch, "Match inexistant");
        require(_choix <= 2, "Choix invalide");
        
        Match storage m = matchs[_matchId];
        uint256 totalMises = m.misesEquipe1 + m.misesEquipe2 + m.misesEgalite;
        
        if(totalMises == 0) return 3333; // 33.33% si pas de paris
        
        uint256 misesChoix;
        if(_choix == 0) misesChoix = m.misesEquipe1;
        else if(_choix == 1) misesChoix = m.misesEquipe2;
        else misesChoix = m.misesEgalite;
        
        // Retourne la probabilité en pourcentage * 100 (ex: 2500 = 25.00%)
        return (misesChoix * 10000) / totalMises;
    }
    
    // Calculer le gain potentiel pour une mise donnée
    function calculerGainPotentiel(uint256 _matchId, uint8 _choix, uint256 _mise) public view returns(uint256) {
        uint256 cote = calculerCote(_matchId, _choix);
        // Gain = Mise × Cote
        return (_mise * cote) / 1e18;
    }

    // Distribuer les gains après le résultat - NOUVELLE FORMULE
    function _distribuerGains(uint256 _matchId) internal {
        Match storage m = matchs[_matchId];
        
        uint256 totalMises = m.misesEquipe1 + m.misesEquipe2 + m.misesEgalite;
        uint256 misesGagnantes;

        if(m.resultat == 0) misesGagnantes = m.misesEquipe1;
        else if(m.resultat == 1) misesGagnantes = m.misesEquipe2;
        else misesGagnantes = m.misesEgalite;

        if(misesGagnantes == 0 || totalMises == 0) return; // Pas de gagnants
        
        // Calculer la cote gagnante
        uint256 coteGagnante = (totalMises * 1e18) / misesGagnantes;

        // Distribuer aux gagnants selon la formule: Gain = Mise × Cote
        Pari[] storage paris = parisDuMatch[_matchId];
        for(uint i = 0; i < paris.length; i++){
            if(paris[i].choix == m.resultat){
                // Gain = Mise × Cote
                uint256 gain = (paris[i].montant * coteGagnante) / 1e18;
                soldes[paris[i].parieur] += gain;
                
                emit GainsDistribues(paris[i].parieur, gain);
            }
        }
    }

    // === FONCTIONS DE SIMULATION ===
    
    // Simuler des paris automatiques pour créer des cotes réalistes
    function simulerParis(uint256 _matchId) public {
        require(_matchId > 0 && _matchId <= numeroMatch, "Match inexistant");
        require(!matchs[_matchId].termine, "Match termine");
        require(msg.sender == proprio, "Seul le proprietaire peut simuler");
        
        // Créer des adresses fictives déterministes
        address bot1 = address(uint160(uint(keccak256(abi.encodePacked(_matchId, "bot1")))));
        address bot2 = address(uint160(uint(keccak256(abi.encodePacked(_matchId, "bot2")))));
        address bot3 = address(uint160(uint(keccak256(abi.encodePacked(_matchId, "bot3")))));
        address bot4 = address(uint160(uint(keccak256(abi.encodePacked(_matchId, "bot4")))));
        
        // Montants aléatoires basés sur l'ID du match
        uint256 seed = uint256(keccak256(abi.encodePacked(_matchId, block.timestamp)));
        
        // Paris équipe 1 (30-50% du total)
        uint256 bet1 = ((seed % 5) + 3) * 1e16; // 0.03-0.07 ETH
        uint256 bet2 = ((seed % 3) + 2) * 1e16; // 0.02-0.04 ETH
        
        // Paris équipe 2 (30-50% du total) 
        uint256 bet3 = (((seed >> 8) % 4) + 3) * 1e16; // 0.03-0.06 ETH
        
        // Pari match nul (10-20% du total)
        uint256 bet4 = (((seed >> 16) % 2) + 1) * 1e16; // 0.01-0.02 ETH
        
        // Ajouter les paris sans débiter (soldes fictifs)
        parisDuMatch[_matchId].push(Pari(bot1, bet1, 0)); // Équipe 1
        parisDuMatch[_matchId].push(Pari(bot2, bet2, 0)); // Équipe 1
        parisDuMatch[_matchId].push(Pari(bot3, bet3, 1)); // Équipe 2
        parisDuMatch[_matchId].push(Pari(bot4, bet4, 2)); // Match nul
        
        // Mettre à jour les totaux
        matchs[_matchId].misesEquipe1 += bet1 + bet2;
        matchs[_matchId].misesEquipe2 += bet3;
        matchs[_matchId].misesEgalite += bet4;
        
        // Émettre les événements
        emit PariPlace(bot1, _matchId, 0, bet1);
        emit PariPlace(bot2, _matchId, 0, bet2);
        emit PariPlace(bot3, _matchId, 1, bet3);
        emit PariPlace(bot4, _matchId, 2, bet4);
    }
    
    // Créer un match avec paris automatiques
    function creerMatchAvecParis(string memory _equipe1, string memory _equipe2) public {
        require(msg.sender == proprio, "Seul le proprietaire peut creer un match");
        
        // Créer le match normal
        creerMatch(_equipe1, _equipe2);
        
        // Ajouter des paris automatiques
        simulerParis(numeroMatch);
    }

    // === FONCTIONS DE LECTURE ===
    
    // Voir le nombre de paris sur un match
    function nombreParis(uint256 _matchId) public view returns (uint256) {
        return parisDuMatch[_matchId].length;
    }
    
    // Obtenir les cotes actuelles pour toutes les options
    function obtenirToutesCotes(uint256 _matchId) public view returns(uint256, uint256, uint256) {
        return (
            calculerCote(_matchId, 0), // Équipe 1
            calculerCote(_matchId, 1), // Équipe 2
            calculerCote(_matchId, 2)  // Match nul
        );
    }
    
    // Obtenir toutes les probabilités
    function obtenirToutesProba(uint256 _matchId) public view returns(uint256, uint256, uint256) {
        return (
            calculerProba(_matchId, 0), // Équipe 1
            calculerProba(_matchId, 1), // Équipe 2
            calculerProba(_matchId, 2)  // Match nul
        );
    }
}