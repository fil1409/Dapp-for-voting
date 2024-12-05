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
  git clone https://github.com/<username>/voting-system-blockchain.git \n
  cd voting-system-blockchain
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

Utilizzo
1)  Aggiungere un candidato
-  L'amministratore può aggiungere candidati dalla sezione "Aggiungi Candidato".
-  Inserire i dati richiesti (nome, età, partito) e caricare una foto.
-  Cliccare su "Aggiungi Candidato".
2)  Avviare le elezioni
-  Specificare la durata delle elezioni in minuti.
-   Cliccare su "Inizia Elezioni". Lo stato cambierà in "In corso".
3)  Votare
-  Connetti MetaMask e accedi con un account.
-  Nella sezione "Candidati", clicca su "Vota" accanto al candidato scelto.
4)  Terminare le elezioni
-  Quando il tempo è scaduto, l'amministratore può cliccare su "Termina Elezioni".
-  I risultati saranno visibili nella sezione "Risultati delle Elezioni".

