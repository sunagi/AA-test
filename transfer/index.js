const ethers = require('ethers');
const utils = require('ethers').utils;
const { Client, Presets } = require('userop');

exports.handler = async function(event, context) {
    console.log(ethers);
    console.log(utils);
    console.log(ethers.utils.getAddress("0xcED78cA7A824Da41863C7f79C86fb4739D1de2D7"));
    console.log(event.to);

  const paymasterMiddleware = event.withPM
    ? Presets.Middleware.verifyingPaymaster(
        process.env.PAYMASTER_RPC_URL,
        process.env.PAYMASTER_CONTEXT
      )
    : undefined;
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    new ethers.Wallet(process.env.SIGNING_KEY),
    process.env.RPC_URL,
    { paymasterMiddleware, overrideBundlerRpc: event.overrideBundlerRpc }
  );
  const client = await Client.init(process.env.RPC_URL, {
    overrideBundlerRpc: event.overrideBundlerRpc,
  });

  const target = utils.getAddress(event.to);
  const value = utils.parseEther(event.amount.toString());
  const res = await client.sendUserOperation(
    simpleAccount.execute(target, value, "0x"),
    {
      dryRun: event.dryRun,
      onBuild: (op) => console.log("Signed UserOperation:", op),
    }
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
}