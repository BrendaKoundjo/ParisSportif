# Paris Sportifs Web3 - README

##  **Description**
Site de paris sportifs décentralisé sur Ethereum. Créez des matchs, pariez avec ETH, recevez gains automatiques avec cotes dynamiques. Contrat Solidity unifié + Frontend React.

![Demonstration](smartcontract.png)

## **Prérequis**
- **Node.js** 18+ (`node --version`)
- **Navigateur** Chrome/Brave + MetaMask
- **Git** (optionnel)

##  **Installation (5 min)**

```bash
# 1. Cloner / Télécharger projet
git clone https://github.com/BrendaKoundjo/ParisSportif.git
cd ParisSportifs

# 2. Installer dépendances
npm install

# 3. Lancer frontend
npm run dev
```
→ **http://localhost:3000** 

##  **Déployer Contrat (Remix)**

1. **https://remix.ethereum.org**
2. Créer 1 fichier :
   ```
   contracts/
   └── ParisSportifs.sol
   ```
3. **Compiler** → Solidity 0.8.20+
4. **Deploy** → **Injected Provider - MetaMask** → **Sepolia**
5.  **COPIER** : Adresse contrat + ABI

## **Configurer MetaMask**

### **Ajouter Sepolia**
```
https://chainlist.org → "Sepolia" → "Add to MetaMask"
OU Manuel :
RPC: https://rpc.sepolia.org
Chain ID: 11155111
```

### **ETH Gratuit**
```
https://sepolia-faucet.pk910.de/ → Votre adresse
```

## 🎮 **Utilisation**

```
1. localhost:3000 → "Connecter Wallet"
2. deposer() → 0.5 ETH (Metamask → Contrat)
3. Créer Match → "PSG vs OM" (Match #1) 
4. Parier → Match 1, PSG, 0.1 ETH (voir cotes dynamiques)
5. Fixer Résultat → Match 1, PSG gagne
6.  Gains automatiques selon la formule: Gain = Mise × Cote
```

##  **Structure Projet**

```
paris-sportifs/
├── contracts/           # Solidity (1 fichier unifié)
├── src/
│   ├── App.jsx         # Frontend principal
│   └── App.css         # Design
├── public/
└── package.json
```

##  **Configuration App.jsx**

```jsx
const CONTRACT_ADDRESS = '0xVotreAdresseRemix';
const ABI = [ /* ABI JSON copié Remix */ ];
```


