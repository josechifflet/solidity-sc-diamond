import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import deployDiamond from "../scripts/deploy";
import { Contract } from "ethers";
import { FacetCutAction } from "../scripts/libraries/diamond";

chai.use(solidity);
const { expect } = chai;

describe("Cache Bug test", async () => {
  let diamondLoupeFacet: Contract;
  let test1Facet: Contract;

  const zeroAddress = "0x0000000000000000000000000000000000000000";
  const ownerSel = "0x8da5cb5b";
  const sel0 = "0x19e3b533"; // fills up slot 1
  const sel1 = "0x0716c2ae"; // fills up slot 1
  const sel2 = "0x11046047"; // fills up slot 1
  const sel3 = "0xcf3bbe18"; // fills up slot 1
  const sel4 = "0x24c1d5a7"; // fills up slot 1
  const sel5 = "0xcbb835f6"; // fills up slot 1
  const sel6 = "0xcbb835f7"; // fills up slot 1
  const sel7 = "0xcbb835f8"; // fills up slot 2
  const sel8 = "0xcbb835f9"; // fills up slot 2
  const sel9 = "0xcbb835fa"; // fills up slot 2
  const sel10 = "0xcbb835fb"; // fills up slot 2
  let selectors = [
    sel0,
    sel1,
    sel2,
    sel3,
    sel4,
    sel5,
    sel6,
    sel7,
    sel8,
    sel9,
    sel10,
  ];

  before(async () => {
    const diamondAddress = await deployDiamond();
    const diamondCutFacet = await ethers.getContractAt(
      "DiamondCutFacet",
      diamondAddress
    );
    diamondLoupeFacet = await ethers.getContractAt(
      "DiamondLoupeFacet",
      diamondAddress
    );
    const Test1Facet = await ethers.getContractFactory("Test1Facet");
    test1Facet = await Test1Facet.deploy();
    await test1Facet.deployed();

    // Add functions
    await diamondCutFacet.diamondCut(
      [
        {
          action: FacetCutAction.Add,
          facetAddress: test1Facet.address,
          functionSelectors: selectors,
        },
      ],
      zeroAddress,
      "0x",
      { gasLimit: 800000 }
    );

    // Remove function selectors
    // Function selector for the owner function in slot 0
    const removeSelectors = [
      ownerSel, // owner selector
      sel5,
      sel10,
    ];

    await diamondCutFacet.diamondCut(
      [
        {
          action: FacetCutAction.Remove,
          facetAddress: zeroAddress,
          functionSelectors: removeSelectors,
        },
      ],
      zeroAddress,
      "0x",
      { gasLimit: 800000 }
    );
  });

  it("should not exhibit the cache bug", async () => {
    // Get the test1Facet's registered functions
    selectors = await diamondLoupeFacet.facetFunctionSelectors(
      test1Facet.address
    );

    // Check individual correctness
    expect(selectors.includes(sel0)).is.true;
    expect(selectors.includes(sel1)).is.true;
    expect(selectors.includes(sel2)).is.true;
    expect(selectors.includes(sel3)).is.true;
    expect(selectors.includes(sel4)).is.true;
    expect(selectors.includes(sel6)).is.true;
    expect(selectors.includes(sel7)).is.true;
    expect(selectors.includes(sel8)).is.true;
    expect(selectors.includes(sel9)).is.true;

    expect(selectors.includes(sel10)).is.false;
    expect(selectors.includes(sel5)).is.false;
    expect(selectors.includes(ownerSel)).is.false;
  });
});
