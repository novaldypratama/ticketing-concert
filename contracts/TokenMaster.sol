// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    // event OccasionListed(uint256 indexed occasionId, string name, uint256 cost, uint256 maxTickets, string date, string time, string location);
    // event TicketMinted(uint256 indexed occasionId, address indexed buyer, uint256 seat);

    // ... (existing code)

    struct Transaction {
        uint256 occasionId;
        address buyer;
        uint256 seat;
    }

    Transaction[] public transactions;

    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    mapping(uint256 => Occasion) occasions;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;
    mapping(uint256 => uint256[]) seatsTaken;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );

        //emit OccasionListed(totalOccasions, _name, _cost, _maxTickets, _date, _time, _location);
    }

    function mint(uint256 _id, uint256 _seat) public payable {
        // Require that _id is not 0 or less than total occasions...
        require(_id != 0);
        require(_id <= totalOccasions);

        // Require that ETH sent is greater than cost...
        require(msg.value >= occasions[_id].cost);

        // Require that the seat is not taken, and the seat exists...
        require(seatTaken[_id][_seat] == address(0));
        require(_seat <= occasions[_id].maxTickets);

        occasions[_id].tickets -= 1; // <-- Update ticket count

        hasBought[_id][msg.sender] = true; // <-- Update buying status
        seatTaken[_id][_seat] = msg.sender; // <-- Assign seat

        seatsTaken[_id].push(_seat); // <-- Update seats currently taken
        transactions.push(
            Transaction({occasionId: _id, buyer: msg.sender, seat: _seat})
        );

        totalSupply++;

        _safeMint(msg.sender, totalSupply);
        //emit TicketMinted(_id, msg.sender, _seat);
    }

    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    function getTransactionsByBuyer(address buyer) public view returns (Transaction[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].buyer == buyer) {
                count++;
            }
        }

        Transaction[] memory buyerTransactions = new Transaction[](count);
        uint256 index = 0;
        for (uint i = 0; i < transactions.length; i++) {
            if (transactions[i].buyer == buyer) {
                buyerTransactions[index] = transactions[i];
                index++;
            }
        }

        return buyerTransactions;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
