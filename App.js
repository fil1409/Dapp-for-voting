import React, { useState, useEffect, useRef} from 'react';
import { AlertCircle, CheckCircle2, Timer, UserPlus, Vote, Award } from 'lucide-react';
import Web3 from 'web3';
import VotingContract from './contracts/Voting.json';
import './App.css';
import Swal from 'sweetalert2'

const MainPage = () => {
  const fileInputRef = useRef(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [electionStatus, setElectionStatus] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [electionDuration, setElectionDuration] = useState('');
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    age: '',
    party: '',
    imageUrl: ''
    });

  const adminAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
  let contract;

  useEffect(() => {
    checkMetaMaskInstallation();
    const fetchInitialData = async () => {
      await updateElectionStatus();
    };
    fetchInitialData();

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);

  const checkMetaMaskInstallation = () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMaskInstalled(true);
    }
  };

  const connectWallet = async () => {
    if (isMetaMaskInstalled) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        checkAdminStatus(accounts[0]);
        getCandidates();

        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0]);
          setIsConnected(newAccounts.length > 0);
          checkAdminStatus(newAccounts[0]);
        });
      } catch (error) {
        console.error('Errore durante la connessione al wallet:', error);
      }
    }
  };

  const checkAdminStatus = (address) => {
    setIsAdmin(address.toLowerCase() === adminAddress.toLowerCase());
  };
  
  
  const initContract = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const networkId = Number(await web3.eth.net.getId());
      const deployedNetwork = VotingContract.networks[networkId];
      const latestBlock = Number(await web3.eth.getBlockNumber());
      console.log('Numero del blocco più recente:', latestBlock);
      if (deployedNetwork) {
        contract = new web3.eth.Contract(VotingContract.abi, deployedNetwork.voting.address);
      } else {
        console.error('Contratto non trovato sulla rete corrente:', networkId);
        await Swal.fire({
          text: "Il contratto non è stato trovato sulla rete corrente. Assicurati di averlo distribuito sulla rete giusta.",
          icon: 'warning',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#d33'
        })
        
      }
    }
  };

  const updateElectionStatus = async () => {
    try {
      await initContract();
      if (contract) {
        const status = await contract.methods.getElectionStatus().call();
        const timeRemaining = await contract.methods.getRemainingTime().call();
        setElectionStatus(status);
        setRemainingTime(Number(timeRemaining));
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento dello stato delle elezioni:', error);
    }
  };

  const startElection = async () => {
    try {
      await initContract();
      if (!contract || !electionDuration) return;

      await contract.methods.startElection(electionDuration)
        .send({ from: account });
      await Swal.fire({
        icon: 'success',
        text: `Elezioni iniziate con successo!`,
         confirmButtonText: 'Ok',
        confirmButtonColor: '#28a745'
      });
      updateElectionStatus();
    } catch (error) {
      console.error('Errore nell\'avvio delle elezioni:', error);
      await Swal.fire({
        text: "Errore nell\'avvio delle elezioni",
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#d33'
      })
      
    }
  };

  const endElection = async () => {
    try {
      await initContract();
      if (!contract) return;

      await contract.methods.endElection()
        .send({ from: account });
      await Swal.fire({
        icon: 'success',
        text: `Elezioni terminate con successo!`,
         confirmButtonText: 'Ok',
        confirmButtonColor: '#28a745'
      });
      updateElectionStatus();
    } catch (error) {
      console.error('Errore nella chiusura delle elezioni:', error);
      await Swal.fire({
        text: "Errore nella chiusura delle elezioni",
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#d33'
      })
    }
  };

  const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCandidates = async () => {
    try {
      await initContract();
  
      const candidatesCount = await contract.methods.candidatesCount().call();
      const candidatesList = [];
  
      for (let i = 1; i <= candidatesCount; i++) {
        const candidateData = await contract.methods.candidates(i).call();
        if (candidateData.isActive) { 
        candidatesList.push({
          id: i,
          name: candidateData.name, 
          age: Number(candidateData.age),
          party: candidateData.party,
          imageUrl: candidateData.imageUrl,
          voteCount: Number(candidateData.voteCount),
          isActive: candidateData.isActive,
        });
      }
    }
      setCandidates(candidatesList);
    } catch (error) {
      console.error('Errore durante il recupero dei candidati:', error);
    }
  };

  const addCandidate = async () => {
    if (isAdmin && newCandidate.name) {
      if (Number(newCandidate.age) < 18) {
        await Swal.fire({
            icon: 'error',
            text: 'Età non valida perché minore di 18 anni',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#d33'
        });
        return;
      }
      try {
        await initContract();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const result = await contract.methods.addCandidate(
          newCandidate.name,
          newCandidate.age,
          newCandidate.party,
          newCandidate.imageUrl,
          newCandidate.isActive = true
        ).send({ from: account});
  
        console.log("Transazione completata:", result);
        await Swal.fire({
          icon: 'success',
          text: `Candidato ${newCandidate.name} aggiunto con successo`,
           confirmButtonText: 'Ok',
          confirmButtonColor: '#28a745'
        });
        setNewCandidate({ name: '', age: '', party: '', imageUrl: '', isActive: true});
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
      }
        getCandidates();
      } catch (error) {
        console.error('Errore dettagliato durante l\'aggiunta del candidato:', error);
      }
    }
  };

  const deactivateCandidate = async (candidateId) => {
    try {
      await initContract();
      await contract.methods.deactivateCandidate(candidateId).send({ from: account });
      await Swal.fire({
        icon: 'success',
        text: `Candidato disattivato con successo`,
         confirmButtonText: 'Ok',
        confirmButtonColor: '#28a745'
      });
      getCandidates();
    } catch (error) {
      console.error('Errore durante la disattivazione del candidato:', error);
    }
  };

  const checkVotingStatus = async (account) => {
    if (!contract || !account) return false;
    try {
        const hasVoted = await contract.methods.hasVoted(account).call();
        return hasVoted;
    } catch (error) {
        console.error('Errore nel controllo dello stato del voto:', error);
        return false;
    }
};

