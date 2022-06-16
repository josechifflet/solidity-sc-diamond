import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { IDiamondLoupe } from "../../typechain";

export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

/**
 * get function selectors from ABI
 * @param {Contract} contract
 * @returns {string}
 */
export const getSelectors = (contract: Contract | ContractFactory) => {
  const signatures: string[] = Object.keys(contract.interface.functions);
  const selectors = signatures.reduce((acc, val) => {
    if (val !== "init(bytes)") acc.push(contract.interface.getSighash(val));
    return acc;
  }, [] as string[]);

  return selectors;
};

/**
 * get function selector from function signature
 * @param {string} func function signature
 * @returns {string}
 */
export const getSelector = (func: string): string => {
  const abiInterface = new ethers.utils.Interface([func]);
  return abiInterface.getSighash(ethers.utils.Fragment.from(func));
};

// remove selectors using an array of signatures
export const removeSelectors = (selectors: string[], signatures: string[]) => {
  const iface = new ethers.utils.Interface(
    signatures.map((v) => "function " + v)
  );
  const removeSelectors = signatures.map((v) => iface.getSighash(v));
  selectors = selectors.filter((v) => !removeSelectors.includes(v));
  return selectors;
};

// find a particular address position in the return value of diamondLoupeFacet.facets()
export const findAddressPositionInFacets = (
  facetAddress: string,
  facets: IDiamondLoupe.FacetStructOutput[]
) => {
  for (let i = 0; i < facets.length; i++) {
    if (facets[i].facetAddress === facetAddress) {
      return i;
    }
  }
};
