require('dotenv').config();

module.exports = {
    development: {
        username: process.env.RDS_USER,
        password: process.env.RDS_PWD,
        database: process.env.RDS_DB,
        host: process.env.RDS_HOST,
        port: 5432,
        dialect: "postgres",
        dialectOptions: {
            ssl:"Amazon RDS"
        },
        operatorsAliases: false
    }
}