const vote = async (candidateId) => {
  await initContract();

  if (!contract || !account) {
      console.error('Contratto o account non inizializzati');
      return;
  }

  const hasAlreadyVoted = await checkVotingStatus(account);
  if (hasAlreadyVoted) {
      await Swal.fire({
        text: "Non puoi votare: hai già espresso il tuo voto!",
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#d33'
      })
      return;
  }

    try {
        await contract.methods.vote(candidateId).send({ from: account});
        await Swal.fire({
          icon: 'success',
          text: `Voto registrato con successo`,
           confirmButtonText: 'Ok',
          confirmButtonColor: '#28a745'
        });
        getCandidates();
    } catch (error) {
    console.error('Dettagli dell\'errore:', error);
}
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          setNewCandidate(prevState => ({
              ...prevState,
              imageUrl: reader.result // Aggiorna solo imageUrl
          }));
          console.log("URL immagine caricata:", reader.result); // Debug
      };
      reader.readAsDataURL(file);
  }
};

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
    <div className="container">
      {!isMetaMaskInstalled ? (
        <div className="h-screen flex flex-col items-center justify-center -mt-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Sistema di Votazione Blockchain</h1>
          <p className="text-gray-600 mb-8">Vota in modo sicuro e trasparente</p>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-700 mb-4">MetaMask non è installato. Per favore installalo per procedere.</p>
            <a 
              href="https://metamask.io/download.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200"
            >
              Installa MetaMask
            </a>
          </div>
        </div>
      ) : !isConnected ? (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">Sistema di Votazione Blockchain</h1>
            <h2 className="centered1-container">Vota in modo sicuro e trasparente</h2>
            <div className="centered-container">
              <button 
                onClick={connectWallet}
                className="bg-indigo-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-3 w-full"
              >
                <CheckCircle2 className="w-5 h-5" />
                Connetti con MetaMask
              </button>
            </div>
          </div>
        ) : (
        <div className="space-y-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Sistema di Votazione Blockchain</h1>
          </div>
          
          {/* Account Info & Election Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Account connesso: {account} </p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  electionStatus === "In corso" ? "bg-green-500" :
                  electionStatus === "Terminate" ? "bg-red-500" : "bg-yellow-500"
                }`} />
                <span className="text-sm text-gray-700">Stato delle elezioni: {electionStatus}</span>
              </div>
            </div>

            {remainingTime > 0 && (
              <div className="mt-4 flex items-center gap-2 text-blue-600">
                <Timer className="w-5 h-5" />
                <span>Tempo rimanente: {formatRemainingTime(remainingTime)}</span>
              </div>
            )}

{isAdmin && electionStatus === "Non iniziate" && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <p>
                  <input
                    type="number"
                    value={electionDuration}
                    onChange={(e) => setElectionDuration(e.target.value)}
                    className="flex-1 min-w-[200px] border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Durata in minuti"
                  /></p>
                  <button
                    onClick={startElection}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <Timer className="w-5 h-5" />
                    Inizia Elezioni
                  </button>
                </div>
              )}

              {isAdmin && electionStatus === "In corso" && remainingTime === 0 && (
                <button
                  onClick={endElection}
                  className="mt-4 bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-all duration-200 flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Termina Elezioni
                </button>
              )}
            </div>


          {/* Grid Layout for Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Candidates List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Vote className="w-6 h-6 text-indigo-500" />
                Candidati
              </h2>
              <div className="visualCandidati">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <img 
                        src={candidate.imageUrl} 
                        alt={`Foto di ${candidate.name}`} 
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">{candidate.name}</h3>
                        <div className="text-gray-600 space-y-1">
                          <p>Età: {candidate.age}</p>
                          <p>Partito: {candidate.party}</p>
                          {electionStatus === "Terminate" && (
                            <p className="font-semibold text-indigo-600">Voti: {candidate.voteCount}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        {isAdmin && electionStatus === "Non iniziate" && (
                          <button
                            onClick={() => deactivateCandidate(candidate.id)}
                            className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors duration-200"
                          >
                            Disattiva
                          </button>
                        )}
                        {electionStatus === "In corso" && (
                          <button
                            onClick={() => vote(candidate.id)}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
                          >
                            <Vote className="w-5 h-5" />
                            Vota
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Candidate Form & Results */}
            <div className="space-y-8">
              {isAdmin && electionStatus === "Non iniziate" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-emerald-500" />
                    Aggiungi Candidato
                  </h2>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      value={newCandidate.name}
                      onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Nome e cognome del candidato"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="number" 
                        value={newCandidate.age}
                        onChange={(e) => setNewCandidate({ ...newCandidate, age: e.target.value })}
                        className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Età"
                      />
                      <input 
                        type="text" 
                        value={newCandidate.party}
                        onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                        className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Nome del Partito"
                      />
                    </div>
                    <div className="space-y-2">
                    <label className="text-gray-700 block flex items-center">
                      Carica l'immagine del candidato: 

                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="ml-2 border rounded-lg text-gray-700"
                        style={{ width: 'auto', margin: 0 }}
                      />
                      </label>
                    </div>

                    <button 
                      onClick={addCandidate}
                      className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      Aggiungi Candidato
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  Risultati delle Elezioni
                </h2>
                {electionStatus === "Terminate" ? (
                  <div className="space-y-4">
                    {candidates
                      .sort((a, b) => b.voteCount - a.voteCount)
                      .map((candidate, index) => (
                        <div 
                          key={candidate.id} 
                          className={`p-4 rounded-lg ${
                            index === 0 ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {index === 0 && <Award className="w-5 h-5 text-amber-500" />}
                              <span className="font-semibold text-gray-800">{candidate.name}: {candidate.voteCount === 0 ? 'Nessun voto' : candidate.voteCount === 1 ? '1 voto' : `${candidate.voteCount} voti`}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">I risultati saranno disponibili al termine delle elezioni</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default MainPage;