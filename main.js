import { TonClient, WalletContractV4 } from '@ton/ton';
import { mnemonicNew, mnemonicToPrivateKey } from '@ton/crypto';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = (question) => {
    return new Promise((resolve) => rl.question(question, resolve));
};

async function createWallets(numberOfWallets) {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    let walletData = '';

    for (let i = 0; i < numberOfWallets; i++) {
        try {
            =
            const mnemonics = await mnemonicNew();
            console.log('Mnemonic:', mnemonics);

            
            const keyPair = await mnemonicToPrivateKey(mnemonics);
            if (!keyPair || !keyPair.secretKey || !keyPair.publicKey) {
                throw new Error('Failed to generate key pair.');
            }

            console.log('Private Key:', keyPair.secretKey.toString('hex'));
            console.log('Public Key:', keyPair.publicKey.toString('hex'));

            
            const workchain = 0; // 
            const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });

            // Collect data in the desired format
            walletData += `wallet${i + 1} [\n`;
            walletData += `Mnemonic : ${mnemonics.join(' ')}\n`;
            walletData += `PublicKey : ${keyPair.publicKey.toString('hex')}\n`;
            walletData += `PrivateKey : ${keyPair.secretKey.toString('hex')}\n`;
            walletData += `]\n\n`;
        } catch (error) {
            console.error(`Error creating wallet ${i + 1}:`, error);
        }
    }

    
    fs.writeFileSync('wallets_details.txt', walletData, 'utf8');

    console.log('Wallet details saved to file wallets_details.txt.');
}


async function main() {
    const numberOfWallets = parseInt(await prompt('Berapa banyak wallet yang ingin dibuat? '), 10);
    if (isNaN(numberOfWallets) || numberOfWallets <= 0) {
        console.log('Jumlah wallet tidak valid. Masukkan angka positif.');
        rl.close();
        return;
    }

    await createWallets(numberOfWallets);
    rl.close();
}

main().catch(console.error);
