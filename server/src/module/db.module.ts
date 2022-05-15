import { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } from '../config';
import { Connection, FieldInfo } from "mysql";
import mysql from 'mysql';

export class DbModule {
    constructor() {
    }

    private connection: Connection;

    public init() {
        return new Promise<Connection>((resolve, reject) => {
            const connection = mysql.createConnection({
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD,
                database: DB_DATABASE,
                port: DB_PORT
            });
            connection.connect(err => {
                if (err) {
                    reject(err);
                    return;
                }
                this.connection = connection;
                resolve();
            });
        });
    }

    public query(a, b?) {
        return new Promise<any>((resolve, reject) => {
            const callback = (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            };
            if (a && b) {
                this.connection.query(a, b, callback);
            }
            else if (a && !b) {
                this.connection.query(a, callback);
            }
        });
    }
}