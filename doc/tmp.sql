select distinct t0.user_id as s00000000568
  from xdmiddle.ft_mid_user_daily t0
 where 1 = 1
   and t0.home_code in ((select distinct call_town_group1_code
                          from xdmart.dim_home_town
                         where call_town_group1_code != 0
                           and call_town_group1_code != 590
                           and call_town_group1_code = 594))
   and t0.sum_date = 20141115
   and t0.msisdn in (select value_id from nldpe_in10015751);
select t1.msisdn      as s0000000055320141115,
       t1.create_date as s0000000051020141115,
       t1.home_county as s0000000052220141115,
       t1.brand_id    as s0000000110420141115,
       t1.user_status as s0000000056920141115,
       t0.*
  from nldpe_temp_s_10187884_x1 t0
  left join xdmiddle.ft_mid_user_daily t1
    on t0.s00000000568 = t1.user_id
   and 1 = 1
   and t1.sum_date = 20141115;
select t1.total_gprs_data as s00000001544201410, t0.*
  from nldpe_temp_s_10187885_y_1 t0
  left join xdmiddle.ft_mid_flux_monitor_month t1
    on t0.s00000000568 = t1.user_id
   and 1 = 1
   and t1.sum_month = 201410;
select t1.sum_fee as s00000000563201410, t0.*
  from nldpe_temp_s_10187886_y_2 t0
  left join xdmiddle.ft_mid_user_info_month t1
    on t0.s00000000568 = t1.user_id
   and 1 = 1
   and t1.sum_month = 201410;
select distinct (s0000000051020141115) nk_194377,
                (s0000000055320141115) nk_194378,
                (s0000000052220141115) nk_194379,
                (s0000000110420141115) nk_194380,
                (s0000000056920141115) nk_194381,
                (s00000001544201410) nk_194382,
                (s00000000563201410) nk_194383
  from nldpe_temp_s_10187887_y_3
 where s0000000055320141115 in (select value_id from nldpe_in10015752);


select distinct t0.user_id as s00000000568
  from xdmiddle.ft_mid_user_daily t0
  join xdmiddle.ft_mid_user_daily t11
    on 1101 = 1101
   and t11.sum_date = 20141103
   and t0.user_status = t11.user_status
   and t0.msisdn = t11.msisdn
   and t0.user_id = t11.user_id
 where 1 = 1
   and t0.home_code in ((select distinct call_town_group1_code
                          from xdmart.dim_home_town
                         where call_town_group1_code != 0
                           and call_town_group1_code != 590
                           and call_town_group1_code = 594))
   and t0.sum_date = 20141031
   and t0.msisdn = 13850263232
   and t11.user_status in
       (select distinct dim_value
          from (select dim_value,
                       dim_value_desc as dim_value_cn,
                       dim_value      as parent_dim_value
                  from (select distinct 'L00000000637' dim_level_id,
                                        to_char(t.status_id) as dim_value,
                                        t.status_desc dim_value_desc,
                                        to_char(t.status_id) as order_id,
                                        1 value_is_current,
                                        sysdate value_eff_date,
                                        sysdate + 1 value_invalid_date
                          from xdmart.dim_user_status t)
                 where ((value_eff_date <= sysdate and value_is_current = 1) or
                       (value_eff_date <= sysdate and
                       value_invalid_date > sysdate)))
         where parent_dim_value in ('5'));
select t1.msisdn as s0000000055320141031, t0.*
  from nldpe_temp_s_10207793_x1 t0
  left join xdmiddle.ft_mid_user_daily t1
    on t0.s00000000568 = t1.user_id
   and 1 = 1
   and t1.sum_date = 20141031;
select t1.user_status as s0000000056920141103,
       t1.home_town   as s0000000052320141103,
       t1.brand_id    as s0000000110420141103,
       t1.msisdn      as s0000000055320141103,
       t0.*
  from nldpe_temp_s_10207794_y_1 t0
  left join xdmiddle.ft_mid_user_daily t1
    on t0.s00000000568 = t1.user_id
   and 1 = 1
   and t1.sum_date = 20141103;
select distinct (s0000000055320141103) nk_177087,
                (s0000000052320141103) nk_177088,
                (s0000000110420141103) nk_177089,
                (s0000000056920141103) nk_177090
  from nldpe_temp_s_10207795_y_2
 where s0000000055320141031 = 13850263232
   and s0000000056920141103 in
       (select distinct dim_value
          from (select dim_value,
                       dim_value_desc as dim_value_cn,
                       dim_value      as parent_dim_value
                  from (select distinct 'L00000000637' dim_level_id,
                                        to_char(t.status_id) as dim_value,
                                        t.status_desc dim_value_desc,
                                        to_char(t.status_id) as order_id,
                                        1 value_is_current,
                                        sysdate value_eff_date,
                                        sysdate + 1 value_invalid_date
                          from xdmart.dim_user_status t)
                 where ((value_eff_date <= sysdate and value_is_current = 1) or
                       (value_eff_date <= sysdate and
                       value_invalid_date > sysdate)))
         where parent_dim_value in ('5'));


select distinct 'L00000000637' dim_level_id,
                to_char(t.status_id) as dim_value,
                t.status_desc dim_value_desc,
                to_char(t.status_id) as order_id,
                1 value_is_current,
                sysdate value_eff_date,
                sysdate + 1 value_invalid_date
  from dim_user_status@tomart t;


select distinct t0.family_account as s00000000370
  from xdmiddle.ft_mid_fam_cus_view_month t0
 where 1 = 1
   and t0.sum_month = 201410
   and t0.is_valid_family in
       (select distinct dim_value
          from (select t.dim_value,
                       t.dim_value_desc as dim_value_cn,
                       t.dim_value      as parent_dim_value
                  from st_dim_value_dictionary t
                 where t.dim_level_id = 'L00000000421'
                   and ((value_eff_date <= sysdate and value_is_current = 1)
                        　or(value_eff_date <= sysdate and
                            value_invalid_date > sysdate)))
         where parent_dim_value in ('1'));
select t1.is_valid_family as s00000000379201410,
       t1.cell_id         as s00000000364201410,
       t0.*
  from nldpe_temp_s_10207789_x1 t0
  left join xdmiddle.ft_mid_fam_cus_view_month t1
    on t0.s00000000370 = t1.family_account
   and 1 = 1
   and t1.sum_month = 201410;
select t1.msisdn as s00000000553201410, t0.*
  from nldpe_temp_s_10207790_y_1 t0
  left join xdmiddle.ft_mid_fam_mem_view_month t1
    on t0.s00000000370 = t1.family_account
   and 1 = 1
   and t1.sum_month = 201410;
select distinct (s00000000553201410) nk_215430,
                (s00000000379201410) nk_215431,
                (s00000000364201410) nk_215432
  from nldpe_temp_s_10207791_y_2
 where s00000000379201410 in
       (select distinct dim_value
          from (select t.dim_value,
                       t.dim_value_desc as dim_value_cn,
                       t.dim_value      as parent_dim_value
                  from st_dim_value_dictionary t
                 where t.dim_level_id = 'L00000000421'
                   and ((value_eff_date <= sysdate and value_is_current = 1)
                        　or(value_eff_date <= sysdate and
                            value_invalid_date > sysdate)))
         where parent_dim_value in ('1'));
