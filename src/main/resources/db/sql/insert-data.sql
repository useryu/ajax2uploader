delete from S_ROLE_MENU;
DELETE FROM S_MENU;  
DELETE FROM S_USER;
DELETE FROM S_ROLE;


INSERT INTO S_ROLE VALUES (1,'管理员');
INSERT INTO S_ROLE VALUES (2,'操作员');


INSERT INTO S_USER (ID,USER_NO,PASSWORD,USER_NAME,ROLE_ID) VALUES (1,'admin','admin','admin',1);
INSERT INTO S_USER (ID,USER_NO,PASSWORD,USER_NAME,ROLE_ID) VALUES (2,'user','user','user',2);


INSERT INTO S_MENU (id, text, icon_Name, action, parent_id , orders) VALUES (2,'用户管理',NULL,NULL,NULL, 2);
INSERT INTO S_MENU (id, text, icon_Name, action, parent_id , orders) VALUES (21,'用户列表',NULL,'/users',2, 3);
INSERT INTO S_MENU (id, text, icon_Name, action, parent_id , orders) VALUES (22,'用户密码修改',NULL,'/resetpass',2, 4);
INSERT INTO S_MENU (id, text, icon_Name, action, parent_id , orders) VALUES (3,'订单打印',NULL,NULL,NULL, 5);
INSERT INTO S_MENU (id, text, icon_Name, action, parent_id , orders) VALUES (31,'打印出货单','ICON-EDIT','/order/printShipPaper',3, 6);
INSERT INTO S_MENU (id, text, icon_Name, action, parent_id , orders) VALUES (32,'打印物流单','ICON-ADD','/order/printLogisticPaper',3, 7);
INSERT INTO S_MENU (id, text, icon_Name, action, parent_id , orders) VALUES (33,'打印代发货','ICON-ADD','/order/printSupplyerShipPaper',3, 8);
INSERT INTO S_MENU (id, text, icon_Name, action, parent_id , orders) VALUES (4,'礼包管理',NULL,NULL,NULL, 8);
INSERT INTO S_MENU (id, text, icon_Name, action, parent_id , orders) VALUES (41,'礼包列表','ICON-EDIT','word_toTaskAssign',4, 9);

insert into S_ROLE_MENU (role_id, menu_id) values (2,3);
insert into S_ROLE_MENU (role_id, menu_id) values (2,31);
insert into S_ROLE_MENU (role_id, menu_id) values (2,32);
