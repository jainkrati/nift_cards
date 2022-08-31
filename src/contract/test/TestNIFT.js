
import { ethers } from "ethers";
const { expect } = require("chai");

// TODO update the test
describe("NIFT contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const NIFT = await ethers.getContractFactory("NIFT");

    const hardhatToken = await NIFT.deploy();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});