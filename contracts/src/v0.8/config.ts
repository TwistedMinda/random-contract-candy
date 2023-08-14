const configs = {
  sepolia: {
    candy: {
      address: '0xD3E477bCDFc452Ac519c0dEAA83Bb8311efcb034',
      subscriptionId: 4522,
    },
    chainlink: {
      vrfCoordinator: '0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625',
      keyHash: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c'
    }
  }
}
export type ConfigKey = keyof typeof configs

export default configs