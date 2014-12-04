drop table SA_USERS purge; 
-- Create table
create table SA_USERS
(
  staff_id   NUMBER,
  staff_name VARCHAR2(64),
  passwd varchar2(32),
  org_id     NUMBER,
  staff_type NUMBER,
  create_time date
);

-- Add comments to the columns 
comment on column SA_USERS.staff_type
  is '1:普通员工,2:经理';

select * from SA_USERS for update;

commit;

/*
属性版本编码
属性名称
数据周期
分析框架编码
分析框架名称
属性分类编码
属性分类名称
绑定维层编码
绑定维层名称
业务描述
敏感等级
加密策略
物理表编码
物理表中文名称
物理表名称
物理表字段
*/
create table sa_users
(
  staff_id    NUMBER,
  staff_name  VARCHAR2(64),
  passwd      varchar2(32),
  org_id      NUMBER,
  staff_type  NUMBER,
  create_time date
);

create table sa_cfg_frame
(
  fcode varchar2(64),
  fname varchar2(64),
  fdesc varchar2(4000)
);

insert into sa_cfg_frame (fcode, fname) values ('F00001', '个人客户');
insert into sa_cfg_frame (fcode, fname) values ('F00002', '集团客户');
insert into sa_cfg_frame (fcode, fname) values ('F00003', '家庭客户');
commit;

select * from sa_cfg_frame;

create table sa_cfg_table
(
  fcode     varchar2(64),
  tcode     varchar2(64),
  tname     varchar2(64),
  tname_cn  varchar2(64),
  tdesc     varchar2(4000),
  cycle_type  number(1) --1,按日;2,按月
);


insert into sa_cfg_table
  (fcode, tcode, tname, tname_cn, cycle_type)
values
  ('F00001', 'T0001', 'FT_MID_USER_DAILY', '用户基础信息-日表', 1);
insert into sa_cfg_table
  (fcode, tcode, tname, tname_cn, cycle_type)
values
  ('F00001', 'T0002', 'FT_MID_USER_MONTH', '用户基础信息-月表', 2);
commit;

create table sa_cfg_column
(
  tcode varchar2(64),
  ccode varchar2(64),
  attr_code varchar2(64),
  cname varchar2(64),
  cname_cn varchar2(64),
  ctype number,  --1,数值类型;2,字符串;3,时间
  cdesc varchar2(4000),
  sensitive_type number, --敏感等级
  dcode number
);

create table sa_cfg_dim (
  dcode varchar2(64),
  dname varchar2(64),
  dscript varchar2(4000),
  priv_id number,
  class_id number
);

