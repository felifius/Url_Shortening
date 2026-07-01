import { Client } from "pg";

export const con = new Client({
    host:"localhost",
    user:"postgres",
    port: 5432,
    password:"Feli1402",
    database:"urlshort"
});

