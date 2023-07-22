const ethers = require('ethers');
const { Presets } = require('userop');

exports.handler = async function(event, context) {
    const signingKey = process.env.SIGNING_KEY;
    const rpcUrl = process.env.RPC_URL;

    const simpleAccount = await Presets.Builder.SimpleAccount.init(
        new ethers.Wallet(signingKey),
        rpcUrl
    );
    const address = simpleAccount.getSender();

    console.log(`SimpleAccount address: ${address}`);

    return address;
}