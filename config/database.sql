-- wcc.access_control definition

CREATE TABLE `access_control` (
  `acc_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` char(5) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `permission` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `grant_date` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `revoke_date` datetime DEFAULT NULL,
  PRIMARY KEY (`acc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;

-- wcc.asset_companys definition

CREATE TABLE `asset_companys` (
  `amc_id` int(5) NOT NULL AUTO_INCREMENT,
  `amc_name` char(200) DEFAULT NULL,
  `short_name` char(10) DEFAULT NULL,
  `fund_code` char(200) DEFAULT NULL,
  `fund_name` varchar(500) DEFAULT NULL,
  `selling_fee` decimal(10,4) DEFAULT NULL,
  `lastUpdate` datetime DEFAULT NULL,
  `sharing` float(10,4) DEFAULT NULL,
  PRIMARY KEY (`amc_id`),
  UNIQUE KEY `fund_code` (`fund_code`)
) ENGINE=MyISAM AUTO_INCREMENT=1420 DEFAULT CHARSET=utf8;

-- wcc.employees definition

CREATE TABLE `employees` (
  `employee_id` char(10) NOT NULL,
  `name_th` char(100) DEFAULT NULL,
  `lastname_th` char(100) DEFAULT NULL,
  `name_eng` char(100) DEFAULT NULL,
  `lastname_eng` char(100) DEFAULT NULL,
  `department` char(100) DEFAULT NULL,
  `position` char(100) DEFAULT NULL,
  `ic_code` char(5) DEFAULT NULL,
  `licence_id` char(10) DEFAULT NULL,
  `licence_type` char(20) DEFAULT NULL,
  `licence_exp` date DEFAULT NULL,
  `email` char(200) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` char(1) DEFAULT NULL,
  `type` char(10) DEFAULT NULL,
  `team` char(5) DEFAULT NULL,
  `target` int(20) DEFAULT NULL,
  `trailing_fee` float(12,2) DEFAULT NULL,
  `deatil` text,
  PRIMARY KEY (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- wcc.investors definition

CREATE TABLE `investors` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `cardID` varchar(10) NOT NULL,
  `citizenID` varchar(13) NOT NULL,
  `firstNameTH` varchar(100) NOT NULL,
  `lastNameTH` varchar(100) NOT NULL,
  `firstNameENG` varchar(100) NOT NULL,
  `lastNameENG` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `dateOfBirth` date NOT NULL,
  `expireDate` date NOT NULL,
  `sex` char(1) NOT NULL,
  `cardIssuer` varchar(255) NOT NULL,
  `issueDate` date NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `photoPath` varchar(255) NOT NULL,
  `signaturePath` varchar(255) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cardID` (`cardID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- wcc.sessions definition

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- wcc.system_wcc definition

CREATE TABLE `system_wcc` (
  `system_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(100) DEFAULT NULL,
  PRIMARY KEY (`system_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- wcc.transactions definition

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_date` datetime DEFAULT NULL,
  `account_id` char(7) DEFAULT NULL,
  `unitholder_id` char(20) DEFAULT NULL,
  `type` char(3) DEFAULT NULL,
  `customer_name` char(255) DEFAULT NULL,
  `transaction_type` char(3) DEFAULT NULL,
  `registrar_flag` char(1) DEFAULT NULL,
  `fund_code` char(50) DEFAULT NULL,
  `isin` char(15) DEFAULT NULL,
  `cut_off_time` char(15) DEFAULT NULL,
  `currency` char(3) DEFAULT NULL,
  `amount` decimal(15,4) DEFAULT NULL,
  `unit` decimal(15,4) DEFAULT NULL,
  `sell_all_unit` char(1) DEFAULT NULL,
  `status` char(15) DEFAULT NULL,
  `confirmed_amount` decimal(15,4) DEFAULT NULL,
  `confirmed_units` decimal(15,4) DEFAULT NULL,
  `effective_date` date DEFAULT NULL,
  `settlement_date` date DEFAULT NULL,
  `transaction_id` char(16) NOT NULL,
  `payment_type` char(10) DEFAULT NULL,
  `bank` char(10) DEFAULT NULL,
  `bank_account` char(20) DEFAULT NULL,
  `approval_code` char(20) DEFAULT NULL,
  `cheque_date` date DEFAULT NULL,
  `cheque_no` char(10) DEFAULT NULL,
  `cheque_branch` char(10) DEFAULT NULL,
  `reject_reason` varchar(255) DEFAULT NULL,
  `amc_code` char(15) DEFAULT NULL,
  `pt` char(1) DEFAULT NULL,
  `ic` char(10) DEFAULT NULL,
  `ic_branch` char(5) DEFAULT NULL,
  `approver` char(100) DEFAULT NULL,
  `last_update` datetime DEFAULT NULL,
  `referral` varchar(255) DEFAULT NULL,
  `settlement_bank` char(15) DEFAULT NULL,
  `settlement_bank_account` char(15) DEFAULT NULL,
  `allotment_date` date DEFAULT NULL,
  `nav_date` date DEFAULT NULL,
  `investor_payment_intructor` char(5) DEFAULT NULL,
  `investor_payment_status` char(10) DEFAULT NULL,
  `fund_settlement_flag` char(1) DEFAULT NULL,
  `finnet_processing_type` char(1) DEFAULT NULL,
  `order_referral` char(10) DEFAULT NULL,
  `recurring_flag` char(1) DEFAULT NULL,
  `sa_recurring_order_reference_no` char(40) DEFAULT NULL,
  `fee` decimal(15,4) DEFAULT NULL,
  `withholding_tax` decimal(15,4) DEFAULT NULL,
  `vat` decimal(15,4) DEFAULT NULL,
  `bcp` char(1) DEFAULT NULL,
  `channel` char(3) DEFAULT NULL,
  `reason_to_sell` varchar(255) DEFAULT NULL,
  `allotted_nav` decimal(15,4) DEFAULT NULL,
  `order_ref` varchar(255) DEFAULT NULL,
  `order_reference` varchar(100) DEFAULT NULL,
  `team` varchar(50) DEFAULT NULL,
  `auto_redeem_fund_code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5089 DEFAULT CHARSET=utf8;

-- wcc.users definition

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` char(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` int(1) DEFAULT '0' COMMENT '0 is disable ,1 is active,2 is request new password',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4402 DEFAULT CHARSET=utf8;

CREATE TABLE `rm_jobs` (
  `job_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` char(255) NOT NULL,
  `customer_id` char(13),
  `customer_type` char(2) NOT NULL,
  `ic` char(5) NOT NULL,
  `text` text NOT NULL,
  `target` int(15),
  `created` datetime NOT NULL,
  `updated` datetime,
  `status` char(10),
  `approver` char(5),
  `enable` boolean,
  
  PRIMARY KEY (`job_id`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;