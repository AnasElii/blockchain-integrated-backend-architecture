const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const CountersModule = require("./Counters");

const NFTMarketplaceModule = buildModule("NFTMarketplaceModule", (m) => {
    const counters = m.useModule(CountersModule);
    const NFTMarketplace = m.contract("NFTMarketplace", [], {
        libraries: {
            Counters: counters.counters,
        }
    })

    return { NFTMarketplace };
});

module.exports = NFTMarketplaceModule;