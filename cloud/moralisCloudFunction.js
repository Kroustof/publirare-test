import Moralis from "moralis/types";

const logger = Moralis.Cloud.getLogger();

Moralis.Cloud.define("updateStoreWhitelist", async (request) => {
  const queryCreator = new Moralis.Query("Creator");
  const queryUser = new Moralis.Query("_User");
  queryCreator.equalTo("mainAccount", request.params.account);
  const creator = await queryCreator.first();
  const user = await queryUser.get(creator.attributes.parentUser.id,{useMasterKey:true});
  creator.set("isWhitelistedStore", request.params.boolValue);
  if(creator.attributes.status != "certified") {
  	creator.set("status", request.params.status)
  }
  creator.set("processing", false);
  user.set("isCreator", request.params.boolValue);
  await creator.save();
  await user.save(null,{useMasterKey:true});
});

Moralis.Cloud.afterSave("STOREAddWhitelist", async function (request) {
  const confirmed = request.object.get("confirmed");
  const account = request.object.get("account");
  if (confirmed) {
    const params =  { account: account, boolValue: true, status: "confirmed" };
	await Moralis.Cloud.run("updateStoreWhitelist", params);
  } else {
    logger.info("Not confirmed yet");
    const queryCreator = new Moralis.Query("Creator");
    queryCreator.equalTo("mainAccount", account);
    const creator = await queryCreator.first();
    creator.set("processing", true);
    await creator.save();
  }
});

Moralis.Cloud.afterSave("STORERemoveWhitelist", async function (request) {
  const confirmed = request.object.get("confirmed");
  const account = request.object.get("account");
  if (confirmed) {
    const params =  { account: account, boolValue: false, status: "rejected" };
	  await Moralis.Cloud.run("updateStoreWhitelist", params);
  } else {
    logger.info("Not confirmed yet");
    const queryCreator = new Moralis.Query("Creator");
    queryCreator.equalTo("mainAccount", account);
    const creator = await queryCreator.first();
    creator.set("processing", true);
    await creator.save();
  }
});

Moralis.Cloud.define("updateFactoryWhitelist", async (request) => {
  const queryCreator = new Moralis.Query("Creator");
  const queryUser = new Moralis.Query("_User");
  queryCreator.equalTo("mainAccount", request.params.account);
  const creator = await queryCreator.first();
  const user = await queryUser.get(creator.attributes.parentUser.id,{useMasterKey:true});
  creator.set("isWhitelistedStore", request.params.boolValue1);
  creator.set("isWhitelistedFactory", request.params.boolValue2);
  if(creator.attributes.status != "certified") {
  	creator.set("status", request.params.status)
  };
  creator.set("processing", false);
  user.set("isCreator", request.params.boolValue1);
  await creator.save();
  await user.save(null,{useMasterKey:true});
});

Moralis.Cloud.afterSave("FACTORYAddWhitelist", async function (request) {
  const confirmed = request.object.get("confirmed");
  const account = request.object.get("account");
  if (confirmed) {
    const params =  { account: account, boolValue1: true, boolValue2: true, status: "confirmed" };
	  await Moralis.Cloud.run("updateFactoryWhitelist", params);
  } else {
    logger.info("Not confirmed yet");
    const queryCreator = new Moralis.Query("Creator");
    queryCreator.equalTo("mainAccount", account);
    const creator = await queryCreator.first();
    creator.set("processing", true);
    await creator.save();
  }
});

Moralis.Cloud.afterSave("FACTORYRemoveWhitelist", async function (request) {
  const confirmed = request.object.get("confirmed");
  const account = request.object.get("account");
  if (confirmed) {
    const params =  { account: account, boolValue1: true, boolValue2: false, status: "confirmed" };
	  await Moralis.Cloud.run("updateFactoryWhitelist", params);
  } else {
    logger.info("Not confirmed yet");
    const queryCreator = new Moralis.Query("Creator");
    queryCreator.equalTo("mainAccount", account);
    const creator = await queryCreator.first();
    creator.set("processing", true);
    await creator.save();
  }
});

Moralis.Cloud.afterSave("FACTORYCreateContract", async function (request) {
  const confirmed = request.object.get("confirmed");
  const creatorAddr = request.object.get("creator");
  const contractAddr = request.object.get("contractAddress");
  if (confirmed) {
    const queryCreator = new Moralis.Query("Creator");
    queryCreator.equalTo("mainAccount", creatorAddr);
    const creator = await queryCreator.first();
    const contractArray = creator.get("nftContracts");
    contractArray.push(contractAddr);
    creator.set("nftContracts", contractArray);
    creator.set("processing", false);
    await creator.save();
  } else {
    logger.info("Not confirmed yet");
    const queryCreator = new Moralis.Query("Creator");
    queryCreator.equalTo("mainAccount", creatorAddr);
    const creator = await queryCreator.first();
    creator.set("processing", true);
    await creator.save();
  }
});