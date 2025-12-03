import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

//Ajouter contract ABI et adresse ici
const CONTRACT_ADDRESS = '0xfA83D350f9D10BC98883A55e862Fb3fB73658611'; 
const ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "montant",
				"type": "uint256"
			}
		],
		"name": "Depot",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "gagnant",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "montant",
				"type": "uint256"
			}
		],
		"name": "GainsDistribues",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "equipe1",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "equipe2",
				"type": "string"
			}
		],
		"name": "MatchCree",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "parieur",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "matchId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "choix",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "montant",
				"type": "uint256"
			}
		],
		"name": "PariPlace",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "matchId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "resultat",
				"type": "uint8"
			}
		],
		"name": "ResultatFixe",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "montant",
				"type": "uint256"
			}
		],
		"name": "Retrait",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_choix",
				"type": "uint8"
			}
		],
		"name": "calculerCote",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_choix",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_mise",
				"type": "uint256"
			}
		],
		"name": "calculerGainPotentiel",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_choix",
				"type": "uint8"
			}
		],
		"name": "calculerProba",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_equipe1",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_equipe2",
				"type": "string"
			}
		],
		"name": "creerMatch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_equipe1",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_equipe2",
				"type": "string"
			}
		],
		"name": "creerMatchAvecParis",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			}
		],
		"name": "estTermine",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_resultat",
				"type": "uint8"
			}
		],
		"name": "fixerResultat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "matchs",
		"outputs": [
			{
				"internalType": "string",
				"name": "equipe1",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "equipe2",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "termine",
				"type": "bool"
			},
			{
				"internalType": "uint8",
				"name": "resultat",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "misesEquipe1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "misesEquipe2",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "misesEgalite",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "monSolde",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			}
		],
		"name": "nombreParis",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "numeroMatch",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			}
		],
		"name": "obtenirToutesCotes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			}
		],
		"name": "obtenirToutesProba",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_choix",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "_montant",
				"type": "uint256"
			}
		],
		"name": "parier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "parisDuMatch",
		"outputs": [
			{
				"internalType": "address",
				"name": "parieur",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "montant",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "choix",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "proprio",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_montant",
				"type": "uint256"
			}
		],
		"name": "retirer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matchId",
				"type": "uint256"
			}
		],
		"name": "simulerParis",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "soldes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  const [solde, setSolde] = useState("0");
  const [matchs, setMatchs] = useState([]);
  const [matchOdds, setMatchOdds] = useState({}); // {matchId: {odds: [1.5, 2.1, 5.0], probas: [40, 30, 10]}}
  const [potentialWinning, setPotentialWinning] = useState("0");

  // Utility function to format ETH amounts
  const formatETH = (amount, decimals = 4) => {
    return Number(amount).toFixed(decimals);
  };

  // Bankroll
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Créer match
  const [equipe1, setEquipe1] = useState("");
  const [equipe2, setEquipe2] = useState("");

  // Parier
  const [matchIdBet, setMatchIdBet] = useState("");
  const [choixBet, setChoixBet] = useState("0");
  const [montantBet, setMontantBet] = useState("");

  // Fixer résultat
  const [matchIdRes, setMatchIdRes] = useState("");
  const [resultatRes, setResultatRes] = useState("0");

  const [message, setMessage] = useState("");

  // Connexion Metamask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage("Installe ou ouvre MetaMask pour utiliser la DApp ");
        return;
      }
      const prov = new ethers.BrowserProvider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const sign = await prov.getSigner();
      const user = await sign.getAddress();

      const cont = new ethers.Contract(CONTRACT_ADDRESS, ABI, sign);

      setProvider(prov);
      setSigner(sign);
      setContract(cont);
      setAccount(user);
      setMessage("Portefeuille connecté ");

      await updateUI(cont);
    } catch (err) {
      console.error(err);
      setMessage("Impossible de se connecter au wallet ");
    }
  };

  // Mettre à jour UI (solde + matchs)
  const updateUI = async (cont) => {
    if (!cont) return;
    try {
      const s = await cont.monSolde();
      setSolde(ethers.formatEther(s));

      await loadMatchs(cont);
    } catch (err) {
      console.error("Erreur updateUI:", err);
    }
  };

  const loadMatchs = async (cont) => {
    try {
      const nb = await cont.numeroMatch();
      const total = Number(nb);
      const temp = [];
      const oddsTemp = {};

      for (let i = 1; i <= total; i++) {
        const m = await cont.matchs(i);
        temp.push({
          id: i,
          equipe1: m.equipe1,
          equipe2: m.equipe2,
          termine: m.termine,
          resultat: Number(m.resultat),
          mises1: ethers.formatEther(m.misesEquipe1),
          mises2: ethers.formatEther(m.misesEquipe2),
          misesEgalite: ethers.formatEther(m.misesEgalite),
        });

        // Charger les cotes et probabilités
        try {
          const [cotes1, cotes2, cotes3] = await cont.obtenirToutesCotes(i);
          const [proba1, proba2, proba3] = await cont.obtenirToutesProba(i);
          
          oddsTemp[i] = {
            odds: [
              Number(ethers.formatEther(cotes1)).toFixed(2),
              Number(ethers.formatEther(cotes2)).toFixed(2), 
              Number(ethers.formatEther(cotes3)).toFixed(2)
            ],
            probas: [
              (Number(proba1) / 100).toFixed(1),
              (Number(proba2) / 100).toFixed(1),
              (Number(proba3) / 100).toFixed(1)
            ]
          };
        } catch (oddsErr) {
          console.log("Pas de cotes pour le match", i);
          oddsTemp[i] = {
            odds: ["1.00", "1.00", "1.00"],
            probas: ["33.3", "33.3", "33.3"]
          };
        }
      }
      setMatchs(temp);
      setMatchOdds(oddsTemp);
    } catch (err) {
      console.error("Erreur loadMatchs:", err);
    }
  };

  // Déposer (deposer, payable)
  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!contract || !depositAmount) return;
    try {
      setMessage("Dépôt en cours...");
      const tx = await contract.deposer({
        value: ethers.parseEther(depositAmount),
      });
      await tx.wait();
      setDepositAmount("");
      setMessage("Dépôt effectué avec succès ");
      await updateUI(contract);
    } catch (err) {
      console.error(err);
      setMessage("Échec du dépôt (solde insuffisant ou erreur).");
    }
  };

  // Retirer
  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!contract || !withdrawAmount) return;
    try {
      setMessage("Retrait en cours...");
      const wei = ethers.parseEther(withdrawAmount);
      const tx = await contract.retirer(wei);
      await tx.wait();
      setWithdrawAmount("");
      setMessage("Retrait effectué ");
      await updateUI(contract);
    } catch (err) {
      console.error(err);
      setMessage("Impossible de retirer (vérifie ton solde).");
    }
  };

  // Créer match (proprio)
  const handleCreerMatch = async (e) => {
    e.preventDefault();
    if (!contract || !equipe1 || !equipe2) return;
    try {
      setMessage("Création du match...");
      const tx = await contract.creerMatch(equipe1, equipe2);
      await tx.wait();
      setEquipe1("");
      setEquipe2("");
      setMessage("Match créé ");
      await updateUI(contract);
    } catch (err) {
      console.error(err);
      setMessage(
        "Échec de la création du match. Es-tu bien propriétaire du contrat ?"
      );
    }
  };

  // Créer match avec paris automatiques
  const handleCreerMatchAvecParis = async (e) => {
    e.preventDefault();
    if (!contract || !equipe1 || !equipe2) return;
    try {
      setMessage("Création du match avec paris automatiques...");
      const tx = await contract.creerMatchAvecParis(equipe1, equipe2);
      await tx.wait();
      setEquipe1("");
      setEquipe2("");
      setMessage("Match créé avec paris automatiques ");
      await updateUI(contract);
    } catch (err) {
      console.error(err);
      setMessage(
        "Échec de la création du match avec paris. Es-tu bien propriétaire du contrat ?"
      );
    }
  };

  // Simuler des paris sur un match existant
  const handleSimulerParis = async (matchId) => {
    if (!contract) return;
    try {
      setMessage("Simulation de paris en cours...");
      const tx = await contract.simulerParis(matchId);
      await tx.wait();
      setMessage("Paris automatiques ajoutés ");
      await updateUI(contract);
    } catch (err) {
      console.error(err);
      setMessage("Échec de la simulation de paris.");
    }
  };

  // Calculer gain potentiel quand l'utilisateur change sa mise
  const updatePotentialWinning = async () => {
    if (!contract || !matchIdBet || !montantBet || !choixBet) {
      setPotentialWinning("0");
      return;
    }
    try {
      const weiAmount = ethers.parseEther(montantBet);
      const gain = await contract.calculerGainPotentiel(
        Number(matchIdBet),
        Number(choixBet),
        weiAmount
      );
      setPotentialWinning(ethers.formatEther(gain));
    } catch (err) {
      setPotentialWinning("0");
    }
  };

  // Mettre à jour le gain potentiel quand les inputs changent
  useEffect(() => {
    updatePotentialWinning();
  }, [matchIdBet, choixBet, montantBet, contract]);

  // Parier
  const handleParier = async (e) => {
    e.preventDefault();
    if (!contract || !matchIdBet || !montantBet) return;
    try {
      setMessage("Pari en cours d’envoi...");
      const wei = ethers.parseEther(montantBet);
      const tx = await contract.parier(
        Number(matchIdBet),
        Number(choixBet),
        wei
      );
      await tx.wait();
      setMontantBet("");
      setMessage("Pari placé ");
      await updateUI(contract);
    } catch (err) {
      console.error(err);
      setMessage(
        "Impossible de placer le pari (solde interne insuffisant, match terminé ou erreur)."
      );
    }
  };

  // Fixer résultat (proprio)
  const handleFixerResultat = async (e) => {
    e.preventDefault();
    if (!contract || !matchIdRes) return;
    try {
      setMessage("Clôture du match et distribution des gains...");
      const tx = await contract.fixerResultat(
        Number(matchIdRes),
        Number(resultatRes)
      );
      await tx.wait();
      setMatchIdRes("");
      setMessage("Résultat fixé et gains distribués ");
      await updateUI(contract);
    } catch (err) {
      console.error(err);
      setMessage(
        "Échec lors de la fixation du résultat. Seul le propriétaire peut le faire."
      );
    }
  };

  useEffect(() => {
    if (window.ethereum && !account) {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatResultat = (m) => {
    if (!m.termine) return "En cours";
    if (m.resultat === 0) return `${m.equipe1} a gagné`;
    if (m.resultat === 1) return `${m.equipe2} a gagné`;
    return "Match nul";
  };

  const badgeForMatch = (m) => {
    const totalMises =
      Number(m.mises1) + Number(m.mises2) + Number(m.misesEgalite);
    if (!m.termine && totalMises === 0)
      return { className: "badge-empty", label: "Nouveau match" };
    if (!m.termine)
      return { className: "badge-live", label: "Ouvert aux paris" };
    return { className: "badge-finished", label: "Terminé" };
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-title-row">
          <div className="app-title">
            <div className="app-title-emoji">
              <i className="bi bi-trophy-fill"></i>
            </div>
            <div className="app-title-text">
              <h1>Paris Sportifs Web3</h1>
              <p>
                Dépose de l’ETH, parie sur tes matchs et laisse le smart
                contract gérer les gains. Transparent, automatique, on-chain.
              </p>
            </div>
          </div>

          <div>
            <div className="wallet-status">
              <span
                className={
                  "wallet-dot " + (account ? "connected" : "")
                }
              ></span>
              <i className="bi bi-wallet2"></i>
              {account ? (
                <span>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              ) : (
                <span>Wallet non connecté</span>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "0.4rem" }}>
          {!account && (
            <button className="btn" onClick={connectWallet}>
              <i className="bi bi-plug"></i> Connecter MetaMask
            </button>
          )}
        </div>
      </header>

      {message && (
        <div className="app-message">
          <i className="bi bi-info-circle"></i> {message}
        </div>
      )}

      {/* Grille principale */}
      <div className="app-grid">
        {/* Colonne gauche : bankroll + paris */}
        <div>
          {/* Bankroll */}
          <section className="card">
            <div className="card-bankroll-header">
              <div>
                <h2>
                  <i className="bi bi-cash-coin" style={{ marginRight: 6 }}></i>
                  Ta bankroll
                </h2>
                <p className="helper">
                  Solde disponible <strong>dans le contrat</strong> (et non sur
                  ton wallet MetaMask). Utilisé pour placer les paris.
                </p>
              </div>
              <div className="amount-highlight">
                <span>
                  <i className="bi bi-coin" style={{ marginRight: 4 }}></i>
                  {formatETH(solde)}
                </span>{" "}
                ETH
                <div className="small text-muted">Solde interne</div>
              </div>
            </div>

            <div className="card-split">
              {/* Dépôt */}
              <form onSubmit={handleDeposit}>
                <p className="small text-muted">
                  <i className="bi bi-box-arrow-in-down" /> Depuis ton wallet →
                  vers la DApp
                </p>
                <div className="field">
                  <label>Montant à déposer (ETH)</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="input"
                    placeholder="0.05"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn"
                  disabled={!account || !depositAmount}
                >
                  <i className="bi bi-arrow-down-circle"></i> Déposer
                </button>
              </form>

              {/* Retrait */}
              <form onSubmit={handleWithdraw}>
                <p className="small text-muted">
                  <i className="bi bi-box-arrow-up" /> Depuis la DApp → vers ton
                  wallet
                </p>
                <div className="field">
                  <label>Montant à retirer (ETH)</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="input"
                    placeholder="0.05"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-outline"
                  disabled={!account || !withdrawAmount}
                >
                  <i className="bi bi-arrow-up-circle"></i> Retirer
                </button>
              </form>
            </div>
          </section>

          {/* Placer un pari */}
          <section className="card" style={{ marginTop: "1.2rem" }}>
            <h2>
              <i className="bi bi-dice-5" style={{ marginRight: 6 }}></i>
              Placer un pari
            </h2>
            <p className="helper">
              Renseigne l’ID du match, ton pronostic et le montant à miser depuis
              ta bankroll.
            </p>

            <form onSubmit={handleParier}>
              <div className="form-row">
                <div className="field" style={{ flex: 1, minWidth: 110 }}>
                  <label>ID du match</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="1"
                    value={matchIdBet}
                    onChange={(e) => setMatchIdBet(e.target.value)}
                  />
                </div>

                <div className="field" style={{ flex: 1, minWidth: 150 }}>
                  <label>Ton pronostic</label>
                  <select
                    className="select"
                    value={choixBet}
                    onChange={(e) => setChoixBet(e.target.value)}
                  >
                    <option value="0">Victoire équipe 1</option>
                    <option value="1">Victoire équipe 2</option>
                    <option value="2">Match nul</option>
                  </select>
                </div>

                <div className="field" style={{ flex: 1, minWidth: 150 }}>
                  <label>Montant (ETH)</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="input"
                    placeholder="0.02"
                    value={montantBet}
                    onChange={(e) => setMontantBet(e.target.value)}
                  />
                </div>
              </div>

              {/* Potential Winnings Display */}
              {potentialWinning !== "0" && montantBet && (
                <div style={{ 
                  padding: "12px", 
                  background: "#f0f9ff", 
                  border: "1px solid #0ea5e9", 
                  borderRadius: "6px", 
                  margin: "12px 0",
                  textAlign: "center" 
                }}>
                  <div style={{ fontSize: "14px", color: "#0369a1" }}>
                    💰 Gain potentiel si tu gagnes
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#0c4a6e" }}>
                    {Number(potentialWinning).toFixed(4)} ETH
                  </div>
                  <div style={{ fontSize: "12px", color: "#0369a1" }}>
                    Mise: {montantBet} ETH → Gain: {Number(potentialWinning).toFixed(4)} ETH
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn"
                disabled={!account || !matchIdBet || !montantBet}
              >
                <i className="bi bi-check2-circle"></i> Valider mon pari
              </button>
            </form>
          </section>
        </div>

        {/* Colonne droite : matchs + admin */}
        <div>
          {/* Liste des matchs */}
          <section className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.6rem",
                alignItems: "center",
              }}
            >
              <div>
                <h2>
                  <i
                    className="bi bi-collection-play-fill"
                    style={{ marginRight: 6 }}
                  ></i>
                  Matchs
                </h2>
                <p className="helper">
                  Vue rapide de tous les matchs : statut, équipes et volume de
                  mises.
                </p>
              </div>
              <button
                type="button"
                className="btn-outline"
                onClick={() => contract && updateUI(contract)}
              >
                <i className="bi bi-arrow-clockwise"></i> Actualiser
              </button>
            </div>

            {matchs.length === 0 ? (
              <p className="small text-muted">
                <i className="bi bi-hourglass-split"></i> Aucun match enregistré
                pour le moment.
              </p>
            ) : (
              <div className="matches-list">
                {matchs.map((m) => {
                  const badge = badgeForMatch(m);
                  const odds = matchOdds[m.id] || { odds: ["1.00", "1.00", "1.00"], probas: ["33.3", "33.3", "33.3"] };
                  return (
                    <div key={m.id} className="match-card">
                      <div className="match-top">
                        <div>
                          <div className="match-label">
                            <i className="bi bi-hash"></i> Match #{m.id}
                          </div>
                          <div className="match-teams">
                            <strong>{m.equipe1}</strong> vs{" "}
                            <strong>{m.equipe2}</strong>
                          </div>
                        </div>
                        <div className={`badge ${badge.className}`}>
                          {badge.label}
                        </div>
                      </div>

                      {/* Odds Display */}
                      {!m.termine && (
                        <div style={{ 
                          display: "grid", 
                          gridTemplateColumns: "1fr 1fr 1fr", 
                          gap: "8px", 
                          margin: "12px 0",
                          padding: "8px",
                          background: "#f8f9fa",
                          borderRadius: "6px"
                        }}>
                          <div style={{ textAlign: "center", fontSize: "12px" }}>
                            <div style={{ fontWeight: "600", color: "#2563eb" }}>
                              {m.equipe1}
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                              {odds.odds[0]}
                            </div>
                            <div style={{ color: "#6b7280" }}>
                              {odds.probas[0]}%
                            </div>
                          </div>
                          <div style={{ textAlign: "center", fontSize: "12px" }}>
                            <div style={{ fontWeight: "600", color: "#dc2626" }}>
                              {m.equipe2}
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                              {odds.odds[1]}
                            </div>
                            <div style={{ color: "#6b7280" }}>
                              {odds.probas[1]}%
                            </div>
                          </div>
                          <div style={{ textAlign: "center", fontSize: "12px" }}>
                            <div style={{ fontWeight: "600", color: "#059669" }}>
                              Match Nul
                            </div>
                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                              {odds.odds[2]}
                            </div>
                            <div style={{ color: "#6b7280" }}>
                              {odds.probas[2]}%
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="match-status">
                        Résultat : {formatResultat(m)}
                        <br />
                        <span className="small text-muted">
                          <i
                            className="bi bi-graph-up-arrow"
                            style={{ marginRight: 4 }}
                          ></i>
                          Mises – {m.equipe1}: {formatETH(m.mises1)} ETH, {m.equipe2}:{" "}
                          {formatETH(m.mises2)} ETH, Nul: {formatETH(m.misesEgalite)} ETH
                        </span>
                      </div>

                      {/* Add Fake Bets Button */}
                      {!m.termine && (
                        <div style={{ marginTop: "8px" }}>
                          <button
                            type="button"
                            className="btn-outline"
                            style={{ fontSize: "12px", padding: "4px 8px" }}
                            onClick={() => handleSimulerParis(m.id)}
                          >
                            <i className="bi bi-plus-circle"></i> Ajouter paris automatiques
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Admin : créer match + fixer résultat */}
          <section className="card" style={{ marginTop: "1.2rem" }}>
            <h2>
              <i
                className="bi bi-gear-wide-connected"
                style={{ marginRight: 6 }}
              ></i>
              Espace organisateur
            </h2>
            <p className="helper">
              Réservé au propriétaire du contrat : création de rencontres et
              fixation des résultats pour distribuer les gains.
            </p>

            <div className="card-split">
              {/* Créer match */}
              <form onSubmit={handleCreerMatch}>
                <div className="field">
                  <label>
                    <i className="bi bi-1-circle" /> Équipe 1
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="PSG"
                    value={equipe1}
                    onChange={(e) => setEquipe1(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>
                    <i className="bi bi-2-circle" /> Équipe 2
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Real Madrid"
                    value={equipe2}
                    onChange={(e) => setEquipe2(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="submit"
                    className="btn-outline"
                    disabled={!account || !equipe1 || !equipe2}
                    style={{ flex: 1 }}
                  >
                    <i className="bi bi-plus-circle"></i> Créer match simple
                  </button>
                  <button
                    type="button"
                    className="btn"
                    disabled={!account || !equipe1 || !equipe2}
                    style={{ flex: 1 }}
                    onClick={handleCreerMatchAvecParis}
                  >
                    <i className="bi bi-stars"></i> Créer + Paris auto
                  </button>
                </div>
              </form>

              {/* Fixer résultat */}
              <form onSubmit={handleFixerResultat}>
                <div className="field">
                  <label>ID du match</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="1"
                    value={matchIdRes}
                    onChange={(e) => setMatchIdRes(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Résultat</label>
                  <select
                    className="select"
                    value={resultatRes}
                    onChange={(e) => setResultatRes(e.target.value)}
                  >
                    <option value="0">Victoire équipe 1</option>
                    <option value="1">Victoire équipe 2</option>
                    <option value="2">Match nul</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn-danger"
                  disabled={!account || !matchIdRes}
                >
                  <i className="bi bi-flag-fill"></i> Fixer résultat & distribuer
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>

      <footer className="app-footer">
        <i className="bi bi-blockquote-left"></i> Smart contract on-chain ·
        Expérimentation pédagogique Web3 · 2025
      </footer>
    </div>
  );
}

export default App;
