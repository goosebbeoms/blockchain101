import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe("etherStore", function () {

let etherStore: Contract;
let attack: Contract
let eve: SignerWithAddress;
let alice: SignerWithAddress;
let bob: SignerWithAddress;
let owner: SignerWithAddress;

  describe("etherStoreGuard", function () {
    it("Deposit 1 Ether each from Account 1 (Alice) and Account 2 (Bob) into etherStore", async function () {
      [owner, alice, bob, eve] = await ethers.getSigners();

      const EtherStoreGuard = await ethers.getContractFactory("EtherStoreGuard");
      etherStore = await EtherStoreGuard.deploy();
      const Attack = await ethers.getContractFactory("Attack2");
      attack = await Attack.deploy(etherStore.address);
      console.log("etherStore address : ", etherStore.address)
      console.log("attack address : ", attack.address)
      await etherStore.connect(alice).deposit({value: (1*(10**18)).toString()});
      await etherStore.connect(bob).deposit({value: (1*(10**18)).toString()});
      console.log("etherStore balance : ", await ethers.provider.getBalance(etherStore.address))
    });

    it("Call Attack.attack sending 1 ether (using Account 3 (Eve))", async function () {
      console.log("before sending1 eth : ", await attack.getBalance());
      console.log("before sending1 eth attack: ", await ethers.provider.getBalance(attack.address))
      console.log("before sending1 eth eve : ", await ethers.provider.getBalance(eve.address))
      console.log("etherStore balance etherStore: ", await ethers.provider.getBalance(etherStore.address))

      attack.connect(eve).attack({value: (1*(10**18)).toString()})

      console.log("after sending1 eth : ", await attack.getBalance());
      console.log("after sending1 eth : attack ", await ethers.provider.getBalance(attack.address))
      console.log("after sending1 eth : eve ", await ethers.provider.getBalance(eve.address))
    });
  });
});
