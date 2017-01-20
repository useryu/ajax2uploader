--CREATE DATABASE jinyu CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';
--grant all privileges on jinyu.* to jinyu@localhost identified by 'jinyu';

drop table if exists S_MENU;
drop table if exists S_ROLE;
drop table if exists S_ROLE_MENU;
drop table if exists S_USERS;

create table S_USER (id bigint not null auto_increment, user_No varchar(100) not null, password varchar(100) not null, user_Name varchar(50), department varchar(50), position varchar(50), email varchar(100), mobile varchar(100), office_tel varchar(100), family_tel varchar(100), other varchar(100), first_login datetime, last_login datetime, role_id bigint not null, primary key (id));
create table S_MENU (id bigint not null auto_increment, text varchar(100) not null, icon_Name varchar(100), action varchar(100), parent_id bigint, orders int, primary key (id));
create table S_ROLE (id bigint not null auto_increment, role_Name varchar(100) not null, primary key (id));
create table S_ROLE_MENU (role_id bigint not null, menu_id bigint not null, primary key (role_id, menu_id));



---供应商
drop table if exists `S_SUPPLYER`;
create table if not exists `S_SUPPLYER`(
	id bigint not null auto_increment,
	createDate datetime default null,
	modifyDate datetime default null,
	supply_name varchar(255) not null,
	contact varchar(255) not null,
	mobile varchar(255) not null,
	email varchar(255) default null,
	address varchar(255)  default null,
	website varchar(255) default null,
	primary key(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


---产品
drop table if exists `S_PRODUCTS`;
create table if not exists `S_PRODUCTS`(
	id bigint not null auto_increment,
	createDate datetime default null,
	modifyDate datetime default null,
	product_name varchar(255) not null,
	product_code varchar(32) not null,
	size varchar(50) default null,
	supply_id bigint not null,
	primary key (id),
	key `FK9C2397E7145FF3D4` (supply_id),
	constraint `FK9C2397E7145FF3D4` foreign key (supply_id) references S_SUPPLYER (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

---仓库管理
drop table if exists `S_RESPERTORY`;
create table if not exists `S_RESPERTORY`(
	id bigint not null auto_increment,
	createDate datetime default null,
	modifyDate datetime default null,
	product_id bigint not null,
	access_num int(5) not null,
	unit int(1) default 0 comment '0-袋，1-箱',
	operator varchar(255) not null,
	goto int(1) not null comment '0-销售，1-损耗，2-盘点',
	note text default null comment '备注，例如盘点信息',
	primary key(id),
	key `FK3454C9E613C6A52A` (product_id),
	constraint `FK3454C9E613C6A52A` foreign key (product_id) references S_PRODUCTS (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


---套餐
drop table if exists `S_SETMEAL`;
create table if not exists `S_SETMEAL`(
	id bigint not null auto_increment,
	createDate datetime default null,
	modifyDate datetime default null,
	setMeal_name varchar(255) not null,
	setMeal_code varchar(255) not null,
	primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

----套餐--产品
drop table if exists `S_SETMEAL_PRODUCT`;
create table if not exists `S_SETMEAL_PRODUCT`(
	id bigint not null auto_increment,
	setMeal_id bigint not null,
	product_id bigint not null,
	product_num int not null,
	primary key(id),
	key `FK0584C9C413C6A52A` (setMeal_id),
	key `FK9634C9E666C6E00A` (product_id),
	constraint `FK0584C9C413C6A52A` foreign key (setMeal_id) references S_SETMEAL (id),
	constraint `FK9634C9E666C6E00A` foreign key (product_id) references S_PRODUCTS (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

