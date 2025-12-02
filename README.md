# Paris Sportifs Web3 - README

##  **Description**
Site de paris sportifs décentralisé sur Ethereum. Créez des matchs, pariez avec ETH, recevez gains automatiques (5% fee). Contrat Solidity + Frontend React.

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
2. Créer 3 fichiers :
   ```
   contracts/
   ├── Wallet.sol
   ├── MatchManagement.sol
   └── SportsBetting.sol
   ```
3. **Compiler** → Solidity 0.8.20
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
https://sepoliafaucet.com → Votre adresse → 1 ETH TEST
```

## 🎮 **Utilisation**

```
1. localhost:3000 → "Connecter Wallet"
2. deposer() → 0.5 ETH (Metamask → Contrat)
3. Créer Match → "PSG vs OM" (Match #1)
4. Parier → Match 1, PSG, 0.1 ETH
5. Fixer Résultat → Match 1, PSG gagne
6.  Gains automatiques ! (~0.47 ETH)
```

##  **Structure Projet**

```
paris-sportifs/
├── contracts/           # Solidity (3 fichiers)
├── src/
│   ├── App.js          # Frontend principal
│   └── App.css         # Design
├── public/
└── package.json
```

##  **Configuration App.js**

```jsx
const CONTRACT_ADDRESS = '0xVotreAdresseRemix';
const ABI = [ /* ABI JSON copié Remix */ ];
```


