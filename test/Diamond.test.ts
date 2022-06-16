import { ethers } from "hardhat";
import chai, { assert } from "chai";
import { solidity } from "ethereum-waffle";
import {
  DiamondCutFacet,
  DiamondLoupeFacet,
} from "../typechain";
import deployDiamond from "../scripts/deploy";
import {
  FacetCutAction,
  findAddressPositionInFacets,
  getSelectors,
  removeSelectors,
} from "../scripts/libraries/diamond";
import { Contract, ContractReceipt, ContractTransaction } from "ethers";

chai.use(solidity);
describe("Diamond Functionality", async () => {
  let diamondAddress: string;
  let diamondCutFacet: Contract;
  let diamondLoupeFacet: Contract;
  let ownershipFacet: Contract;
  let tx: ContractTransaction;
  let receipt: ContractReceipt;
  let result: string[];

  let addresses: string[];
  before(async (done) => {
    const [deployer] = await ethers.getSigners();
    diamondAddress = await deployDiamond();
    diamondCutFacet = await ethers.getContractAt(
      "DiamondCutFacet",
      diamondAddress
    );
    diamondLoupeFacet = await ethers.getContractAt(
      "DiamondLoupeFacet",
      diamondAddress
    );
    ownershipFacet = await ethers.getContractAt(
      "OwnershipFacet",
      diamondAddress
    );
    done();
  });

  it("should have three facets -- call to facetAddresses function", async (done) => {
    for (const address of await diamondLoupeFacet.facetAddresses()) {
      addresses.push(address);
    }
    assert.equal(addresses.length, 3);
    done();
  });

  it("facets should have the right function selectors -- call to facetFunctionSelectors function", async (done) => {
    let selectors = getSelectors(diamondCutFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0]);
    assert.sameMembers(result, selectors);
    selectors = getSelectors(diamondLoupeFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[1]);
    assert.sameMembers(result, selectors);
    selectors = getSelectors(ownershipFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[2]);
    assert.sameMembers(result, selectors);
    done();
  });

  it("selectors should be associated to facets correctly -- multiple calls to facetAddress function", async (done) => {
    assert.equal(
      addresses[0],
      await diamondLoupeFacet.facetAddress("0x1f931c1c")
    );
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress("0xcdffacc6")
    );
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress("0x01ffc9a7")
    );
    assert.equal(
      addresses[2],
      await diamondLoupeFacet.facetAddress("0xf2fde38b")
    );
      done();
  });

  it("should add Test1Facet functions to the diamond", async (done) => {
    const Test1Facet = await ethers.getContractFactory("Test1Facet");
    const test1Facet = await Test1Facet.deploy();
    await test1Facet.deployed();
    addresses.push(test1Facet.address);
    let selectors = getSelectors(test1Facet);
    selectors = removeSelectors(selectors, ["supportsInterface(bytes4)"]);

    tx = await (diamondCutFacet as DiamondCutFacet).diamondCut(
      [
        {
          facetAddress: test1Facet.address,
          action: FacetCutAction.Add,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      "0x",
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await (
      diamondLoupeFacet as DiamondLoupeFacet
    ).facetFunctionSelectors(test1Facet.address);
    assert.sameMembers(result, selectors);
      done();
  });

  it("should test function call", async (done) => {
    const test1Facet = await ethers.getContractAt("Test1Facet", diamondAddress);
    await test1Facet.test1Func10();
    done();
  });

  it("should replace supportsInterface function", async (done) => {
    const Test1Facet = await ethers.getContractFactory("Test1Facet");
    let selectors = getSelectors(Test1Facet);
    selectors = removeSelectors(selectors, ["supportsInterface(bytes4)"]);

    const testFacetAddress = addresses[3];
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: testFacetAddress,
          action: FacetCutAction.Replace,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      "0x",
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(testFacetAddress);
    assert.sameMembers(result, getSelectors(Test1Facet));
    done();
  });

  it("should add test2 functions", async (done) => {
    const Test2Facet = await ethers.getContractFactory("Test2Facet");
    const test2Facet = await Test2Facet.deploy();
    await test2Facet.deployed();
    addresses.push(test2Facet.address);
    const selectors = getSelectors(test2Facet);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: test2Facet.address,
          action: FacetCutAction.Add,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      "0x",
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(test2Facet.address);
    assert.sameMembers(result, selectors);
    done();
  });

  it("should remove some test2 functions", async (done) => {
    const test2Facet = await ethers.getContractAt("Test2Facet", diamondAddress);
    const functionsToKeep = [
      "test2Func1()",
      "test2Func5()",
      "test2Func6()",
      "test2Func19()",
      "test2Func20()",
    ];
    let selectors = getSelectors(test2Facet);
    selectors = removeSelectors(selectors, functionsToKeep);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: ethers.constants.AddressZero,
          action: FacetCutAction.Remove,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      "0x",
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[4]);
    assert.sameMembers(result, getSelectors(test2Facet));
    done();
  });

  it("should remove some test1 functions", async (done) => {
    const test1Facet = await ethers.getContractAt("Test1Facet", diamondAddress);
    const functionsToKeep = ["test1Func2()", "test1Func11()", "test1Func12()"];
    let selectors = getSelectors(test1Facet);
    selectors = removeSelectors(selectors, functionsToKeep);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: ethers.constants.AddressZero,
          action: FacetCutAction.Remove,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      "0x",
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[3]);
    assert.sameMembers(result, getSelectors(test1Facet));
    done();
  });

  it("remove all functions and facets accept 'diamondCut' and 'facets'", async (done) => {
    let selectors = [];
    let facets = await diamondLoupeFacet.facets();
    for (let i = 0; i < facets.length; i++) {
      selectors.push(...facets[i].functionSelectors);
    }
    selectors = removeSelectors(selectors, [
      "facets()",
      "diamondCut(tuple(address,uint8,bytes4[])[],address,bytes)",
    ]);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: ethers.constants.AddressZero,
          action: FacetCutAction.Remove,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      "0x",
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    facets = await diamondLoupeFacet.facets();
    assert.equal(facets.length, 2);
    assert.equal(facets[0][0], addresses[0]);
    assert.sameMembers(facets[0][1], ["0x1f931c1c"]);
    assert.equal(facets[1][0], addresses[1]);
    assert.sameMembers(facets[1][1], ["0x7a0ed627"]);
    done();
  });

  it("add most functions and facets", async (done) => {
    let diamondLoupeFacetSelectors = getSelectors(diamondLoupeFacet);
    diamondLoupeFacetSelectors = removeSelectors(diamondLoupeFacetSelectors, [
      "supportsInterface(bytes4)",
    ]);
    const Test1Facet = await ethers.getContractFactory("Test1Facet");
    const Test2Facet = await ethers.getContractFactory("Test2Facet");
    // Any number of functions from any number of facets can be added/replaced/removed in a
    // single transaction
    const cut = [
      {
        facetAddress: addresses[1],
        action: FacetCutAction.Add,
        functionSelectors: removeSelectors(diamondLoupeFacetSelectors, [
          "facets()",
        ]),
      },
      {
        facetAddress: addresses[2],
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(ownershipFacet),
      },
      {
        facetAddress: addresses[3],
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(Test1Facet),
      },
      {
        facetAddress: addresses[4],
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(Test2Facet),
      },
    ];
    tx = await diamondCutFacet.diamondCut(
      cut,
      ethers.constants.AddressZero,
      "0x",
      { gasLimit: 8000000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    const facets = await (diamondLoupeFacet as DiamondLoupeFacet).facets();
    const facetAddresses = await diamondLoupeFacet.facetAddresses();
    assert.equal(facetAddresses.length, 5);
    assert.equal(facets.length, 5);
    assert.sameMembers(facetAddresses, addresses);
    assert.equal(facets[0][0], facetAddresses[0], "first facet");
    assert.equal(facets[1][0], facetAddresses[1], "second facet");
    assert.equal(facets[2][0], facetAddresses[2], "third facet");
    assert.equal(facets[3][0], facetAddresses[3], "fourth facet");
    assert.equal(facets[4][0], facetAddresses[4], "fifth facet");
    assert.sameMembers(
      facets[findAddressPositionInFacets(addresses[0], facets) as number][1],
      getSelectors(diamondCutFacet)
    );
    assert.sameMembers(
      facets[findAddressPositionInFacets(addresses[1], facets) as number][1],
      diamondLoupeFacetSelectors
    );
    assert.sameMembers(
      facets[findAddressPositionInFacets(addresses[2], facets) as number][1],
      getSelectors(ownershipFacet)
    );
    assert.sameMembers(
      facets[findAddressPositionInFacets(addresses[3], facets) as number][1],
      getSelectors(Test1Facet)
    );
    assert.sameMembers(
      facets[findAddressPositionInFacets(addresses[4], facets) as number][1],
      getSelectors(Test2Facet)
    );
      done();
  });
});
