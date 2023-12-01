const hre = require("hardhat")
//const { ethers } = require("ethers")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "ConcertTicket"
  const SYMBOL = "TM"

  // Deploy contract
  const ConcertTicket = await ethers.getContractFactory("ConcertTicket")
  const concertTicket = await ConcertTicket.deploy(NAME, SYMBOL)
  await concertTicket.deployed()

  console.log(`Deployed ConcertTicket Contract at: ${concertTicket.address}\n`)

  // List 6 events
  const occasions = [
    {
      name: "UFC Miami",
      cost: tokens(0.001),
      tickets: 0,
      date: "May 31",
      time: "6:00PM EST",
      location: "Miami-Dade Arena - Miami, FL"
    },
    {
      name: "ETH Tokyo",
      cost: tokens(0.001),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM JST",
      location: "Tokyo, Japan"
    },
    {
      name: "ETH Privacy Hackathon",
      cost: tokens(0.001),
      tickets: 200,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul"
    },
    {
      name: "Dallas Mavericks vs. San Antonio Spurs",
      cost: tokens(0.001),
      tickets: 0,
      date: "Jun 11",
      time: "2:30PM CST",
      location: "American Airlines Center - Dallas, TX"
    },
    {
      name: "ETH Global Toronto",
      cost: tokens(0.001),
      tickets: 125,
      date: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada"
    }
  ]

  for (var i = 0; i < 5; i++) {
    const transaction = await concertTicket.connect(deployer).list(
      occasions[i].name,
      occasions[i].cost,
      occasions[i].tickets,
      occasions[i].date,
      occasions[i].time,
      occasions[i].location,
    )

    await transaction.wait()

    console.log(`Listed Occasion ${i + 1}: ${occasions[i].name}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});