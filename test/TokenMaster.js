const { expect } = require("chai")
const { ethers } = require("hardhat")

const NAME = "TokenMaster"
const SYMBOL = "TM"

const OCCASION_NAME = "ETH Texas"
const OCCASION_COST = ethers.utils.parseUnits('1', 'ether')
const OCCASION_MAX_TICKETS = 100
const OCCASION_DATE = "Apr 27"
const OCCASION_TIME = "10:00AM CST"
const OCCASION_LOCATION = "Austin, Texas"

describe("TokenMaster", () => {
  let tokenMaster
  let deployer, buyer

  beforeEach(async () => {
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners()

    // Deploy contract
    const TokenMaster = await ethers.getContractFactory("TokenMaster")
    tokenMaster = await TokenMaster.deploy(NAME, SYMBOL)

    const transaction = await tokenMaster.connect(deployer).list(
      OCCASION_NAME,
      OCCASION_COST,
      OCCASION_MAX_TICKETS,
      OCCASION_DATE,
      OCCASION_TIME,
      OCCASION_LOCATION
    )

    await transaction.wait()
  })

  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await tokenMaster.name()).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      expect(await tokenMaster.symbol()).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      expect(await tokenMaster.owner()).to.equal(deployer.address)
    })
  })

  describe("Occasions", () => {
    it('Returns occasions attributes', async () => {
      const occasion = await tokenMaster.getOccasion(1)
      expect(occasion.id).to.be.equal(1)
      expect(occasion.name).to.be.equal(OCCASION_NAME)
      expect(occasion.cost).to.be.equal(OCCASION_COST)
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS)
      expect(occasion.date).to.be.equal(OCCASION_DATE)
      expect(occasion.time).to.be.equal(OCCASION_TIME)
      expect(occasion.location).to.be.equal(OCCASION_LOCATION)
    })

    it('Updates occasions count', async () => {
      const totalOccasions = await tokenMaster.totalOccasions()
      expect(totalOccasions).to.be.equal(1)
    })
  })

  describe("Minting", () => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits('1', 'ether')

    beforeEach(async () => {
      const transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
      await transaction.wait()
    })

    it('Updates ticket count', async () => {
      const occasion = await tokenMaster.getOccasion(1)
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS - 1)
    })

    it('Updates buying status', async () => {
      const status = await tokenMaster.hasBought(ID, buyer.address)
      expect(status).to.be.equal(true)
    })

    it('Updates seat status', async () => {
      const owner = await tokenMaster.seatTaken(ID, SEAT)
      expect(owner).to.equal(buyer.address)
    })

    it('Updates overall seating status', async () => {
      const seats = await tokenMaster.getSeatsTaken(ID)
      expect(seats.length).to.equal(1)
      expect(seats[0]).to.equal(SEAT)
    })

    it('Updates the contract balance', async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address)
      expect(balance).to.be.equal(AMOUNT)
    })
  })

  describe("Withdrawing", () => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.utils.parseUnits("1", 'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await tokenMaster.connect(buyer).mint(ID, SEAT, { value: AMOUNT })
      await transaction.wait()

      transaction = await tokenMaster.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const balance = await ethers.provider.getBalance(tokenMaster.address)
      expect(balance).to.equal(0)
    })
  })

  describe('TokenMaster', function() {
    it('should return a list of purchased tickets for a user', async function() {
      const TokenMaster = await ethers.getContractFactory('TokenMaster');
      const tokenMaster = await TokenMaster.deploy('TokenMaster', 'TKM');
      await tokenMaster.deployed();

      const accounts = await ethers.getSigners();
      const owner = accounts[0];
      const user1 = accounts[1];
      const user2 = accounts[2];

      // Create an occasion and sell two tickets to user1
      await tokenMaster.connect(owner).list('Occasion 1', 100, 2, '2023-12-01', '20:00:00', 'Venue 1');
      await tokenMaster.connect(user1).mint(1, 1, { value: 100 }).then(tx => tx.wait());
      await tokenMaster.connect(user1).mint(1, 2, { value: 100 }).then(tx => tx.wait());

      // Create another occasion and sell one ticket to user2
      await tokenMaster.connect(owner).list('Occasion 2', 200, 3, '2023-12-15', '21:00:00', 'Venue 2');
      await tokenMaster.connect(user2).mint(2, 1, { value: 200 }).then(tx => tx.wait());

      // Get purchased tickets for user1
      const purchasedTicketsForUser1 = await tokenMaster.getPurchasedTickets(user1.address);
      expect(purchasedTicketsForUser1.length).to.equal(1);

      // Get purchased tickets for user2
      const purchasedTicketsForUser2 = await tokenMaster.getPurchasedTickets(user2.address);
      expect(purchasedTicketsForUser2.length).to.equal(1);

    //console.log("Purchased Tickets for User1:", purchasedTicketsForUser1);
    //console.log("hasBought for Occasion 1, User1:", hasBought[1][user1.address]);
    console.log("Occasion 1 after minting:", await tokenMaster.getOccasion(1), '\n');
    console.log("Occasion 2 after minting:", await tokenMaster.getOccasion(2));
    //console.log("Seats taken for Occasion 1:", await tokenMaster.getSeatsTaken(1));
    });
  });

})