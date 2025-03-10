process.env.NODE_CONFIG_ENV = "test";
// process.env.SOURCIFY_POSTGRES_HOST = "";
process.env.ALLIANCE_POSTGRES_HOST = "";

const chai = require("chai");
const chaiHttp = require("chai-http");
const Server = require("../../dist/server/server").Server;
const fs = require("fs");
const path = require("path");
const util = require("util");
const rimraf = require("rimraf");
const addContext = require("mochawesome/addContext");
const { assertVerification } = require("../helpers/assertions");
const testEtherscanContracts = require("../helpers/etherscanInstanceContracts.json");

const TEST_TIME = process.env.TEST_TIME || 30000; // 30 seconds
const CUSTOM_PORT = 5556;

// Extract the chainId from new chain support pull request, if exists
let newAddedChainIds = [];
if (process.env.NEW_CHAIN_ID) {
  newAddedChainIds = process.env.NEW_CHAIN_ID.split(",");
}
console.log("newAddedChainIds");
console.log(newAddedChainIds);

let anyTestsPass = false; // Fail when zero tests passing

chai.use(chaiHttp);

describe("Test Supported Chains", function () {
  console.log(`Set up tests timeout with ${Math.floor(TEST_TIME / 1000)} secs`);
  this.timeout(TEST_TIME);
  const server = new Server(CUSTOM_PORT);
  let currentResponse = null; // to log server response when test fails

  const testedChains = new Set(); // Track tested chains and make sure all "supported = true" chains are tested
  let supportedChains;
  before(async function () {
    const promisified = util.promisify(server.app.listen);
    await promisified(server.port);
    console.log(`Injector listening on port ${server.port}!`);

    chai
      .request(server.app)
      .get("/chains")
      .end((err, res) => {
        if (err !== null) {
          throw new Error("Cannot fetch supportedChains");
        }
        supportedChains = res.body.filter((chain) => chain.supported);
      });
  });

  beforeEach(() => {
    rimraf.sync(server.repository);
  });

  after(() => {
    rimraf.sync(server.repository);
    if (!anyTestsPass && newAddedChainIds.length) {
      throw new Error(
        "There needs to be at least one passing test. Did you forget to add a test for your new chain with the id(s) " +
          newAddedChainIds.join(",") +
          "?"
      );
    }
  });

  // log server response when test fails
  afterEach(function () {
    const errorBody = currentResponse && currentResponse.body;
    if (this.currentTest.state === "failed" && errorBody) {
      console.log(
        "Server response of failed test " + this.currentTest.title + ":"
      );
      console.log(errorBody);
    }
    currentResponse = null;
  });

  // Symplexia Smart Chain
  verifyContract(
    "0x968fd0BADc643B0A7b088f4b6aA2CE5FA65db622",
    "1149",
    "Symplexia Smart Chain",
    "shared/"
  );

  verifyContract(
    "0x801f3983c7baBF5E6ae192c84E1257844aDb4b4D",
    "1",
    "Ethereum Mainnet",
    "1"
  );

  // verifyContract(
  //   "0x1EFFEbE8B0bc20f2Dc504AA16dC76FF1AB2297A3",
  //   "4",
  //   "Rinkeby",
  //   "shared/"
  //
  // );

  verifyContract(
    "0xc24381dB2a5932B5D1c424f567A95F9966834cE0",
    "5",
    "Goerli",
    "shared/"
  );

  verifyContract(
    "0x7ecedB5ca848e695ee8aB33cce9Ad1E1fe7865F8",
    "17000",
    "Holesky",
    "shared/"
  );

  verifyContract(
    "0x8F78b9c92a68DdF719849a40702cFBfa4EB60dD0",
    "11155111",
    "Sepolia",
    "shared/"
  );

  verifyContract(
    "0x43C0A11653F57a96d1d3b6A5A6be453444558A5E",
    "369",
    "PulseChain",
    "shared/"
  );

  verifyContract(
    "0x7f185202a630F09e05b6C2b51618b4f6Af728c7B",
    "100",
    "xDai",
    "100"
  );

  // verifyContract(
  //   "0x2e4088DcA1aE2e098e322562ab1fEb83b3a303CD",
  //   "300",
  //   "Optimism on Gnosis",
  //   "shared/"
  //
  // );

  verifyContract(
    "0x8C3FA94eb5b07c9AF7dBFcC53ea3D2BF7FdF3617",
    "51",
    "XinFin Apothem Testnet",
    "shared/"
  );

  verifyContract(
    "0xED5405Ba038587c06979374f8a595F41F5841216",
    "56",
    "Binance Smart Chain Mainnet",
    "56/"
  );

  verifyContract(
    "0x8F78b9c92a68DdF719849a40702cFBfa4EB60dD0",
    "44787",
    "Celo Alfajores Testnet",
    "shared/"
  );

  verifyContract(
    "0xd46fd24ea21F04459407Fb0B518451e54d0b07a1",
    "97",
    "Binance Smart Chain Testnet",
    "shared/"
  );

  verifyContract(
    "0x9969150c2AA0140F5109Ae29A51FA109Fe1d1d9C",
    "137",
    "Polygon (Matic)",
    "137/"
  );

  verifyContract(
    "0x5D40b45C202531d040e0CCD51C48554109197cD3",
    "80001",
    "Polygon Mumbai Testnet",
    "shared/"
  );

  verifyContract(
    "0x03943C3ef00d92e130185CeBC0bcc435Def2cC94",
    "42220",
    "Celo Mainnet",
    "42220/"
  );

  verifyContract(
    "0xdd5FFA1DF887D5A42931a746BaAd62574501A5Aa",
    "62320",
    "Celo Baklava Testnet",
    "62320/"
  );

  verifyContract(
    "0x03943C3ef00d92e130185CeBC0bcc435Def2cC94",
    "43114",
    "Avalanche Mainnet",
    "42220/"
  );

  verifyContract(
    "0x35C671Ea8e4Fd1e922157D48EABD5ab6b8CC408E",
    "43113",
    "Avalanche Fuji Testnet",
    "shared/"
  );

  verifyContract(
    "0x8F78b9c92a68DdF719849a40702cFBfa4EB60dD0",
    "41",
    "Telos EVM Testnet",
    "shared/"
  );

  verifyContract(
    "0x059611daEdBA5Fe0875aC7c76d7cE47FfE5c39C5",
    "40",
    "Telos EVM Mainnet",
    "40/"
  );

  // verifyContract(
  //   "0x68107Fb54f5f29D8e0B3Ac44a99f4444D1F22a68",
  //   "77",
  //   "Sokol",
  //   "shared/"
  //
  // );

  verifyContract(
    "0x0e9b6C08Fe70Aac8fd08a74a076c2B1C9f7c7d14",
    "42161",
    "Arbitrum Mainnet",
    "42161/"
  );

  // verifyContract(
  //   "0xd46fd24ea21F04459407Fb0B518451e54d0b07a1",
  //   "421613",
  //   "Arbitrum Görli",
  //   "shared/"
  //
  // );

  verifyContract(
    "0xaBe8cf2Dacb0053C1ebd5881392BD17Ec2402a4F",
    "421614",
    "Arbitrum Sepolia",
    "shared/"
  );

  verifyContract(
    "0xA25b72DADEB96E166D1a225C61b54CA29C45EBD1",
    "8",
    "Ubiq",
    "8/"
  );

  // Oneledger
  verifyContract(
    "0x774081ECDDb30F96EB5Bb21DcAB17C73F29f5eF3",
    "311752642",
    "OneLedger Mainnet",
    "shared/"
  );

  // verifyContract(
  //   "0x34eC0cBd5E33e7323324333434fe978f1000d9cd",
  //   "4216137055",
  //   "OneLedger Frankenstein Testnet",
  //   ["4216137055/SigmaToken.sol"],
  //   "4216137055/SigmaToken.json"
  // );

  // Has contracts to be fetched from IPFS
  verifyContract(
    "0xB2d0641fc8863514B6533b129fD744200eE17D29",
    "57",
    "Syscoin Mainnet",
    "57/"
  );

  // Has contracts to be fetched from IPFS
  verifyContract(
    "0x68107Fb54f5f29D8e0B3Ac44a99f4444D1F22a68",
    "5700",
    "Syscoin Tanenbaum Testnet",
    "shared/"
  );

  // Rollux Mainnet
  verifyContract(
    "0x1187124eC74e2A2F420540C338186dD702cF6340",
    "570",
    "Rollux Mainnet",
    "shared/"
  );

  // Rollux Tanenbaum (testnet)
  verifyContract(
    "0x736bfcA6a599bF0C3D499F8a0bC5ab2bA2030AC6",
    "57000",
    "Rollux Tanenbaum",
    "shared/"
  );

  verifyContract(
    "0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe",
    "10",
    "Optimism Mainnet",
    "10/"
  );

  // verifyContract(
  //   "0xB5FAD02EbF6edffbdf206d2C1ad815bcDdb380f8",
  //   "420",
  //   "Optimism Goerli Testnet",
  //   "shared/"
  //
  // );

  verifyContract(
    "0xaBe8cf2Dacb0053C1ebd5881392BD17Ec2402a4F",
    "11155420",
    "Optimism Sepolia Testnet",
    "shared/"
  );

  verifyContract(
    "0x43f980475B9eb5D93A19dfA84511ECE7b330c226",
    "288",
    "Boba Network",
    "288/"
  );

  // verifyContract(
  //   "0x8F78b9c92a68DdF719849a40702cFBfa4EB60dD0",
  //   "28",
  //   "Boba Network Rinkeby Testnet",
  //   "shared/"
  //
  // );

  verifyContract(
    "0xd8A08AFf1B0585Cad0E173Ce0E93551Ac59D3530",
    "106",
    "Velas Mainnet",
    "106/"
  );

  verifyContract(
    "0x084c77e84853B960aEB0a0BD4Fc6689aC9c6d76E",
    "82",
    "Meter Mainnet",
    "82/"
  );

  verifyContract(
    "0x736D468Bc8F868a80A0F9C4Ca24dacf8a5A3a684",
    "83",
    "Meter Testnet",
    "shared/"
  );

  verifyContract(
    "0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB",
    "1313161554",
    "Aurora Mainnet",
    "1313161554/"
  );

  verifyContract(
    "0xd46fd24ea21F04459407Fb0B518451e54d0b07a1",
    "1313161555",
    "Aurora Testnet",
    "shared/"
  );

  verifyContract(
    "0x08BB0D7fCe37dD766d13DC19A00c95878ed2E68c",
    "1284",
    "Moonbeam",
    "1284/"
  );
  verifyContract(
    "0x460947bD434b4FF90Af62f3F389b39aab0d6A77D",
    "1285",
    "Moonriver",
    "1285/"
  );
  verifyContract(
    "0x08BB0D7fCe37dD766d13DC19A00c95878ed2E68c",
    "1287",
    "Moonbase",
    "1287/"
  );

  // // Candle
  // verifyContract(
  //   "0xaa80bC172F3275B837C0515d3d50AcC4EC0cC96b",
  //   "534",
  //   "Candle Mainnet",
  //   "shared/"
  //
  // );

  // Palm
  verifyContract(
    "0xd46fd24ea21F04459407Fb0B518451e54d0b07a1",
    "11297108109",
    "Palm Mainnet",
    "shared/"
  );

  // Palm Testnet
  verifyContract(
    "0x68107Fb54f5f29D8e0B3Ac44a99f4444D1F22a68",
    "11297108099",
    "Palm Testnet",
    "shared/"
  );

  // Fuse Mainnet
  verifyContract(
    "0xCaFC1F87E4cabD59fAB26d02D09207147Aae3F1E",
    "122",
    "Fuse Mainnet",
    "shared/"
  );

  // // Darwinia Pangolin Testnet
  // verifyContract(
  //   "0x7de04a7596958D44baB52F4e5D0c9e79cB16ef8B",
  //   "43",
  //   "Darwinia Pangolin Testnet",
  //   "shared/"
  //
  // );

  // Darwinia Crab Mainnet
  verifyContract(
    "0xE0E78187F01E026bdD0bd901e5Ae2e10C022366D",
    "44",
    "Darwinia Pangolin Testnet",
    "shared/"
  );

  // Evmos Testnet
  verifyContract(
    "0x07Eb2490cEfc74bAEb4B13c2dB9119CA0c38959B",
    "9000",
    "Evmos Testnet",
    "shared/"
  );

  // Evmos Mainnet
  verifyContract(
    "0x1d897A65A4fa98BBdfc2e94ad2357cE051Bf4a21",
    "9001",
    "Evmos Mainnet",
    "shared/"
  );

  // MultiVAC Mainnet
  verifyContract(
    "0x411925A3B2Ed99cD29DF76822D6419163d80858f",
    "62621",
    "MultiVAC Mainnet",
    "shared/"
  );

  // WAGMI Testnet
  verifyContract(
    "0x5974BF3196fc03A20cEB196270307707e0158BbD",
    "11111",
    "WAGMI",
    "shared/"
  );

  // Gather Mainnet
  verifyContract(
    "0x5b470D7B8165D109E3Fd2e2B4E7a30Cb89C051e5",
    "192837465",
    "GTH",
    "shared/"
  );

  // // Gather Testnet
  // verifyContract(
  //   "0x08Da5501c22AE1ce2621724Ca1A03383d6C12c4d",
  //   "356256156",
  //   "GTH",
  //   "shared/"
  // );

  // // Gather Devnet
  // verifyContract(
  //   "0xEeE72e2295E181BaB1ef049bFEAaf5fC348998C5",
  //   "486217935",
  //   "GTH",
  //   "shared/"
  //
  // );

  // DFK Chain Testnet
  verifyContract(
    "0x276946F2453538E882281d5A36ad6d19BBDfdaA7",
    "335",
    "DFK Chain Testnet",
    "shared/"
  );

  // DFK Chain Mainnet
  verifyContract(
    "0xB98EBF39148D39536C7f312E059990Dc59Aa26B5",
    "53935",
    "DFK Chain",
    "shared/"
  );
  verifyContract(
    "0xA3b8eB7A6C4EE5902Ef66d455da98973B55B9f8a",
    "9996",
    "Mind Smart Chain Mainnet",
    "shared/"
  );
  verifyContract(
    "0x6720b7a5974373C3F6bdE96c09bA4ffdddEEAeD7",
    "9977",
    "Mind Smart Chain Testnet",
    "shared/"
  );
  // Energy Web Volta Testnet
  verifyContract(
    "0x4667b7ce62e56B71146885555c68d2DDdf63349A",
    "73799",
    "Energy Web Volta Testnet",
    "shared/"
  );

  // Energy Web Chain
  verifyContract(
    "0xd07BECd1b2FE97924a2d4A0cF2d96e499ce28cA9",
    "246",
    "Energy Web Chain",
    "shared/"
  );

  // Godwoken testnet v1.1
  verifyContract(
    "0xc8D69B4D58bb79D03C0b83DbBAE509DAF3135e74",
    "71401",
    "Godwoken Testnet (V1.1)",
    "shared/"
  );

  // Godwoken mainnet v1.1
  verifyContract(
    "0x0aEF0854bCD792cb37FA0e75c27a1bC326d11725",
    "71402",
    "Godwoken Mainnet",
    "shared/"
  );

  // Dexalot Testnet
  verifyContract(
    "0xfa5a1E7788514Ae2B879377cF08a9CF2901d3A21",
    "432201",
    "Dexalot Testnet",
    "shared/"
  );

  // Dexalot Mainnet
  verifyContract(
    "0x1c799C32a6cF228D0656f3B87D60224afaB45903",
    "432204",
    "Dexalot Subnet",
    "shared/"
  );

  // //Crystaleum
  // verifyContract(
  //   "0x8Ab612E257534b7d5a6E315444f1C45c434eAaCf",
  //   "103090",
  //   "Crystaleum",
  //   "shared/"
  //
  // );

  //Kekchain (testnet)
  // verifyContract(
  //   "0x6FCe618B0677EdFCca9d38ed48Af89a8c056C938",
  //   "420666",
  //   "Kekchain",
  //   "shared/"
  // );

  //Kekchain Main Net (kekistan)
  // verifyContract(
  //   "0xbc0103404476AF674756911553b7A45B55e989e5",
  //   "420420",
  //   "Kekchain",
  //   "shared/"
  // );

  // Canto
  verifyContract(
    "0x65ec06aF7b8A6cBa7E7226e70dd2eBd117b823Cd",
    "7700",
    "Canto",
    "shared/"
  );

  // Canto Testnet
  verifyContract(
    "0x37e12c98b4663DcE9ab1460073D9Fe82A7bFD0d8",
    "7701",
    "Canto Testnet",
    "shared/"
  );

  // // POA Network Core
  // verifyContract(
  //   "0x3b2e3383AeE77A58f252aFB3635bCBd842BaeCB3",
  //   "99",
  //   "POA Core",
  //   "shared/"
  //
  // );

  // // Astar (EVM)
  // verifyContract(
  //   "0xA7e70Be8A6563DCe75299c30D1566A83fC63BC37",
  //   "592",
  //   "Astar (EVM)",
  //   "shared/"
  //
  // );

  // Gnosis Chiado Testnet
  verifyContract(
    "0xd46fd24ea21F04459407Fb0B518451e54d0b07a1",
    "10200",
    "Gnosis Chiado Testnet",
    "shared/"
  );

  // Klaytn Testnet Baobab
  verifyContract(
    "0x662749a392CeB1b5973a90FB2c388a2C18B8812c",
    "1001",
    "Klaytn Testnet Baobab",
    "shared/"
  );

  // Klaytn Mainnet Cypress
  // verifyContract(
  //   "0x3b2e3383AeE77A58f252aFB3635bCBd842BaeCB3",
  //   "8217",
  //   "Klaytn Mainnet Cypress",
  //   "shared/"
  // );

  // Shiden (EVM)
  verifyContract(
    "0x3b2e3383AeE77A58f252aFB3635bCBd842BaeCB3",
    "336",
    "Shiden (EVM)",
    "shared/"
  );

  // Chain support turned off
  // // Optimism Bedrock: Goerli Alpha Testnet
  // verifyContract(
  //   "0xA7e70Be8A6563DCe75299c30D1566A83fC63BC37",
  //   "28528",
  //   "Optimism Bedrock: Goerli Alpha Testnet",
  //   "shared/"
  //
  // );

  // ZetaChain: Athens Testnet
  verifyContract(
    "0x52ef49D23630EF439a8177E1e966F1953f37473f",
    "7001",
    "ZetaChain Athens Testnet",
    "shared/"
  );

  // ZetaChain: Athens Mainnet
  verifyContract(
    "0x5f5a064761A416919A60939DB85AeFD487e6cB3A",
    "7000",
    "ZetaChain Athens Mainnet",
    "shared/"
  );

  // Oasis Emerald Mainnet
  verifyContract(
    "0x7228Ab1F57e6fFd9F85930b9a9C2E9DD2307E4D0",
    "42262",
    "Oasis Emerald Mainnet",
    "shared/"
  );

  // Oasis Emerald Testnet
  verifyContract(
    "0x70D7603cAc831A9f23Fc7cAc301db300D55EA921",
    "42261",
    "Oasis Emerald Testnet",
    "shared/"
  );

  // Songbird Canary Network
  verifyContract(
    "0x024829b4A91fB78437A854380c89A3fFc966c2D1",
    "19",
    "Songbird Canary Network",
    "shared/"
  );

  // // Flare Mainnet
  // verifyContract(
  //   "0xbBc2EdeDc9d2d97970eE20d0Dc7216216a27e635",
  //   "14",
  //   "Flare Mainnet",
  //   "shared/"
  //
  // );

  // Oasis Sapphire Mainnet
  verifyContract(
    "0xFBcb580DD6D64fbF7caF57FB0439502412324179",
    "23294",
    "Oasis Sapphire",
    "shared/"
  );

  // Oasis Sapphire Testnet
  verifyContract(
    "0xFBcb580DD6D64fbF7caF57FB0439502412324179",
    "23295",
    "Oasis Sapphire Testnet",
    "shared/"
  );

  // Stratos Testnet (Mesos)
  verifyContract(
    "0xA049F14E503A489E6f72603034CBe4d6835C8393",
    "2047",
    "Stratos Testnet",
    "shared/"
  );

  // Stratos Mainnet
  verifyContract(
    "0x9004804c4306d0eF7687Bce0C193A94C7593013F",
    "2048",
    "Stratos Mainnet",
    "shared/"
  );

  // Bear Network Chain Mainnet
  verifyContract(
    "0x0f103813fa15CA19b6C4B46a0Afe99440b81d7C3",
    "641230",
    "Bear Network Chain Mainnet",
    "shared/"
  );

  // Lyra Mainnet
  verifyContract(
    "0xA46418a787312558453D79037f83b1319ae62c62",
    "957",
    "Lyra Mainnet",
    "shared/"
  );

  // // Base Goerli Testnet
  // verifyContract(
  //   "0x8F78b9c92a68DdF719849a40702cFBfa4EB60dD0",
  //   "84531",
  //   "Base Goerli Testnet",
  //   "shared/"
  // );

  // Base Mainnet
  verifyContract(
    "0x5e357053DDa704D059D146444cCC81afC1B2a662",
    "8453",
    "Base Mainnet",
    "shared/"
  );

  // Fraxtal
  verifyContract(
    "0xEe44D634f97d8eE09850Ed04559E068D30276FE7",
    "252",
    "Fraxtal",
    "252/",
    "partial"
  );

  verifyContract(
    "0x31D982ebd82Ad900358984bd049207A4c2468640",
    "2522",
    "Fraxtal Testnet",
    "252/",
    "partial"
  );

  // Wanchain Mainnet
  verifyContract(
    "0xC3649123BCa36c0c38A71bDbd2F508AB4f939f47",
    "888",
    "Wanchain Mainnet",
    "shared/"
  );

  // Wanchain Testnet
  verifyContract(
    "0x500E12a948E9Fc594bC6Fe86B3B270B5a67332D8",
    "999",
    "Wanchain Testnet",
    "shared/"
  );

  // The Root Network Mainnet
  verifyContract(
    "0x6C0cE8d62F1D81464F6F4DecB62f97aa83B8Df89",
    "7668",
    "The Root Network Mainnet",
    "shared/"
  );

  // The Root Network Porcini (Testnet)
  verifyContract(
    "0x225F2cD344c61152F8E7200E62e03dEfD683f2c4",
    "7672",
    "The Root Network Porcini",
    "shared/"
  );

  // Hedera Mainnet
  verifyContract(
    "0x00000000000000000000000000000000002265bb",
    "295",
    "Hedera Mainnet",
    "shared/"
  );

  // DogeChain Mainnet
  verifyContract(
    "0x2a35F4AA0d3e417e8896E972f35dba4b39b6305e",
    "2000",
    "DogeChain Mainnet",
    "shared/"
  );

  // Bitkub Chain Testnet
  verifyContract(
    "0x58909Ef2F2b167F52cF46575f1582500287cCE48",
    "25925",
    "Bitkub Chain Testnet",
    "shared/"
  );

  // Bitkub Chain
  verifyContract(
    "0xC75f4D89A0DdA70Ad613908D9976E90dAb42035c",
    "96",
    "Bitkub Chain",
    "shared/"
  );

  // Cronos Mainnet Beta
  verifyContract(
    "0xEdE2053329D203E8261B47A10540Ee4b7a596667",
    "25",
    "Cronos Mainnet Beta",
    "25/"
  );

  // Elysium Mainnet Chain
  verifyContract(
    "0x20563837F7423465699D7675BCB82f886a761c25",
    "1339",
    "Elysium Mainnet",
    "shared/"
  );

  // Taiko Grimsvotn L2
  // verifyContract(
  //   "0x68107Fb54f5f29D8e0B3Ac44a99f4444D1F22a68",
  //   "167005",
  //   "Taiko Grimsvotn L2",
  //   "shared/"
  // );

  // Taiko Eldfell L3
  // verifyContract(
  //   "0x270a7521B3678784f96848D441fE1B2dc2f040D8",
  //   "167006",
  //   "Taiko Eldfell L3",
  //   "shared/",
  //   "partial"
  // );

  // ZORA Mainnet
  verifyContract(
    "0x090734f94FA67590702421A9B61892509b7CE80A",
    "7777777",
    "ZORA MAinnet",
    "shared/"
  );

  // ZORA Sepolia Testnet
  verifyContract(
    "0x9788C590bd201b80091Bca6A322BeB903b8190Dd",
    "999999999",
    "ZORA Sepolia Testnet",
    "shared/"
  );

  // UPTN Chain Mainnet
  verifyContract(
    "0x212F6222fB4937978A806b14FB2725169825078F",
    "6119",
    "UPTN Chain",
    "6119/"
  );

  // BEAM Chain Testnet
  verifyContract(
    "0x9BF49b704EE2A095b95c1f2D4EB9010510c41C9E",
    "13337",
    "BEAM Chain",
    "13337/",
    "partial"
  );

  // Kanazawa Chain Testnet
  verifyContract(
    "0x24c456Fb4c450208366B1f8322c3241aA013758e",
    "222000222",
    "Kanazawa Chain",
    "222000222/"
  );

  // MELD Chain Testnet
  verifyContract(
    "0x769eE5A8e82C15C1b6E358f62aC8eb6E3AbE8dC5",
    "333000333",
    "MELD Chain",
    "333000333/"
  );

  // Kiwi Subnet
  verifyContract(
    "0xe89a85b79e64b35829625A7EEf70F8915d32F75f",
    "2037",
    "Kiwi Subnet",
    "2037/"
  );

  // KAVA EVM
  verifyContract(
    "0xAdFa11e737ec8fA6e91091468aEF33a66Ae0044c",
    "2222",
    "Kava EVM",
    "shared/"
  );

  // Siberium Testnet
  verifyContract(
    "0x60E9b3CD8C160Ce6408dD6E2Fa938895cfF7E087",
    "111000",
    "Siberium Testnet",
    "shared/"
  );

  // Ethereum Classic Mainnet
  verifyContract(
    "0x45a82B987a4e5d7D00eD5aB325DF00850cDAbBAC",
    "61",
    "Ethereum Classic Mainnet",
    "shared/"
  );

  // Filecoin Mainnet
  verifyContract(
    "0x23396626F2C9c0b31cC6C2729172103961Ae2A26",
    "314",
    "Filecoin Mainnet",
    "shared/"
  );

  // Filecoin Calibration Testnet
  verifyContract(
    "0xB34d5e2Eb6eCFDe11cC63955b43335A2407A4683",
    "314159",
    "Filecoin Calibration Testnet",
    "shared/"
  );

  // Zilliqa EVM
  verifyContract(
    "0x6F85669808e20b121980DE8E7a794a0cc90fDc77",
    "32769",
    "Zilliqa EVM",
    "shared/"
  );
  // Zilliqa EVM Testnet
  verifyContract(
    "0xeb6Ea260eDFb9837ed100B09c559081AfA5b0785",
    "33101",
    "Zilliqa EVM Testnet",
    "shared/"
  );

  // KAVA EVM Testnet
  verifyContract(
    "0x40b4f95C3bafc8d690B4c3fDD1E8303c4817Cd9C",
    "2221",
    "Kava EVM Testnet",
    "shared/"
  );
  // MAP Testnet Makalu
  verifyContract(
    "0xAbdE047dD5861E163830Ad57e1E51990035E1F44",
    "212",
    "MAP Testnet Makalu",
    "shared/"
  );
  // map-relay-chain mainnet
  verifyContract(
    "0xAbdE047dD5861E163830Ad57e1E51990035E1F44",
    "22776",
    "Map Mainnet",
    "shared/"
  );

  // Edgeware EdgeEVM Mainnet
  verifyContract(
    "0xCc21c38A22918a86d350dF9aB9c5A60314A01e06",
    "2021",
    "Edgeware EdgeEVM Mainnet",
    "shared/"
  );

  // Arbitrum Nova
  verifyContract(
    "0xC2141cb30Ef8cE403569D59964eaF3D66848822F",
    "42170",
    "Arbitrum Nova",
    "shared/"
  );

  // FTM Fantom Opera Mainnet
  verifyContract(
    "0xc47856bEBCcc2BBB23E7a5E1Ba8bB4Fffa5C5476",
    "250",
    "Fantom Opera",
    "shared/"
  );

  verifyContract(
    "0x4956f15efdc3dc16645e90cc356eafa65ffc65ec",
    "4337",
    "Beam Subnet",
    "4337/"
  );

  // verifyContract(
  //   "0x72Ed1E3E3A68DfB7495FAfb19C0de1A0B7Ec5524",
  //   "78432",
  //   "Conduit Subnet",
  //   "78432/"
  // );

  // verifyContract(
  //   "0xa785B911a79B0d5d8895c567663c29F0f7B93321",
  //   "78431",
  //   "Bulletin Subnet",
  //   "78431/"
  // );

  // // Amplify Subnet
  // verifyContract(
  //   "0xB19f81cA2141ACd6F2Cc39bAFAD2a613bC4c9592",
  //   "78430",
  //   "Amplify Subnet",
  //   "78430/"
  // );

  // Shrapnel Subnet Testnet
  verifyContract(
    "0x8Bb9d0Dd48B7a54B248D2d386AfF253DA7856479",
    "2038",
    "Shrapnel Testnet",
    "2038/"
  );

  // Shrapnel Subnet
  verifyContract(
    "0xb9D27a0D61392566b92E08937a6C6E798F197ADF",
    "2044",
    "Shrapnel Subnet",
    "2044/"
  );
  verifyContract(
    "0xD5bB0035a178d56Abd23a39fB3666031084b2cb5",
    "1116",
    "Core Blockchain Mainnet",
    "shared/"
  );

  verifyContract(
    "0xfABd9a36bF07A3190859f819638E0A49adEa6C41",
    "10242",
    "Arthera Mainnet",
    "shared/"
  );

  verifyContract(
    "0xE115Ef16e46bbF46591170D712140eC553C43553",
    "10243",
    "Arthera Testnet",
    "shared/"
  );

  // Q Mainnet
  verifyContract(
    "0xc8AeB7206D1AD1DD5fC202945401303b3A7b72e0",
    "35441",
    "Q Mainnet",
    "shared/"
  );

  // Q Testnet
  verifyContract(
    "0xc8AeB7206D1AD1DD5fC202945401303b3A7b72e0",
    "35443",
    "Q Testnet",
    "shared/"
  );

  verifyContract(
    "0xbF33D2dA0F875D826ce1bA250F66b2785d48C113",
    "11235",
    "Haqq Mainnet",
    "shared/"
  );

  verifyContract(
    "0xbF33D2dA0F875D826ce1bA250F66b2785d48C113",
    "54211",
    "Haqq Testnet",
    "shared/"
  );

  verifyContract(
    "0x612C7dE4039655B9C9aE9A9B41f3A22319F0dF65",
    "1115",
    "Core Blockchain Testnet",
    "shared/"
  );

  verifyContract(
    "0xFe392C04b7879f28D9F966239F3e3646fe048863",
    "30",
    "Rootstock",
    "shared/"
  );

  verifyContract(
    "0x10fB58BBd3c4F580aC4be0600221850FDF33BEdF",
    "49797",
    "Energi Testnet",
    "shared/"
  );

  verifyContract(
    "0xA9CD2d159ca8ab30711e9d9331D5229476e8a2d5",
    "39797",
    "Energi Mainnet",
    "shared/"
  );

  // Mantle Mainnet
  verifyContract(
    "0x2977852235B0EcFa27D3Eb045898fFF3575b294B",
    "5000",
    "Mantle Mainnet",
    "shared/"
  );

  // Crossbell Mainnet
  verifyContract(
    "0xaa028312440DFd72A33053932150aE5e35017f6A",
    "3737",
    "Crossbell Mainnet",
    "shared/"
  );

  // Rikeza Network
  verifyContract(
    "0xa8c07c66d0458e8c6e442a8827f4bc3fad036407",
    "1433",
    "Rikeza Network",
    "1433/"
  );

  // Zeniq Mainnet
  verifyContract(
    "0xCf16669c144989409D439262F2BfBFa31BD6cd2a",
    "383414847825",
    "Zeniq",
    "shared/"
  );

  // Tiltyard Subnet
  verifyContract(
    "0xfd52e1A54442aC8d6a7C54713f99D0dc113df220",
    "1127469",
    "Tiltyard Subnet",
    "1127469/"
  );

  // Polygon zkEVM Mainnet
  verifyContract(
    "0xaa50c265da4552db6e8983317e3b5510727db132",
    "1101",
    "Polygon zkEVM",
    "shared/"
  );

  // Scroll Sepolia Testnet
  verifyContract(
    "0xce478ef16eb34438463513c48da4f31269fa8b6a",
    "534351",
    "Scroll Sepolia Testnet",
    "shared/"
  );

  // Scroll
  verifyContract(
    "0x1685d11a2EDce8d2C8015f4cB0Cd197839b761f5",
    "534352",
    "Scroll",
    "shared/"
  );

  // Mode Testnet
  verifyContract(
    "0x4d5f06cC2A7d3a625C95D04Cfaec5AEb5eCfA33D",
    "919",
    "Mode Testnet",
    "shared/"
  );

  // Mode
  verifyContract(
    "0x4d5f06cC2A7d3a625C95D04Cfaec5AEb5eCfA33D",
    "34443",
    "Mode",
    "shared/"
  );

  // Conflux eSpace
  verifyContract(
    "0x4d5f06cc2a7d3a625c95d04cfaec5aeb5ecfa33d",
    "1030",
    "Conflux eSpace",
    "shared/"
  );

  // Lightlink Pegasus Testnet
  verifyContract(
    "0x948a02ABB83ED54D8908F6725d2a9cEE6B6B582a",
    "1891",
    "Lightlink Pegasus Testnet",
    "shared/"
  );

  // Lightlink Phoenix Mainnet
  verifyContract(
    "0x948a02ABB83ED54D8908F6725d2a9cEE6B6B582a",
    "1890",
    "Lightlink Phoenix Mainnet",
    "shared/"
  );

  // ZKFair Mainnet
  verifyContract(
    "0xc3a9766e07754cC1894E5c0A2459d23A676dDD0D",
    "42766",
    "ZKFair Mainnet",
    "shared/"
  );

  // Kroma Sepolia
  verifyContract(
    "0x4d5f06cC2A7d3a625C95D04Cfaec5AEb5eCfA33D",
    "2358",
    "Kroma Sepolia",
    "shared/"
  );

  // Kroma
  verifyContract(
    "0x270236c25d28a2cd85ed9a1ef0b31835fb9e4ff6",
    "255",
    "Kroma",
    "shared/"
  );

  // Ozone Chain Mainnet
  verifyContract(
    "0x50A9B085260F80CFEb1Af8c7131980fC11238ccB",
    "4000",
    "Ozone Chain Mainnet",
    "shared/"
  );

  // Endurance Smart Chain Mainnet
  verifyContract(
    "0x9e5b6c4F1080a4cb5bFD84816375c25E3B26d11A",
    "648",
    "Endurance Smart Chain Mainnet",
    "shared/"
  );

  // CrossFi Chain Testnet
  verifyContract(
    "0x684F57Dd731EB2F7Bab0f9b077C41C256CB4eb17",
    "4157",
    "CrossFi Chain Testnet",
    "shared/"
  );

  // Tiltyard Mainnet
  verifyContract(
    "0xbBB3e01361604EB1884b3f1Cf3524b73966E8Ef9",
    "710420",
    "Tiltyard Mainnet",
    "shared/"
  );

  // Phoenix Mainnet
  verifyContract(
    "0x4aE9a333D2Bfb5754fEa6aA24c17026EbD411e2f",
    "13381",
    "Phoenix Mainnet",
    "shared/"
  );

  // YMTECH-BESU Testnet
  verifyContract(
    "0x37A01685de21e2d459fE3c6AEDe86A94B4bb8d9C",
    "202401",
    "YMTECH-BESU Testnet",
    "shared/"
  );

  it("should have included Etherscan contracts for all testedChains having etherscanAPI", function (done) {
    const missingEtherscanTests = [];
    supportedChains
      .filter((chain) => testedChains.has(`${chain.chainId}`))
      .forEach((chain) => {
        if (chain.chainId == 1337 || chain.chainId == 31337) return; // Skip LOCAL_CHAINS: Ganache and Hardhat
        if (
          chain.etherscanAPI &&
          testEtherscanContracts[chain.chainId] === undefined
        ) {
          missingEtherscanTests.push(chain);
        }
      });

    chai.assert(
      missingEtherscanTests.length == 0,
      `There are missing Etherscan tests for chains: ${missingEtherscanTests
        .map((chain) => `${chain.name} (${chain.chainId})`)
        .join(",\n")}`
    );

    done();
  });

  // Finally check if all the "supported: true" chains have been tested
  it("should have tested all supported chains", function (done) {
    if (newAddedChainIds.length) {
      // Don't test all chains if it is a pull request for adding new chain support
      return this.skip();
    }

    const untestedChains = [];
    supportedChains.forEach((chain) => {
      if (chain.chainId == 1337 || chain.chainId == 31337) return; // Skip LOCAL_CHAINS: Ganache and Hardhat
      if (!testedChains.has(chain.chainId.toString())) {
        untestedChains.push(chain);
      }
    });
    chai.assert(
      untestedChains.length == 0,
      `There are untested chains!: ${untestedChains
        .map((chain) => `${chain.name} (${chain.chainId})`)
        .join(",\n")}`
    );

    done();
  });

  //////////////////////
  // Helper functions //
  //////////////////////

  function verifyContract(
    address,
    chainId,
    chainName,
    sourceAndMetadataDir, // folder
    expectedStatus = "perfect"
  ) {
    // If it is a pull request for adding new chain support, only test the new chain
    if (newAddedChainIds.length && !newAddedChainIds.includes(chainId)) return;
    it(`should verify a contract on ${chainName} (${chainId})`, function (done) {
      // Context for the test report
      addContext(this, {
        title: "Test identifier",
        value: {
          chainId: chainId,
          testType: "normal",
        },
      });

      const fullDir = path.join(__dirname, "sources", sourceAndMetadataDir);
      const files = {};
      readFilesRecursively(fullDir, files);

      chai
        .request(server.app)
        .post("/")
        .send({
          address: address,
          chain: chainId,
          files: files,
        })
        .end(async (err, res) => {
          await assertVerification(
            false,
            err,
            res,
            done,
            address,
            chainId,
            expectedStatus
          );
          anyTestsPass = true;
        });
    });
    testedChains.add(chainId);
  }
});

function readFilesRecursively(directoryPath, files) {
  const filesInDirectory = fs.readdirSync(directoryPath);

  filesInDirectory.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      // Recursively call the function for subdirectories
      readFilesRecursively(filePath, files);
    } else {
      // Read and store the content of the file
      files[file] = fs.readFileSync(filePath).toString();
    }
  });
}
