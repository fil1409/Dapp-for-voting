# Sistema di Votazione Blockchain

## Descrizione
Questo progetto implementa un sistema di votazione sicuro e trasparente basato su tecnologia blockchain. È progettato per garantire l'integrità e l'anonimato del voto, utilizzando un contratto intelligente scritto in Solidity e un'interfaccia frontend realizzata con React.

## Funzionalità principali
- **Aggiunta dei candidati**: Un amministratore può aggiungere nuovi candidati, specificando nome, età, partito e una foto.
- **Inizio e termine delle elezioni**: L'amministratore può iniziare e terminare le elezioni, specificando la durata.
- **Voto sicuro**: Ogni utente registrato può esprimere un voto. Sono presenti controlli per prevenire voti duplicati.
- **Visualizzazione dei risultati**: Alla fine delle elezioni, i risultati sono visibili in ordine decrescente di voti ricevuti.

## Tecnologie utilizzate
- **Frontend**: React.js
- **Backend**: Solidity (contratto intelligente)
- **Blockchain**: Ethereum con MetaMask per la gestione delle transazioni
- **Librerie aggiuntive**: 
  - Web3.js per l'interazione con la blockchain.
  - SweetAlert2 per notifiche visive.

## Requisiti
- Node.js (versione >= 14)
- MetaMask installato nel browser
- Ganache o una rete Ethereum locale (se si usa Metamask è possibile generarla direttamente da lì)

## Configurazione del progetto

### 1. Clona la repository
  git clone https://github.com/fil1409/Dapp-for-voting.git

  cd Dapp-for-voting
### 2. Installa le dipendenze
  npm install
### 3. Configura il contratto
1)  Distribuisci il contratto Solidity:
    -  Apri il file Voting.sol nella directory contracts/.
    -  Utilizza un framework come Hardhat o Truffle per distribuire il contratto su una rete Ethereum locale o Testnet.
    -  Dopo la distribuzione, copia l'indirizzo del contratto distribuito.
2)  Aggiorna la configurazione frontend:
    -  Vai al file src/contracts/Voting.json.
    -  Sostituisci il valore address del contratto con l'indirizzo del contratto distribuito.
### 4. Avvia l'applicazione
  Utilizzando un altro terminale usare il segeunte comando per avviare l'applicazione:
  -  npm start
     
  L'app sarà disponibile su http://localhost:3000.

### Utilizzo
1)  Aggiungere un candidato
    -  L'amministratore può aggiungere candidati dalla sezione "Aggiungi Candidato".
    -  Inserire i dati richiesti (nome, età, partito) e caricare una foto.
    -  Cliccare su "Aggiungi Candidato".
2)  Avviare le elezioni
    -  Specificare la durata delle elezioni in minuti.
    -  Cliccare su "Inizia Elezioni". Lo stato cambierà in "In corso".
3)  Votare
    -  Connetti MetaMask e accedi con un account.
    -  Nella sezione "Candidati", clicca su "Vota" accanto al candidato scelto.
4)  Terminare le elezioni
    -  Quando il tempo è scaduto, l'amministratore può cliccare su "Termina Elezioni".
    -  I risultati saranno visibili nella sezione "Risultati delle Elezioni".

# Blockchain Voting System

## Description
This project implements a secure and transparent voting system based on blockchain technology. It is designed to ensure the integrity and anonymity of the vote using a smart contract written in Solidity and a frontend interface built with React.

## Key Features
- **Add Candidates**: An administrator can add new candidates by specifying their name, age, party, and a photo.
- **Start and End Elections**: The administrator can start and end elections, specifying the duration.
- **Secure Voting**: Each registered user can cast one vote. Controls are in place to prevent duplicate voting.
- **View Results**: At the end of the elections, the results are displayed in descending order of votes received.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Solidity (smart contract)
- **Blockchain**: Ethereum with MetaMask for transaction management
- **Additional Libraries**:
  - Web3.js for interacting with the blockchain.
  - SweetAlert2 for visual notifications.

## Requirements
- Node.js (version >= 14)
- MetaMask installed in the browser
- Ganache or a local Ethereum network (or Testnet, configurable through MetaMask)

## Project Setup

### 1. Clone the repository
git clone https://github.com/fil1409/Dapp-for-voting.git

cd Dapp-for-voting

### 2. Install dependencies
npm install
### 3. Configure the contract
1)  Deploy the Solidity contract:
    -  Open the Voting.sol file in the contracts/ directory.
    -  Use a framework like Hardhat or Truffle to deploy the contract on a local Ethereum network or a Testnet.
    -  After deployment, copy the address of the deployed contract.
2)  Update the frontend configuration:
    -  Navigate to the src/contracts/Voting.json file.
    -  Replace the address field with the address of the deployed contract.
### 4. Start the application
Open another terminal and run the following command to start the application:
-  npm start

The app will be available at http://localhost:3000.

### Usage
1)  Add a Candidate
    -  The administrator can add candidates from the "Add Candidate" section.
    -  Enter the required details (name, age, party) and upload a photo.
    -  Click "Add Candidate".
2)  Start the Elections
    -  Specify the election duration in minutes.
    -  Click "Start Elections". The status will change to "In Progress".
3)  Vote
    -  Connect MetaMask and log in with an account.
    -  In the "Candidates" section, click "Vote" next to your chosen candidate.
4)  End the Elections
    -  When the time is up, the administrator can click "End Elections".
    -  The results will be displayed in the "Election Results" section.
