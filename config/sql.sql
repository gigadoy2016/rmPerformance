delete from transactions where transaction_date BETWEEN  STR_TO_DATE('2023-05-01 00:01','%Y-%m-%d %H:%i') AND STR_TO_DATE('2023-05-30 23:00','%Y-%m-%d %H:%i');

pm2 start app.js
pm2 stop 0
pm2 restart 0
pm2 list

CREATE TABLE amc_sharing (
  id INT NOT NULL AUTO_INCREMENT,
  amc_id CHAR(10),
  sharing DECIMAL(10,4),
  create_date DATE,
  last_update DATETIME,
  month char(2),
  activated BOOLEAN,
  PRIMARY KEY (id)
);

[
    {
        "transaction_date": "10/05/2023 11:18",
        "transaction_type": "SWO",
        "fund_code": "KT-INDIA-A",
        "account_id": "OM00059",
        "status": "WAITING"
    },
    {
        "transaction_date": "10/05/2023 11:18",
        "transaction_type": "SWI",
        "fund_code": "KTSS",
        "account_id": "OM00059",
        "status": "WAITING"
    },
	{
        "transaction_date": "10/05/2023 11:18",
        "transaction_type": "SWI",
        "fund_code": "KTSS",
        "account_id": "OM00059",
        "status": "ALLOTTED"
    }
]

const allottedTransactions = data.filter((transaction) => transaction.status === 'ALLOTTED');
const waitingTransactions = data.filter((transaction) => transaction.status === 'WAITING');

fundconnext.com/api/files/20230515/CustomerProfile.zip