import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';
import '@typechain/hardhat';
import 'solidity-coverage';
import 'hardhat-deploy-tenderly';
import {node_url, accounts, addForkConfiguration} from './utils/network';

// adds zkSync Era dependencies
import '@matterlabs/hardhat-zksync-deploy';
import '@matterlabs/hardhat-zksync-solc';

const config: HardhatUserConfig = {
	// zkSync Era compiler
	zksolc: {
		version: '1.3.1',
		compilerSource: 'binary',
		settings: {},
	},
	solidity: {
		compilers: [
			{
				version: '0.8.17',
				settings: {
					optimizer: {
						enabled: true,
						runs: 2000,
					},
				},
			},
		],
	},
	namedAccounts: {
		deployer: 0,
		simpleERC20Beneficiary: 1,
	},
	networks: addForkConfiguration({
		hardhat: {
			initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
		},
		localhost: {
			url: node_url('localhost'),
			accounts: accounts(),
			zksync: false,
		},
		staging: {
			url: node_url('rinkeby'),
			accounts: accounts('rinkeby'),
			zksync: false,
		},
		production: {
			url: node_url('mainnet'),
			accounts: accounts('mainnet'),
			zksync: false,
		},
		mainnet: {
			url: node_url('mainnet'),
			accounts: accounts('mainnet'),
			zksync: false,
		},
		rinkeby: {
			url: node_url('rinkeby'),
			accounts: accounts('rinkeby'),
			zksync: false,
		},
		kovan: {
			url: node_url('kovan'),
			accounts: accounts('kovan'),
			zksync: false,
		},
		goerli: {
			url: node_url('goerli'),
			accounts: accounts('goerli'),
			zksync: false,
		},
		zkSyncTestnet: {
			url: 'https://zksync2-testnet.zksync.dev',
			ethNetwork: node_url('goerli'), // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
			accounts: accounts('goerli'),
			zksync: true,
		},
		zkSyncLocal: {
			url: 'http://localhost:3050/',
			ethNetwork: 'http://localhost:8545/', // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
			accounts: ['0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110'],
			zksync: true,
		},
	}),
	paths: {
		sources: 'src',
	},
	gasReporter: {
		currency: 'USD',
		gasPrice: 100,
		enabled: process.env.REPORT_GAS ? true : false,
		coinmarketcap: process.env.COINMARKETCAP_API_KEY,
		maxMethodDiff: 10,
	},
	typechain: {
		outDir: 'typechain',
		target: 'ethers-v5',
	},
	mocha: {
		timeout: 0,
	},
	external: process.env.HARDHAT_FORK
		? {
				deployments: {
					// process.env.HARDHAT_FORK will specify the network that the fork is made from.
					// these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
					hardhat: ['deployments/' + process.env.HARDHAT_FORK],
					localhost: ['deployments/' + process.env.HARDHAT_FORK],
				},
		  }
		: undefined,

	tenderly: {
		project: 'template-ethereum-contracts',
		username: process.env.TENDERLY_USERNAME as string,
	},
};

export default config;
