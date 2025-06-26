const CONTRACT_ADDRESS = "0x44B9925F68D82A03CC3e1B1e76FA647c8685b710";

const ABI = [
  {
    "inputs": [],
    "name": "gacha",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "gachaBatch",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();
        document.getElementById("walletAddress").innerText = `Wallet: ${address}`;
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        loadBalances();
    } else {
        alert("Please install MetaMask");
    }
}

document.getElementById("connect").addEventListener("click", connectWallet);

async function gacha() {
    try {
        const tx = await contract.gacha({ value: 0 });
        await tx.wait();
        alert("Gacha sukses!");
        loadBalances();
    } catch (err) {
        console.error(err);
        alert("Gagal gacha");
    }
}

async function gachaBatch(amount) {
    try {
        const tx = await contract.gachaBatch(amount, { value: 0 });
        await tx.wait();
        alert(`Gacha ${amount}x sukses!`);
        loadBalances();
    } catch (err) {
        console.error(err);
        alert("Gagal gacha batch");
    }
}

async function loadBalances() {
    try {
        const address = await signer.getAddress();
        const balances = [];
        for (let i = 1; i <= 5; i++) {
            const balance = await contract.balanceOf(address, i);
            balances.push(`ID ${i}: ${balance.toString()}`);
        }
        document.getElementById("nftBalances").innerHTML = balances.join("<br>");
    } catch (err) {
        console.error(err);
    }
}
