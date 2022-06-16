/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Test1Facet, Test1FacetInterface } from "../../facets/Test1Facet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "something",
        type: "address",
      },
    ],
    name: "TestEvent",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_interfaceID",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func10",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func11",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func12",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func13",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func14",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func15",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func16",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func17",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func18",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func19",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func3",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func4",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func5",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func6",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func7",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func8",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "test1Func9",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610359806100206000396000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c806351b68a4d116100b85780639abf97aa1161007c5780639abf97aa146101f8578063b0e8fcc714610202578063cbb835f61461020c578063cd0bae0914610216578063cf3bbe1814610220578063db32da151461022a57610137565b806351b68a4d146101c657806371a99d6f146101d057806377e9d0d6146101da57806381b5207d146101e457806387952d22146101ee57610137565b806324c1d5a7116100ff57806324c1d5a714610194578063292c460d1461019e5780632cb83248146101a85780634484b3b9146101b257806350eb3f43146101bc57610137565b806301ffc9a71461013c5780630716c2ae1461016c578063110460471461017657806319c841ab1461018057806319e3b5331461018a575b600080fd5b610156600480360381019061015191906102c0565b610234565b6040516101639190610308565b60405180910390f35b61017461023b565b005b61017e61023d565b005b61018861023f565b005b610192610241565b005b61019c610243565b005b6101a6610245565b005b6101b0610247565b005b6101ba610249565b005b6101c461024b565b005b6101ce61024d565b005b6101d861024f565b005b6101e2610251565b005b6101ec610253565b005b6101f6610255565b005b610200610257565b005b61020a610259565b005b61021461025b565b005b61021e61025d565b005b61022861025f565b005b610232610261565b005b6000919050565b565b565b565b565b565b565b565b565b565b565b565b565b565b565b565b565b565b565b565b565b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61029d81610268565b81146102a857600080fd5b50565b6000813590506102ba81610294565b92915050565b6000602082840312156102d6576102d5610263565b5b60006102e4848285016102ab565b91505092915050565b60008115159050919050565b610302816102ed565b82525050565b600060208201905061031d60008301846102f9565b9291505056fea2646970667358221220d50ab79107ccd82aafa1f27296abb6cd9e94d84b68e0e2d51dd184e99c2873c664736f6c634300080d0033";

type Test1FacetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: Test1FacetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Test1Facet__factory extends ContractFactory {
  constructor(...args: Test1FacetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Test1Facet> {
    return super.deploy(overrides || {}) as Promise<Test1Facet>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Test1Facet {
    return super.attach(address) as Test1Facet;
  }
  override connect(signer: Signer): Test1Facet__factory {
    return super.connect(signer) as Test1Facet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Test1FacetInterface {
    return new utils.Interface(_abi) as Test1FacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Test1Facet {
    return new Contract(address, _abi, signerOrProvider) as Test1Facet;
  }
}
