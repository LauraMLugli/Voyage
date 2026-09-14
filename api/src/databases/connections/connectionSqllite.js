import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
dotenv.config();

const DB_DATABASE = process.env.DB_DATABASE || 'mysql';


// Esta função abre a conexão com o arquivo local 'database.db'
export const getDbConnection = async () => {
    return open({
        filename: `./${DB_DATABASE}.db`, // O arquivo será criado na raiz do projeto
        driver: sqlite3.Database
    });
};