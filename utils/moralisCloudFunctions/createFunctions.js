
//? ADD NEWLY CREATED CONTRACT TO CREATOR CONTRACTS ARRAY
Moralis.Cloud.afterSave("FACTORYCreateNewContract", async function (request) {
  const confirmed = request.object.get("confirmed");
  const creatorAddr = request.object.get("creator");
  const contractAddr = request.object.get("contractAddress");
  if (confirmed) {
    const queryCreator = new Moralis.Query("Creator");
    queryCreator.equalTo("mainAccount", creatorAddr);
    const creator = await queryCreator.first();
    creator.addUnique("nftContracts", contractAddr)
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