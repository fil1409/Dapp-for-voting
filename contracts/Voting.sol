// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner;
    mapping(address => bool) public isAdmin;
    mapping(address => bool) public hasVoted;
    uint256 public electionStartTime;
    uint256 public electionDuration;
    bool public isElectionActive;
    bool public hasElectionEnded;

    struct Candidate {
        uint256 id;
        string name;
        uint256 age;
        string party;
        string imageUrl;
        uint256 voteCount;
        bool isActive;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;

    event AdminAdded(address indexed newAdmin);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event CandidateDeactivated(uint256 indexed candidateId);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event ElectionStarted(uint256 startTime, uint256 duration);
    event ElectionEnded(uint256 endTime);

    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;

        // Predefined admin address
        address predefinedAdmin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        isAdmin[predefinedAdmin] = true;
        emit AdminAdded(predefinedAdmin);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo il proprietario e' autorizzato a eseguire questa azione");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Solo gli admin possono eseguire questa azione");
        _;
    }

    modifier electionNotStarted() {
        require(!isElectionActive && !hasElectionEnded, "Le elezioni sono gia' iniziate o terminate");
        _;
    }

    modifier duringElection() {
        require(isElectionActive, "Le elezioni non sono attive");
        require(block.timestamp < electionStartTime + electionDuration, "Le elezioni sono terminate");
        _;
    }

    function startElection(uint256 _durationInMinutes) public onlyAdmin electionNotStarted {
        require(_durationInMinutes > 0, "La durata deve essere maggiore di zero");
        
        electionStartTime = block.timestamp;
        electionDuration = _durationInMinutes * 1 minutes;
        isElectionActive = true;
        
        emit ElectionStarted(electionStartTime, electionDuration);
    }

    function endElection() public {
        require(isElectionActive, "Le elezioni non sono attive");
        require(block.timestamp >= electionStartTime + electionDuration, "Le elezioni non sono ancora terminate");
        
        isElectionActive = false;
        hasElectionEnded = true;
        
        emit ElectionEnded(block.timestamp);
    }

    function getElectionStatus() public view returns (string memory) {
        if (!isElectionActive && !hasElectionEnded) {
            return "Non iniziate";
        } else if (isElectionActive && block.timestamp < electionStartTime + electionDuration) {
            return "In corso";
        } else {
            return "Terminate";
        }
    }

    function getRemainingTime() public view returns (uint256) {
        if (!isElectionActive || hasElectionEnded) {
            return 0;
        }
        uint256 endTime = electionStartTime + electionDuration;
        if (block.timestamp >= endTime) {
            return 0;
        }
        return endTime - block.timestamp;
    }

    function addAdmin(address _newAdmin) public onlyOwner {
        require(_newAdmin != address(0), "L'indirizzo non puo' essere zero");
        isAdmin[_newAdmin] = true;
        emit AdminAdded(_newAdmin);
    }

    function addCandidate(string memory _name, uint256 _age, string memory _party, string memory _imageUrl) 
    public onlyAdmin electionNotStarted {
        require(bytes(_name).length > 0, "Devi inserire il nome e il cognome del condidato.");
        require(_age >= 18, "Il candidato deve avere almeno 18 anni.");
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _age, _party, _imageUrl, 0, true);
        emit CandidateAdded(candidatesCount, _name);
    }

    function deactivateCandidate(uint256 _candidateId) public onlyAdmin electionNotStarted {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Candidato non valido");
        require(candidates[_candidateId].isActive, "Candidato precedentemente disattivato");

        candidates[_candidateId].isActive = false;
        emit CandidateDeactivated(_candidateId);
    }

    function vote(uint256 _candidateId) public duringElection {
        require(!hasVoted[msg.sender], "Hai gia' votato");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Candidato non valido");
        require(candidates[_candidateId].isActive, "Questo candidato non e' attivo");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit Voted(msg.sender, _candidateId);
    }

    function getCandidateVotes(uint256 _candidateId) public view returns (uint256) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Candidato non valido");
        return candidates[_candidateId].voteCount;
    }

    function isAddressAdmin(address _address) public view returns (bool) {
        return isAdmin[_address];
    }
}