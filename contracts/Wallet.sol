// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Wallet {

    // 🔹 Mapping pour stocker les soldes des utilisateurs
    mapping(address => uint256) internal balances;

    // 🔹 Déposer de l'ETH dans le contrat
    function deposit() public payable {
        require(msg.value > 0, "Vous devez envoyer de l'ETH");
        balances[msg.sender] += msg.value;
    }

    // 🔹 Retirer son solde
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Solde insuffisant");
        balances[msg.sender] -= amount;

        // Transfert sécurisé pour éviter la réentrance
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Echec du transfert");
    }

    // 🔹 Voir le solde total du contrat
    function totalBalance() public view returns(uint256) {
        return address(this).balance;
    }

    // 🔹 Voir le solde d'un utilisateur
    function balanceOf(address user) public view returns(uint256) {
        return balances[user];
    }
}
