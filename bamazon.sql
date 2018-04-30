
DROP DATABASE IF EXISTS bama_DB;
CREATE DATABASE bama_DB;

USE bama_DB;

CREATE TABLE buy(
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(45) NOT NULL,
  price INT(10) default 0,
  quantity INT(10),
  PRIMARY KEY (id)
);