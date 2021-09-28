This will create a character with 6 attributes from 0 - 99:
 -   uint256 strength;
 -   uint256 dexterity;
 -   uint256 constitution;
 -   uint256 intelligence;
 -   uint256 wisdom;
 -   uint256 charisma;

And then:
 -   uint256 experience;
 -   string name;

### Setup Environment Variables
You'll need a `MNEMONIC` and a rinkeby `RINKEBY_RPC_URL` environment variable. Your `MNEMONIC` is your seed phrase of your wallet. You can find an `RINKEBY_RPC_URL` from node provider services like [Infura](https://infura.io/)

Then, you can create a `.env` file with the following.

```bash
MNEMONIC='cat dog frog....'
RINKEBY_RPC_URL='www.infura.io/asdfadsfafdadf'
```

Or, set them in a `bash_profile` file or export them directly into your terminal.

To run them directly in your terminal, run: 
```bash
export MNEMONIC='cat dog frog....'
export RINKEBY_RPC_URL='www.infura.io/asdfadsfafdadf'
```

Then you can get started with:

npm install
truffle migrate --reset --network rinkeby
```
