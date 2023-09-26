/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle")

const ALCHEMY_API_KEY  = "NxN4aciXrudTZwSJd2Jhaese2fnQDbXX";
const MATIC_PRIVATE_KEY = "a6ab0953025fd5077e5d67f5ea66497cdfd383f61e0daf9f18d03cc64de0361c";
module.exports = {
  solidity: "0.8.19",

  networks:{
    Sepolia :{
      url:`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}` ,
      accounts:[`${MATIC_PRIVATE_KEY}`],
    }
  }
};
