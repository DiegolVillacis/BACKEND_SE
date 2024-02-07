import { log } from "console";
import { updateRedBlockchain, createRedBlockchain, readRedBlockchain } from "../security/cadenaBlock";

const SHA256 = require('crypto-js/sha256');

function  calcularHash(block: any) {
    return SHA256(
        block.index +
        block.timestamp +
        block.hashAnterior +
        JSON.stringify(block.data) +
        block.nonce
    ).toString()
}

class Block {
    
    public index: number;
    public hashAnterior: string;
    public timestamp: any;
    public data: any;
    public hash: string;
    public nonce: number;

    constructor(index: number, timestamp: any, data: any, hashAnterior = "") {
        this.index = index;
        this.hashAnterior = hashAnterior;
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = 0;
        this.hash = calcularHash(this);
    }
    

    minarBloque(dificultad: number) {
        while (this.hash.substring(0, dificultad) !== Array(dificultad + 1).join('0')) {
            this.nonce++;
            this.hash = calcularHash(this)
        }
    }
}

export class Blockchain {
    
    public chain: any = [];

    public dificultadMinado = 2;

    constructor() { }

    createBlockchain(filename: string) {
        const blockBlock = new Block(0, new Date().getTime(), 'Blockchain', "");
        blockBlock.minarBloque(this.dificultadMinado);
        createRedBlockchain(filename, JSON.stringify([blockBlock]));
    }

    async getDataArchivo(filename: string) {
        const datablockchain = await readRedBlockchain(filename);
        this.chain = datablockchain;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    createBlock(filename: string, data: any) {
        const ultimoBloque = this.getLastBlock();
        const nuevoBloque = new Block(
            ultimoBloque.index + 1, 
            new Date().getTime(),
            data,
            ultimoBloque.hash 
        );
        nuevoBloque.minarBloque(this.dificultadMinado); 
        this.addBlock(nuevoBloque, filename);
    }

    addBlock(nuevoBloque: any, filename: string) {
        const ultimoBloque = this.getLastBlock();

        if (ultimoBloque.index + 1 !== nuevoBloque.index) {
            log('Indice no valido');
        } else if (nuevoBloque.hashAnterior !== ultimoBloque.hash) {
            log('Hash anterior no corresponde');
        } else if (nuevoBloque.hash !== calcularHash(nuevoBloque)) {
            log('No minaste el bloque apropiadamente');            
        } else {
            this.chain.push(nuevoBloque);
            updateRedBlockchain(filename, JSON.stringify(this.chain))
        }
    }

    verVotos() {
        return this.chain;
    }
}











// import { log } from "console";
// import { updateRedBlockchain, createRedBlockchain, readRedBlockchain } from "../security/cadenaBlock";
// const SHA256 = require('crypto-js/sha256');

// class Block {
//     static currentNonce = 0;

//     public nonce: number;
//     public hash: string;

//     constructor(
//         public index: number,
//         public timestamp: any,
//         public data: any,
//         public hashAnterior: string = ""
//     ) {
//         this.nonce = this.minarBloque(2);
//         this.hash = this.calcularHash();
//     }

//     calcularHash(): string {
//         return SHA256(
//             this.index +
//             this.timestamp +
//             this.hashAnterior +
//             JSON.stringify(this.data) +
//             this.nonce
//         ).toString();
//     }

//     minarBloque(dificultad: number): number {
//         let nonce = 0;
//         while (this.hash.substring(0, dificultad) !== Array(dificultad + 1).join('0')) {
//             nonce++;
//             this.hash = this.calcularHash();
//         }
//         return nonce;
//     }
// }


// export class Blockchain {
//     public linkBlock: any = [];
//     public dificultadMinado = 2;

//     constructor() { }

//     createBlockchain(filename: string): void {
//         const firstBlock = new Block(0, new Date().getTime(), 'Blockchain');
//         this.minarYGuardarBloque(firstBlock, filename);
//     }
    
//     private minarYGuardarBloque(block: Block, filename: string): void {
//         block.minarBloque(this.dificultadMinado);
//         createRedBlockchain(filename, JSON.stringify([block]));
//     }

//     async getDataArchivo(filename: string): Promise<void> {
//         const dataBlockchain = await readRedBlockchain(filename);
//         this.linkBlock = dataBlockchain;
//     }

//     getLastBlock(): any {
//         return this.linkBlock[this.linkBlock.length - 1];
//     }

//     createBlock(filename: string, data: any): void {
//         const lastBlock = this.getLastBlock();

//         if (!lastBlock) {
//             log('No hay bloques en la cadena. Crea el bloque firstBlock primero.');
//             return;
//         }

//         const newBlock = new Block(
//             lastBlock.index + 1,
//             new Date().getTime(),
//             data,
//             lastBlock.hash
//         );

//         newBlock.minarBloque(this.dificultadMinado);
//         this.addBlock(newBlock, filename);
//     }
    
    

//     addBlock(newBlock: Block, filename: string): void {
//         const lastBlock = this.getLastBlock();
    
//         if (
//             newBlock.index !== lastBlock.index + 1 ||
//             newBlock.hashAnterior !== lastBlock.hash ||
//             newBlock.hash !== newBlock.calcularHash()
//         ) {
//             log('Validación de bloque fallida. El bloque no se añadió.');
//             return;
//         }
    
//         this.linkBlock.push(newBlock);
//         updateRedBlockchain(filename, JSON.stringify(this.linkBlock));
//         log('Bloque añadido correctamente a la cadena.');
//     }
    
    

//     verVotos(): any {
//         return this.linkBlock;
//     }
// }
