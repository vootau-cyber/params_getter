# Task 1: Schema vs Seed JSON Field Comparison Report

Generated: 2026-08-06T12:52:56.449Z

---

## Section: `sti` ✅

### Seed JSON fields (27):
- `qdrant_ownership_tag` [qdrant_*]
- `qdrant_sti_type_tag` [qdrant_*]
- `sti_egrip_date`
- `sti_egrl_date`
- `sti_email`
- `sti_full_name`
- `sti_head_fio`
- `sti_head_position`
- `sti_inn`
- `sti_ip_address`
- `sti_ip_fio`
- `sti_ip_inn`
- `sti_ip_ogrnip`
- `sti_kpp`
- `sti_legal_address`
- `sti_narrative_description`
- `sti_ogrn`
- `sti_okpo`
- `sti_person_address`
- `sti_person_fio`
- `sti_person_inn`
- `sti_phone`
- `sti_postal_address`
- `sti_regulatory_triggers`
- `sti_short_name`
- `sti_target_doc_sections`
- `sti_website`

### Schema non-virtual fields (27):
- `qdrant_ownership_tag` [qdrant_*]
- `qdrant_sti_type_tag` [qdrant_*]
- `sti_egrip_date`
- `sti_egrl_date`
- `sti_email`
- `sti_full_name`
- `sti_head_fio`
- `sti_head_position`
- `sti_inn`
- `sti_ip_address`
- `sti_ip_fio`
- `sti_ip_inn`
- `sti_ip_ogrnip`
- `sti_kpp`
- `sti_legal_address`
- `sti_narrative_description`
- `sti_ogrn`
- `sti_okpo`
- `sti_person_address`
- `sti_person_fio`
- `sti_person_inn`
- `sti_phone`
- `sti_postal_address`
- `sti_regulatory_triggers`
- `sti_short_name`
- `sti_target_doc_sections`
- `sti_website`

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `sti_licenses` ✅

### Seed JSON fields (8):
- `license_classes`
- `license_date`
- `license_is_active`
- `license_num`
- `license_objects_approval`
- `license_term`
- `license_type`
- `sti_ref` [*_ref]

### Schema non-virtual fields (8):
- `license_classes`
- `license_date`
- `license_is_active`
- `license_num`
- `license_objects_approval`
- `license_term`
- `license_type`
- `sti_ref` [*_ref]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `oti` ✅

### Seed JSON fields (35):
- `developer_org`
- `oti_area_ha`
- `oti_berth_front_len`
- `oti_berths_count`
- `oti_category`
- `oti_category_assign_date`
- `oti_center_lat`
- `oti_center_lon`
- `oti_change_basis`
- `oti_change_date`
- `oti_checkpoint_type`
- `oti_exclude_basis`
- `oti_exclude_date`
- `oti_full_name`
- `oti_imo_code`
- `oti_location`
- `oti_narrative_description`
- `oti_new_category`
- `oti_purpose`
- `oti_registry_basis`
- `oti_registry_entry_date`
- `oti_registry_num`
- `oti_regulatory_triggers`
- `oti_review_basis`
- `oti_review_date`
- `oti_short_name`
- `oti_target_doc_sections`
- `port_facility_name`
- `port_name`
- `qdrant_climate_zone_tag` [qdrant_*]
- `qdrant_doc_section_id` [qdrant_*]
- `qdrant_hydrology_risk_tag` [qdrant_*]
- `qdrant_oti_category_tag` [qdrant_*]
- `sti_ref` [*_ref]
- `survey_date`

### Schema non-virtual fields (35):
- `developer_org`
- `oti_area_ha`
- `oti_berth_front_len`
- `oti_berths_count`
- `oti_category`
- `oti_category_assign_date`
- `oti_center_lat`
- `oti_center_lon`
- `oti_change_basis`
- `oti_change_date`
- `oti_checkpoint_type`
- `oti_exclude_basis`
- `oti_exclude_date`
- `oti_full_name`
- `oti_imo_code`
- `oti_location`
- `oti_narrative_description`
- `oti_new_category`
- `oti_purpose`
- `oti_registry_basis`
- `oti_registry_entry_date`
- `oti_registry_num`
- `oti_regulatory_triggers`
- `oti_review_basis`
- `oti_review_date`
- `oti_short_name`
- `oti_target_doc_sections`
- `port_facility_name`
- `port_name`
- `qdrant_climate_zone_tag` [qdrant_*]
- `qdrant_doc_section_id` [qdrant_*]
- `qdrant_hydrology_risk_tag` [qdrant_*]
- `qdrant_oti_category_tag` [qdrant_*]
- `sti_ref` [*_ref]
- `survey_date`

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `persons` ✅

### Seed JSON fields (24):
- `oti_ref` [*_ref]
- `person_attestation_category`
- `person_attestation_date`
- `person_attestation_exp_date`
- `person_attestation_issuing_body`
- `person_attestation_num`
- `person_attestation_num_date`
- `person_attestation_reestr_num`
- `person_education`
- `person_email`
- `person_fax`
- `person_fio`
- `person_is_active`
- `person_mob_phone`
- `person_narrative_description`
- `person_order`
- `person_position`
- `person_role`
- `person_target_doc_sections`
- `person_training`
- `person_work_phone`
- `persons_regulatory_triggers`
- `qdrant_person_role_tag` [qdrant_*]
- `sti_ref` [*_ref]

### Schema non-virtual fields (24):
- `oti_ref` [*_ref]
- `person_attestation_category`
- `person_attestation_date`
- `person_attestation_exp_date`
- `person_attestation_issuing_body`
- `person_attestation_num`
- `person_attestation_num_date`
- `person_attestation_reestr_num`
- `person_education`
- `person_email`
- `person_fax`
- `person_fio`
- `person_is_active`
- `person_mob_phone`
- `person_narrative_description`
- `person_order`
- `person_position`
- `person_role`
- `person_target_doc_sections`
- `person_training`
- `person_work_phone`
- `persons_regulatory_triggers`
- `qdrant_person_role_tag` [qdrant_*]
- `sti_ref` [*_ref]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `assessments` ✅

### Seed JSON fields (13):
- `assessment_authority`
- `assessment_date_approval`
- `assessment_date_conduct`
- `assessment_narrative_description`
- `assessment_number`
- `assessment_plan_ref` [*_ref]
- `assessment_regulatory_triggers`
- `assessment_status`
- `assessment_target_doc_sections`
- `assessment_type`
- `assessment_validity_period`
- `oti_ref` [*_ref]
- `qdrant_assessment_type_tag` [qdrant_*]

### Schema non-virtual fields (13):
- `assessment_authority`
- `assessment_date_approval`
- `assessment_date_conduct`
- `assessment_narrative_description`
- `assessment_number`
- `assessment_plan_ref` [*_ref]
- `assessment_regulatory_triggers`
- `assessment_status`
- `assessment_target_doc_sections`
- `assessment_type`
- `assessment_validity_period`
- `oti_ref` [*_ref]
- `qdrant_assessment_type_tag` [qdrant_*]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `security_plans` ✅

### Seed JSON fields (14):
- `oti_ref` [*_ref]
- `plan_assessment_ref` [*_ref]
- `plan_authority`
- `plan_date_approval`
- `plan_end_conduct_date`
- `plan_implementation_status`
- `plan_narrative_description`
- `plan_number`
- `plan_regulatory_triggers`
- `plan_start_conduct_date`
- `plan_status`
- `plan_target_doc_sections`
- `plan_type`
- `qdrant_plan_type_tag` [qdrant_*]

### Schema non-virtual fields (14):
- `oti_ref` [*_ref]
- `plan_assessment_ref` [*_ref]
- `plan_authority`
- `plan_date_approval`
- `plan_end_conduct_date`
- `plan_implementation_status`
- `plan_narrative_description`
- `plan_number`
- `plan_regulatory_triggers`
- `plan_start_conduct_date`
- `plan_status`
- `plan_target_doc_sections`
- `plan_type`
- `qdrant_plan_type_tag` [qdrant_*]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `land` ✅

### Seed JSON fields (16):
- `area_sqm`
- `cadastre_number`
- `encumbrances`
- `is_flood_zone`
- `land_lease_term`
- `land_narrative_description`
- `land_regulatory_triggers`
- `land_target_doc_sections`
- `lease_contract_num`
- `lease_end_date`
- `oti_ref` [*_ref]
- `owner`
- `qdrant_flood_risk_tag` [qdrant_*]
- `qdrant_soil_type_tag` [qdrant_*]
- `soil_type`
- `vegetation`

### Schema non-virtual fields (16):
- `area_sqm`
- `cadastre_number`
- `encumbrances`
- `is_flood_zone`
- `land_lease_term`
- `land_narrative_description`
- `land_regulatory_triggers`
- `land_target_doc_sections`
- `lease_contract_num`
- `lease_end_date`
- `oti_ref` [*_ref]
- `owner`
- `qdrant_flood_risk_tag` [qdrant_*]
- `qdrant_soil_type_tag` [qdrant_*]
- `soil_type`
- `vegetation`

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `land_summary` ✅

### Seed JSON fields (7):
- `land_lease_term_summary`
- `land_narrative_description`
- `land_regulatory_triggers`
- `land_target_doc_sections`
- `oti_ref` [*_ref]
- `qdrant_flood_risk_tag` [qdrant_*]
- `qdrant_soil_type_tag` [qdrant_*]

### Schema non-virtual fields (7):
- `land_lease_term_summary`
- `land_narrative_description`
- `land_regulatory_triggers`
- `land_target_doc_sections`
- `oti_ref` [*_ref]
- `qdrant_flood_risk_tag` [qdrant_*]
- `qdrant_soil_type_tag` [qdrant_*]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `aquatories` ⚠️

### Seed JSON fields (17):
- `aquatory_area_sqm`
- `aquatory_bottom_type`
- `aquatory_current_speed_ms`
- `aquatory_depths`
- `aquatory_depths_max_m`
- `aquatory_depths_min_m`
- `aquatory_ice_regime`
- `aquatory_narrative_description`
- `aquatory_patrol_requirement`
- `aquatory_regulatory_triggers`
- `aquatory_security_implication`
- `aquatory_target_doc_sections`
- `fairways_anchorages`
- `fairways_anchorages_details`
- `oti_ref` [*_ref]
- `points`
- `qdrant_ice_regime_tag` [qdrant_*]

### Schema non-virtual fields (23):
- `aquatory_area_sqm`
- `aquatory_bottom_type`
- `aquatory_current_speed_ms`
- `aquatory_depths`
- `aquatory_depths_max_m`
- `aquatory_depths_min_m`
- `aquatory_ice_regime`
- `aquatory_narrative_description`
- `aquatory_patrol_requirement`
- `aquatory_regulatory_triggers`
- `aquatory_security_implication`
- `aquatory_target_doc_sections`
- `fairways_anchorages`
- `fairways_anchorages_details`
- `lat`
- `lat_decimal`
- `lon`
- `lon_decimal`
- `oti_ref` [*_ref]
- `p`
- `point_number`
- `points`
- `qdrant_ice_regime_tag` [qdrant_*]

### Schema virtual fields (0):
(none)

### Discrepancies:
**In schema (non-virtual) but NOT in seed (6):**
- `lat`
- `lat_decimal`
- `lon`
- `lon_decimal`
- `p`
- `point_number`

---

## Section: `cargo` ✅

### Seed JSON fields (18):
- `berth_infra_ref` [*_ref]
- `berth_name`
- `cargo_name`
- `cargo_narrative_description`
- `cargo_regulatory_triggers`
- `cargo_target_doc_sections`
- `features`
- `imo_class`
- `is_dangerous`
- `max_weight_per_ship_t`
- `oti_ref` [*_ref]
- `packaging_type`
- `qdrant_cargo_type_tag` [qdrant_*]
- `qdrant_dangerous_cargo_tag` [qdrant_*]
- `qdrant_imo_class_tag` [qdrant_*]
- `season_end`
- `season_start`
- `un_number`

### Schema non-virtual fields (18):
- `berth_infra_ref` [*_ref]
- `berth_name`
- `cargo_name`
- `cargo_narrative_description`
- `cargo_regulatory_triggers`
- `cargo_target_doc_sections`
- `features`
- `imo_class`
- `is_dangerous`
- `max_weight_per_ship_t`
- `oti_ref` [*_ref]
- `packaging_type`
- `qdrant_cargo_type_tag` [qdrant_*]
- `qdrant_dangerous_cargo_tag` [qdrant_*]
- `qdrant_imo_class_tag` [qdrant_*]
- `season_end`
- `season_start`
- `un_number`

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `cargo_summary` ⚠️

### Seed JSON fields (12):
- `cargo_dangerous_list`
- `cargo_general`
- `cargo_general_list`
- `cargo_narrative_description`
- `cargo_regulatory_triggers`
- `cargo_target_doc_sections`
- `dangerous_cargo_context`
- `dangerous_cargo_regulatory`
- `oti_ref` [*_ref]
- `qdrant_cargo_type_tag` [qdrant_*]
- `qdrant_dangerous_cargo_tag` [qdrant_*]
- `qdrant_imo_class_tag` [qdrant_*]

### Schema non-virtual fields (21):
- `berth_name`
- `cargo_dangerous_list`
- `cargo_general`
- `cargo_general_list`
- `cargo_narrative_description`
- `cargo_regulatory_triggers`
- `cargo_target_doc_sections`
- `dangerous_cargo_context`
- `dangerous_cargo_regulatory`
- `features`
- `imo_class`
- `max_weight_per_ship_t`
- `name`
- `oti_ref` [*_ref]
- `packaging_type`
- `qdrant_cargo_type_tag` [qdrant_*]
- `qdrant_dangerous_cargo_tag` [qdrant_*]
- `qdrant_imo_class_tag` [qdrant_*]
- `season_end`
- `season_start`
- `un_number`

### Schema virtual fields (0):
(none)

### Discrepancies:
**In schema (non-virtual) but NOT in seed (9):**
- `berth_name`
- `features`
- `imo_class`
- `max_weight_per_ship_t`
- `name`
- `packaging_type`
- `season_end`
- `season_start`
- `un_number`

---

## Section: `cargo_turnover` ✅

### Seed JSON fields (9):
- `coasting_ships`
- `foreign_ships`
- `is_current_period`
- `oti_ref` [*_ref]
- `period_date`
- `river_ships`
- `ships`
- `tons`
- `year`

### Schema non-virtual fields (9):
- `coasting_ships`
- `foreign_ships`
- `is_current_period`
- `oti_ref` [*_ref]
- `period_date`
- `river_ships`
- `ships`
- `tons`
- `year`

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `oti_operations` ✅

### Seed JSON fields (11):
- `brigade_size`
- `brigade_size_day`
- `brigade_size_night`
- `is_bunkering`
- `is_passenger_ops`
- `is_unaccompanied_baggage`
- `max_people_on_oti`
- `max_people_on_oti_includes`
- `operation_mode`
- `operation_mode_shift_type`
- `oti_ref` [*_ref]

### Schema non-virtual fields (11):
- `brigade_size`
- `brigade_size_day`
- `brigade_size_night`
- `is_bunkering`
- `is_passenger_ops`
- `is_unaccompanied_baggage`
- `max_people_on_oti`
- `max_people_on_oti_includes`
- `operation_mode`
- `operation_mode_shift_type`
- `oti_ref` [*_ref]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `opo` ⚠️

### Seed JSON fields (10):
- `opo_accident_scenarios`
- `opo_basis`
- `opo_hazard_class`
- `opo_name`
- `opo_narrative_description`
- `opo_pmla_exists`
- `opo_registry_num`
- `opo_regulatory_triggers`
- `opo_target_doc_sections`
- `oti_ref` [*_ref]

### Schema non-virtual fields (13):
- `description`
- `max_explosion_weight_t`
- `opo_accident_scenarios`
- `opo_basis`
- `opo_hazard_class`
- `opo_name`
- `opo_narrative_description`
- `opo_pmla_exists`
- `opo_registry_num`
- `opo_regulatory_triggers`
- `opo_target_doc_sections`
- `oti_ref` [*_ref]
- `scenario_id`

### Schema virtual fields (0):
(none)

### Discrepancies:
**In schema (non-virtual) but NOT in seed (3):**
- `description`
- `max_explosion_weight_t`
- `scenario_id`

---

## Section: `infrastructure` ✅

### Seed JSON fields (44):
- `area_sqm`
- `berth_fender_type`
- `building_fire_resistance`
- `building_floors`
- `building_foundation`
- `building_purpose`
- `capacity_unit`
- `capacity_value`
- `cargo_packaging_type`
- `cargo_type`
- `connected_to_infra_ref` [*_ref]
- `connected_to_name`
- `depth_m`
- `equipment_brand_model`
- `equipment_installation_type`
- `equipment_operational_status`
- `fence_type`
- `has_access_control`
- `height_m`
- `ice_regime`
- `is_backup`
- `is_critical_element`
- `is_restricted_area`
- `length_m`
- `located_on_infra_ref` [*_ref]
- `located_on_name`
- `material`
- `max_vessel_draft_m`
- `narrative_description`
- `obj_name`
- `obj_type`
- `operational_context`
- `oti_ref` [*_ref]
- `perimeter_m`
- `quantity`
- `soil_type`
- `source_doc_ref` [*_ref]
- `surface_type`
- `throughput_summer`
- `throughput_winter`
- `vessel_ice_class`
- `vessel_type`
- `voltage_kw`
- `width_m`

### Schema non-virtual fields (44):
- `area_sqm`
- `berth_fender_type`
- `building_fire_resistance`
- `building_floors`
- `building_foundation`
- `building_purpose`
- `capacity_unit`
- `capacity_value`
- `cargo_packaging_type`
- `cargo_type`
- `connected_to_infra_ref` [*_ref]
- `connected_to_name`
- `depth_m`
- `equipment_brand_model`
- `equipment_installation_type`
- `equipment_operational_status`
- `fence_type`
- `has_access_control`
- `height_m`
- `ice_regime`
- `is_backup`
- `is_critical_element`
- `is_restricted_area`
- `length_m`
- `located_on_infra_ref` [*_ref]
- `located_on_name`
- `material`
- `max_vessel_draft_m`
- `narrative_description`
- `obj_name`
- `obj_type`
- `operational_context`
- `oti_ref` [*_ref]
- `perimeter_m`
- `quantity`
- `soil_type`
- `source_doc_ref` [*_ref]
- `surface_type`
- `throughput_summer`
- `throughput_winter`
- `vessel_ice_class`
- `vessel_type`
- `voltage_kw`
- `width_m`

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `critical_elements` ✅

### Seed JSON fields (6):
- `ce_protection`
- `ce_security_implication`
- `critical_element`
- `critical_element_ce_infra_ref` [*_ref]
- `oti_ref` [*_ref]
- `qdrant_ce_protection_tag` [qdrant_*]

### Schema non-virtual fields (6):
- `ce_protection`
- `ce_security_implication`
- `critical_element`
- `critical_element_ce_infra_ref` [*_ref]
- `oti_ref` [*_ref]
- `qdrant_ce_protection_tag` [qdrant_*]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `restricted_access_zones` ✅

### Seed JSON fields (5):
- `oti_ref` [*_ref]
- `rod_isps_compliance`
- `rod_name`
- `rod_name_rod_infra_ref` [*_ref]
- `rod_regime`

### Schema non-virtual fields (5):
- `oti_ref` [*_ref]
- `rod_isps_compliance`
- `rod_name`
- `rod_name_rod_infra_ref` [*_ref]
- `rod_regime`

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `zoning` ⚠️

### Seed JSON fields (21):
- `ce_protection`
- `ce_security_implication`
- `critical_element`
- `critical_element_ce_infra_ref` [*_ref]
- `is_zop_established`
- `oti_ref` [*_ref]
- `qdrant_security_zone_tag` [qdrant_*]
- `rod_isps_compliance`
- `rod_name`
- `rod_name_rod_infra_ref` [*_ref]
- `rod_regime`
- `sector_free_access`
- `sector_technological`
- `sector_transit`
- `security_zone_air`
- `security_zone_ground`
- `security_zone_status`
- `security_zone_water`
- `ztb_boundaries`
- `ztb_regulatory_triggers`
- `ztb_target_doc_sections`

### Schema non-virtual fields (19):
- `E`
- `NE`
- `SW`
- `W`
- `critical_element_ref` [*_ref]
- `is_zop_established`
- `oti_ref` [*_ref]
- `qdrant_security_zone_tag` [qdrant_*]
- `rod_ref` [*_ref]
- `sector_free_access`
- `sector_technological`
- `sector_transit`
- `security_zone_air`
- `security_zone_ground`
- `security_zone_status`
- `security_zone_water`
- `ztb_boundaries`
- `ztb_regulatory_triggers`
- `ztb_target_doc_sections`

### Schema virtual fields (0):
(none)

### Discrepancies:
**In seed but NOT in schema (8):**
- `ce_protection`
- `ce_security_implication`
- `critical_element`
- `critical_element_ce_infra_ref`
- `rod_isps_compliance`
- `rod_name`
- `rod_name_rod_infra_ref`
- `rod_regime`

**In schema (non-virtual) but NOT in seed (6):**
- `E`
- `NE`
- `SW`
- `W`
- `critical_element_ref`
- `rod_ref`

---

## Section: `ptb` ✅

### Seed JSON fields (11):
- `ptb_accreditation_date`
- `ptb_accreditation_exp_date`
- `ptb_accreditation_num`
- `ptb_name`
- `ptb_narrative_description`
- `ptb_oti_ref` [*_ref]
- `ptb_regulatory_triggers`
- `ptb_target_doc_sections`
- `qdrant_gbr_exists_tag` [qdrant_*]
- `qdrant_ptb_accreditation_tag` [qdrant_*]
- `sti_ref` [*_ref]

### Schema non-virtual fields (11):
- `ptb_accreditation_date`
- `ptb_accreditation_exp_date`
- `ptb_accreditation_num`
- `ptb_name`
- `ptb_narrative_description`
- `ptb_oti_ref` [*_ref]
- `ptb_regulatory_triggers`
- `ptb_target_doc_sections`
- `qdrant_gbr_exists_tag` [qdrant_*]
- `qdrant_ptb_accreditation_tag` [qdrant_*]
- `sti_ref` [*_ref]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `ptb_contracts` ✅

### Seed JSON fields (9):
- `contract_date`
- `contract_exp_date`
- `contract_is_maintenance`
- `contract_name`
- `contract_num`
- `is_prolonged`
- `prolongation_date`
- `prolongation_new_exp_date`
- `ptb_ref` [*_ref]

### Schema non-virtual fields (9):
- `contract_date`
- `contract_exp_date`
- `contract_is_maintenance`
- `contract_name`
- `contract_num`
- `is_prolonged`
- `prolongation_date`
- `prolongation_new_exp_date`
- `ptb_ref` [*_ref]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `ptb_supplementary_agreements` ✅

### Seed JSON fields (7):
- `agreement_date`
- `agreement_description`
- `agreement_exp_date`
- `agreement_name`
- `agreement_num`
- `agreement_type`
- `contract_ref` [*_ref]

### Schema non-virtual fields (7):
- `agreement_date`
- `agreement_description`
- `agreement_exp_date`
- `agreement_name`
- `agreement_num`
- `agreement_type`
- `contract_ref` [*_ref]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `maintenance_contracts` ✅

### Seed JSON fields (9):
- `contract_date`
- `contract_exp_date`
- `contract_is_active`
- `contract_name`
- `contract_num`
- `contract_provider`
- `contract_scope`
- `oti_ref` [*_ref]
- `ptb_ref` [*_ref]

### Schema non-virtual fields (9):
- `contract_date`
- `contract_exp_date`
- `contract_is_active`
- `contract_name`
- `contract_num`
- `contract_provider`
- `contract_scope`
- `oti_ref` [*_ref]
- `ptb_ref` [*_ref]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `posts` ✅

### Seed JSON fields (13):
- `post_is_additional`
- `post_is_temporary`
- `post_is_uav_counter`
- `post_location`
- `post_location_infra_ref` [*_ref]
- `post_name`
- `post_regime`
- `post_special_conditions`
- `post_staff_count`
- `post_tasks`
- `post_type`
- `ptb_ref` [*_ref]
- `qdrant_gbr_exists_tag` [qdrant_*]

### Schema non-virtual fields (13):
- `post_is_additional`
- `post_is_temporary`
- `post_is_uav_counter`
- `post_location`
- `post_location_infra_ref` [*_ref]
- `post_name`
- `post_regime`
- `post_special_conditions`
- `post_staff_count`
- `post_tasks`
- `post_type`
- `ptb_ref` [*_ref]
- `qdrant_gbr_exists_tag` [qdrant_*]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `post_staff` ✅

### Seed JSON fields (12):
- `post_ref` [*_ref]
- `staff_attestation_category`
- `staff_attestation_date`
- `staff_attestation_exp_date`
- `staff_attestation_num`
- `staff_fio`
- `staff_has_uav_authority`
- `staff_is_active`
- `staff_position`
- `staff_security_level_1`
- `staff_security_level_2`
- `staff_security_level_3`

### Schema non-virtual fields (12):
- `post_ref` [*_ref]
- `staff_attestation_category`
- `staff_attestation_date`
- `staff_attestation_exp_date`
- `staff_attestation_num`
- `staff_fio`
- `staff_has_uav_authority`
- `staff_is_active`
- `staff_position`
- `staff_security_level_1`
- `staff_security_level_2`
- `staff_security_level_3`

### Schema virtual fields (1):
- `_v_person_ref`

### Discrepancies: None ✅

---

## Section: `post_equipment` ✅

### Seed JSON fields (13):
- `equipment_brand_model`
- `equipment_category`
- `equipment_certification_date`
- `equipment_certification_doc_scan`
- `equipment_certification_exp_date`
- `equipment_certification_num`
- `equipment_is_certified_pp969`
- `equipment_name`
- `equipment_narrative_context`
- `equipment_qty`
- `equipment_service_exp_date`
- `post_ref` [*_ref]
- `qdrant_gbr_exists_tag` [qdrant_*]

### Schema non-virtual fields (13):
- `equipment_brand_model`
- `equipment_category`
- `equipment_certification_date`
- `equipment_certification_doc_scan`
- `equipment_certification_exp_date`
- `equipment_certification_num`
- `equipment_is_certified_pp969`
- `equipment_name`
- `equipment_narrative_context`
- `equipment_qty`
- `equipment_service_exp_date`
- `post_ref` [*_ref]
- `qdrant_gbr_exists_tag` [qdrant_*]

### Schema virtual fields (1):
- `_v_catalog_tsotb_ref`

### Discrepancies: None ✅

---

## Section: `tsotb_catalog` ✅

### Seed JSON fields (15):
- `catalog_category_tsotb`
- `catalog_climate_tag`
- `catalog_default_detection_range_m`
- `catalog_default_identification_range_m`
- `catalog_display_name`
- `catalog_functions_tags`
- `catalog_manufacturer`
- `catalog_model`
- `catalog_narrative_template`
- `catalog_operating_temp_max_c`
- `catalog_operating_temp_min_c`
- `catalog_power_consumption_w`
- `catalog_pp969_required`
- `catalog_regulatory_triggers`
- `catalog_target_doc_sections`

### Schema non-virtual fields (15):
- `catalog_category_tsotb`
- `catalog_climate_tag`
- `catalog_default_detection_range_m`
- `catalog_default_identification_range_m`
- `catalog_display_name`
- `catalog_functions_tags`
- `catalog_manufacturer`
- `catalog_model`
- `catalog_narrative_template`
- `catalog_operating_temp_max_c`
- `catalog_operating_temp_min_c`
- `catalog_power_consumption_w`
- `catalog_pp969_required`
- `catalog_regulatory_triggers`
- `catalog_target_doc_sections`

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `tsotb_instances` ✅

### Seed JSON fields (34):
- `catalog_tsotb_ref` [*_ref]
- `oti_ref` [*_ref]
- `qdrant_certified_pp969_tag` [qdrant_*]
- `qdrant_climate_resistance_tag` [qdrant_*]
- `qdrant_tsotb_category_tag` [qdrant_*]
- `qdrant_tsotb_function_tag` [qdrant_*]
- `tsotb_certification_date`
- `tsotb_certification_doc_hash`
- `tsotb_certification_doc_scan`
- `tsotb_certification_exp_date`
- `tsotb_certification_issuing_body`
- `tsotb_certification_num`
- `tsotb_certification_scope`
- `tsotb_compliance_check_result`
- `tsotb_installation_date`
- `tsotb_is_certified_pp969`
- `tsotb_last_maintenance_date`
- `tsotb_location_infra_ref` [*_ref]
- `tsotb_location_name`
- `tsotb_maintenance_contract_ref` [*_ref]
- `tsotb_monitors_infra_ref` [*_ref]
- `tsotb_monitors_object_name`
- `tsotb_narrative_description`
- `tsotb_operational_context`
- `tsotb_operational_status`
- `tsotb_post_ref` [*_ref]
- `tsotb_powered_from_infra_ref` [*_ref]
- `tsotb_powered_from_name`
- `tsotb_quantity`
- `tsotb_regulatory_triggers`
- `tsotb_security_implication`
- `tsotb_serial_num`
- `tsotb_service_exp_date`
- `tsotb_target_doc_sections`

### Schema non-virtual fields (34):
- `catalog_tsotb_ref` [*_ref]
- `oti_ref` [*_ref]
- `qdrant_certified_pp969_tag` [qdrant_*]
- `qdrant_climate_resistance_tag` [qdrant_*]
- `qdrant_tsotb_category_tag` [qdrant_*]
- `qdrant_tsotb_function_tag` [qdrant_*]
- `tsotb_certification_date`
- `tsotb_certification_doc_hash`
- `tsotb_certification_doc_scan`
- `tsotb_certification_exp_date`
- `tsotb_certification_issuing_body`
- `tsotb_certification_num`
- `tsotb_certification_scope`
- `tsotb_compliance_check_result`
- `tsotb_installation_date`
- `tsotb_is_certified_pp969`
- `tsotb_last_maintenance_date`
- `tsotb_location_infra_ref` [*_ref]
- `tsotb_location_name`
- `tsotb_maintenance_contract_ref` [*_ref]
- `tsotb_monitors_infra_ref` [*_ref]
- `tsotb_monitors_object_name`
- `tsotb_narrative_description`
- `tsotb_operational_context`
- `tsotb_operational_status`
- `tsotb_post_ref` [*_ref]
- `tsotb_powered_from_infra_ref` [*_ref]
- `tsotb_powered_from_name`
- `tsotb_quantity`
- `tsotb_regulatory_triggers`
- `tsotb_security_implication`
- `tsotb_serial_num`
- `tsotb_service_exp_date`
- `tsotb_target_doc_sections`

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `eng_catalog` ✅

### Seed JSON fields (20):
- `eng_catalog_category`
- `eng_catalog_climate_tag`
- `eng_catalog_default_bottom_depth_m`
- `eng_catalog_default_height_m`
- `eng_catalog_default_intrusion_delay_min`
- `eng_catalog_default_load_capacity_t`
- `eng_catalog_default_material`
- `eng_catalog_default_thickness_mm`
- `eng_catalog_default_top_height_m`
- `eng_catalog_display_name`
- `eng_catalog_functions`
- `eng_catalog_gost_reference`
- `eng_catalog_manufacturer`
- `eng_catalog_model`
- `eng_catalog_narrative_template`
- `eng_catalog_pp969_applicable`
- `eng_catalog_regulatory_triggers`
- `eng_catalog_target_doc_sections`
- `qdrant_eng_category_tag` [qdrant_*]
- `qdrant_eng_function_tag` [qdrant_*]

### Schema non-virtual fields (20):
- `eng_catalog_category`
- `eng_catalog_climate_tag`
- `eng_catalog_default_bottom_depth_m`
- `eng_catalog_default_height_m`
- `eng_catalog_default_intrusion_delay_min`
- `eng_catalog_default_load_capacity_t`
- `eng_catalog_default_material`
- `eng_catalog_default_thickness_mm`
- `eng_catalog_default_top_height_m`
- `eng_catalog_display_name`
- `eng_catalog_functions`
- `eng_catalog_gost_reference`
- `eng_catalog_manufacturer`
- `eng_catalog_model`
- `eng_catalog_narrative_template`
- `eng_catalog_pp969_applicable`
- `eng_catalog_regulatory_triggers`
- `eng_catalog_target_doc_sections`
- `qdrant_eng_category_tag` [qdrant_*]
- `qdrant_eng_function_tag` [qdrant_*]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `eng_instances` ✅

### Seed JSON fields (60):
- `catalog_eng_ref` [*_ref]
- `eng_instance_airlock_capacity`
- `eng_instance_bottom_depth_m`
- `eng_instance_bottom_exists`
- `eng_instance_bottom_gost_compliance`
- `eng_instance_bottom_material`
- `eng_instance_bottom_type`
- `eng_instance_bottom_width_m`
- `eng_instance_compliance_check_result`
- `eng_instance_defects_description`
- `eng_instance_has_access_control`
- `eng_instance_has_barbed_wire`
- `eng_instance_has_top_obstacle`
- `eng_instance_installation_date`
- `eng_instance_intrusion_delay_min`
- `eng_instance_is_seasonal`
- `eng_instance_last_inspection_date`
- `eng_instance_length_m`
- `eng_instance_load_capacity_t`
- `eng_instance_location_infra_ref` [*_ref]
- `eng_instance_location_name`
- `eng_instance_locking_type`
- `eng_instance_main_gost_compliance`
- `eng_instance_main_height_m`
- `eng_instance_main_is_removable`
- `eng_instance_main_material`
- `eng_instance_main_thickness_mm`
- `eng_instance_main_type`
- `eng_instance_maintenance_contract_ref` [*_ref]
- `eng_instance_name`
- `eng_instance_next_inspection_date`
- `eng_instance_operational_context`
- `eng_instance_operational_status`
- `eng_instance_platform_vehicle_capacity`
- `eng_instance_protection_level`
- `eng_instance_protects_ce`
- `eng_instance_protects_ce_infra_ref` [*_ref]
- `eng_instance_protects_rod`
- `eng_instance_protects_rod_infra_ref` [*_ref]
- `eng_instance_quantity`
- `eng_instance_regulatory_triggers`
- `eng_instance_seasonal_removal_period`
- `eng_instance_security_implication`
- `eng_instance_segment_number`
- `eng_instance_serial_num`
- `eng_instance_target_doc_sections`
- `eng_instance_top_angle_deg`
- `eng_instance_top_exists`
- `eng_instance_top_gost_compliance`
- `eng_instance_top_height_m`
- `eng_instance_top_material`
- `eng_instance_top_type`
- `eng_instance_total_height_m`
- `eng_instance_window_protection_type`
- `oti_ref` [*_ref]
- `qdrant_ce_protection_tag` [qdrant_*]
- `qdrant_eng_condition_tag` [qdrant_*]
- `qdrant_eng_gost_tag` [qdrant_*]
- `qdrant_eng_material_tag` [qdrant_*]
- `qdrant_eng_seasonal_tag` [qdrant_*]

### Schema non-virtual fields (60):
- `catalog_eng_ref` [*_ref]
- `eng_instance_airlock_capacity`
- `eng_instance_bottom_depth_m`
- `eng_instance_bottom_exists`
- `eng_instance_bottom_gost_compliance`
- `eng_instance_bottom_material`
- `eng_instance_bottom_type`
- `eng_instance_bottom_width_m`
- `eng_instance_compliance_check_result`
- `eng_instance_defects_description`
- `eng_instance_has_access_control`
- `eng_instance_has_barbed_wire`
- `eng_instance_has_top_obstacle`
- `eng_instance_installation_date`
- `eng_instance_intrusion_delay_min`
- `eng_instance_is_seasonal`
- `eng_instance_last_inspection_date`
- `eng_instance_length_m`
- `eng_instance_load_capacity_t`
- `eng_instance_location_infra_ref` [*_ref]
- `eng_instance_location_name`
- `eng_instance_locking_type`
- `eng_instance_main_gost_compliance`
- `eng_instance_main_height_m`
- `eng_instance_main_is_removable`
- `eng_instance_main_material`
- `eng_instance_main_thickness_mm`
- `eng_instance_main_type`
- `eng_instance_maintenance_contract_ref` [*_ref]
- `eng_instance_name`
- `eng_instance_next_inspection_date`
- `eng_instance_operational_context`
- `eng_instance_operational_status`
- `eng_instance_platform_vehicle_capacity`
- `eng_instance_protection_level`
- `eng_instance_protects_ce`
- `eng_instance_protects_ce_infra_ref` [*_ref]
- `eng_instance_protects_rod`
- `eng_instance_protects_rod_infra_ref` [*_ref]
- `eng_instance_quantity`
- `eng_instance_regulatory_triggers`
- `eng_instance_seasonal_removal_period`
- `eng_instance_security_implication`
- `eng_instance_segment_number`
- `eng_instance_serial_num`
- `eng_instance_target_doc_sections`
- `eng_instance_top_angle_deg`
- `eng_instance_top_exists`
- `eng_instance_top_gost_compliance`
- `eng_instance_top_height_m`
- `eng_instance_top_material`
- `eng_instance_top_type`
- `eng_instance_total_height_m`
- `eng_instance_window_protection_type`
- `oti_ref` [*_ref]
- `qdrant_ce_protection_tag` [qdrant_*]
- `qdrant_eng_condition_tag` [qdrant_*]
- `qdrant_eng_gost_tag` [qdrant_*]
- `qdrant_eng_material_tag` [qdrant_*]
- `qdrant_eng_seasonal_tag` [qdrant_*]

### Schema virtual fields (0):
(none)

### Discrepancies: None ✅

---

## Section: `climate_context` ⚠️

### Seed JSON fields (20):
- `climate_hydro_description`
- `climate_narrative_description`
- `climate_target_doc_sections`
- `climate_zone`
- `compliance_result`
- `hydro_flood_risk`
- `intruders_ranking`
- `isps_compliance`
- `max_casualties`
- `max_damage_rub`
- `neighbor_interaction_type`
- `neighbor_objects`
- `oti_ref` [*_ref]
- `project_intruder_model`
- `qdrant_climate_zone_tag` [qdrant_*]
- `qdrant_compliance_tag` [qdrant_*]
- `qdrant_flood_risk_tag` [qdrant_*]
- `temp_min_c`
- `threats_ranking`
- `wind_max_ms`

### Schema non-virtual fields (25):
- `climate_hydro_description`
- `climate_narrative_description`
- `climate_target_doc_sections`
- `climate_zone`
- `compliance_result`
- `dist`
- `emergency`
- `hydro_flood_risk`
- `intruders_ranking`
- `isps_compliance`
- `max_casualties`
- `max_damage_rub`
- `name`
- `neighbor_interaction_type`
- `neighbor_objects`
- `operational`
- `oti_ref` [*_ref]
- `physical`
- `project_intruder_model`
- `qdrant_climate_zone_tag` [qdrant_*]
- `qdrant_compliance_tag` [qdrant_*]
- `qdrant_flood_risk_tag` [qdrant_*]
- `temp_min_c`
- `threats_ranking`
- `wind_max_ms`

### Schema virtual fields (0):
(none)

### Discrepancies:
**In schema (non-virtual) but NOT in seed (5):**
- `dist`
- `emergency`
- `name`
- `operational`
- `physical`

---

## Summary

- Total sections checked: 30
- Total discrepancies found: 37

### All `qdrant_*` fields (by section):
- **sti**: `qdrant_sti_type_tag`, `qdrant_ownership_tag`
- **oti**: `qdrant_doc_section_id`, `qdrant_climate_zone_tag`, `qdrant_hydrology_risk_tag`, `qdrant_oti_category_tag`
- **persons**: `qdrant_person_role_tag`
- **assessments**: `qdrant_assessment_type_tag`
- **security_plans**: `qdrant_plan_type_tag`
- **land**: `qdrant_flood_risk_tag`, `qdrant_soil_type_tag`
- **land_summary**: `qdrant_flood_risk_tag`, `qdrant_soil_type_tag`
- **aquatories**: `qdrant_ice_regime_tag`
- **cargo**: `qdrant_cargo_type_tag`, `qdrant_dangerous_cargo_tag`, `qdrant_imo_class_tag`
- **cargo_summary**: `qdrant_cargo_type_tag`, `qdrant_dangerous_cargo_tag`, `qdrant_imo_class_tag`
- **critical_elements**: `qdrant_ce_protection_tag`
- **zoning**: `qdrant_security_zone_tag`
- **ptb**: `qdrant_ptb_accreditation_tag`, `qdrant_gbr_exists_tag`
- **posts**: `qdrant_gbr_exists_tag`
- **post_equipment**: `qdrant_gbr_exists_tag`
- **tsotb_instances**: `qdrant_tsotb_category_tag`, `qdrant_certified_pp969_tag`, `qdrant_tsotb_function_tag`, `qdrant_climate_resistance_tag`
- **eng_catalog**: `qdrant_eng_category_tag`, `qdrant_eng_function_tag`
- **eng_instances**: `qdrant_eng_material_tag`, `qdrant_eng_gost_tag`, `qdrant_eng_seasonal_tag`, `qdrant_eng_condition_tag`, `qdrant_ce_protection_tag`
- **climate_context**: `qdrant_climate_zone_tag`, `qdrant_flood_risk_tag`, `qdrant_compliance_tag`

### All `*_ref` fields (by section):
- **sti_licenses**: `sti_ref`
- **oti**: `sti_ref`
- **persons**: `sti_ref`, `oti_ref`
- **assessments**: `oti_ref`, `assessment_plan_ref`
- **security_plans**: `oti_ref`, `plan_assessment_ref`
- **land**: `oti_ref`
- **land_summary**: `oti_ref`
- **aquatories**: `oti_ref`
- **cargo**: `oti_ref`, `berth_infra_ref`
- **cargo_summary**: `oti_ref`
- **cargo_turnover**: `oti_ref`
- **oti_operations**: `oti_ref`
- **opo**: `oti_ref`
- **infrastructure**: `oti_ref`, `located_on_infra_ref`, `connected_to_infra_ref`, `source_doc_ref`
- **critical_elements**: `oti_ref`, `critical_element_ce_infra_ref`
- **restricted_access_zones**: `oti_ref`, `rod_name_rod_infra_ref`
- **zoning**: `oti_ref`, `critical_element_ce_infra_ref`, `rod_name_rod_infra_ref`
- **ptb**: `sti_ref`, `ptb_oti_ref`
- **ptb_contracts**: `ptb_ref`
- **ptb_supplementary_agreements**: `contract_ref`
- **maintenance_contracts**: `oti_ref`, `ptb_ref`
- **posts**: `ptb_ref`, `post_location_infra_ref`
- **post_staff**: `post_ref`
- **post_equipment**: `post_ref`
- **tsotb_instances**: `oti_ref`, `catalog_tsotb_ref`, `tsotb_location_infra_ref`, `tsotb_monitors_infra_ref`, `tsotb_powered_from_infra_ref`, `tsotb_post_ref`, `tsotb_maintenance_contract_ref`
- **eng_instances**: `oti_ref`, `catalog_eng_ref`, `eng_instance_location_infra_ref`, `eng_instance_protects_ce_infra_ref`, `eng_instance_protects_rod_infra_ref`, `eng_instance_maintenance_contract_ref`
- **climate_context**: `oti_ref`
---
Task ID: 2
Agent: main
Task: Vertical table UI rewrite and desktop-only layout

Work Log:
- Verified schema.ts vs seed JSON: 25/30 sections perfectly aligned, 5 have nested structure differences (properly handled via nestedFields)
- No UUID/timestamp fields in seed (manual_fields_only: true) — no auto-generation needed
- qdrant_* tag fields already marked as readOnly in schema
- Rewrote section-table.tsx: replaced horizontal table with vertical card-per-record form layout
  - Record tabs (Запись 1, Запись 2...) at top with Add/Delete buttons
  - 2-column grid for short fields (text, number, date, boolean, select, ref)
  - Full-width textarea fields
  - Full-width nested object/array collapsible blocks
  - Virtual ref fields in highlighted "Ссылки на другие разделы" block
  - Auto-filled fields show green "авто" badge
  - Read-only fields (qdrant_*) in collapsible "Системные теги и метаданные" block
  - Hint tooltips on field labels ("?" icon)
- Rewrote page.tsx: removed all mobile code (Sheet, useIsMobile, responsive conditionals)
  - Desktop-only layout with fixed sidebar (280px) and main content area
  - Author inputs always visible in header
  - Action buttons with text labels (Сохранить, Экспорт, Импорт, Версии)
  - Version badge in header right corner
- Lint: clean, no errors
- Browser verification: all sections render correctly, nested tables expand, ref selectors work, save works, no console errors

Stage Summary:
- section-table.tsx completely rewritten for vertical form layout
- page.tsx simplified for desktop-only
- Output JSON field names remain completely unchanged (virtual fields stripped on save)
- All 30 sections functional in the new layout

---
Task ID: 3
Agent: Main
Task: Add format validation with red highlighting and tooltip for invalid fields

Work Log:
- Added FORMAT_RULES array with 17 pattern-based validation rules for Russian business identifiers (ИНН, ОГРН, КПП, ОКПО, СНИЛС), banking (БИК, р/с, к/с), contact (email, phone, fax), maritime (IMO, MMSI, call sign), coordinates (lat/lon), and registration numbers
- Rewrote getFieldStatus() to return three states: 'empty', 'invalid', 'ok' — with full format validation for non-empty values
- Number fields: validated as finite numbers (not NaN/Infinity)
- Date fields: validated as real YYYY-MM-DD dates (checks for rollover like Feb 30)
- Text fields: validated against FORMAT_RULES by key name pattern matching
- Added getFieldFormatHint() function returning Russian format descriptions
- Created InvalidFieldTooltip component wrapping invalid inputs in a red Tooltip with message: "Поле «{label}» — некорректный формат ввода. Корректный формат: {hint}"
- Updated FieldInput to use hasIssue/isInvalid for both empty and invalid red styling
- Updated RefSelect to use hasIssue prop instead of isEmpty
- All input types (text, textarea, number, date, select, array, ref) wrapped in InvalidFieldTooltip when invalid
- Badge issue counter on record tabs correctly reflects both empty and invalid field counts

Stage Summary:
- Modified: /home/z/my-project/src/components/section-table.tsx (added ~250 lines of validation + tooltip code)
- No schema.ts changes needed — validation is auto-detected from field key names
- Browser verified: INN with "abc" → red border + red tooltip "Поле «ИНН» — некорректный формат ввода. Корректный формат: 10 цифр (ИНН организации)"
- Browser verified: email with "not-an-email" → red border + red tooltip "Поле Электронная почта — некорректный формат ввода. Корректный формат: example@domain.com"

---

# Task 2-a: Foundation Layer — SQL & Qdrant Knowledge Base Connections
**Agent**: foundation-builder
**Date**: 2026-08-06
**Status**: ✅ Completed

## Summary

Created 5 foundational library files providing type definitions, persistent JSON storage, and client factories for PostgreSQL, MySQL, and Qdrant vector database connections.

## Files Created

1. **`src/lib/types/connection.ts`** — TypeScript interfaces for SQL/Qdrant connection configs, table info, query results, collection info, search results, and connection test results.
2. **`src/lib/connection-storage.ts`** — File-based JSON CRUD storage at `data/connection-configs.json` following the same fs/promises pattern as `storage.ts`. Includes `addSQLConnection`, `addQdrantConnection`, `updateConnection`, `deleteConnection`.
3. **`src/lib/sql-client.ts`** — Factory `createSQLClient(config)` with PostgreSQL (`pg.Pool`) and MySQL (`mysql2/promise`) implementations. Methods: testConnection (timed SELECT 1), listTables, describeTable, queryTable (paginated), close. 10s timeout, Russian error messages.
4. **`src/lib/qdrant-client.ts`** — Factory `createQdrantClient(config)` using `@qdrant/js-client-rest`. Methods: testConnection, listCollections, getCollectionInfo, search, upsert, close.
5. **`src/lib/qdrant-field-mapper.ts`** — Maps all 30 unique `qdrant_*` schema fields to Qdrant payload keys (strips `qdrant_` prefix and `_tag` suffix). Exported `QDRANT_FIELD_MAP` and `getQdrantFieldKeys()`.

## Verification

- ESLint: 0 errors
- Dev server compiles successfully
- All required packages already present in package.json

---

## Task 2-b: API Routes Builder

Agent: api-routes-builder

### Summary
Created all 10 API routes for SQL and Qdrant connection management, data import, and Qdrant search/upsert/sync operations.

### Files Created (10 route files)

1. **`/src/app/api/connections/route.ts`** — GET all configs, POST new SQL/Qdrant connection
2. **`/src/app/api/connections/[id]/route.ts`** — GET/PUT/DELETE single connection by id
3. **`/src/app/api/connections/[id]/test/route.ts`** — POST test connection (dynamic import for SQL client)
4. **`/src/app/api/sql/[id]/tables/route.ts`** — GET list tables for SQL connection
5. **`/src/app/api/sql/[id]/tables/[table]/route.ts`** — GET describe + query table (supports ?limit=&offset=)
6. **`/src/app/api/sql/[id]/import/route.ts`** — POST import SQL rows into app section via field mapping
7. **`/src/app/api/qdrant/[id]/collections/route.ts`** — GET list Qdrant collections
8. **`/src/app/api/qdrant/[id]/search/route.ts`** — POST search with vector or text query placeholder
9. **`/src/app/api/qdrant/[id]/upsert/route.ts`** — POST upsert points to collection
10. **`/src/app/api/qdrant/[id]/sync/route.ts`** — POST sync analysis (v1: returns affected sections, requires embedding service)

### Design Decisions
- Dynamic imports for sql-client and qdrant-client to avoid cold-path bundling
- Russian error messages throughout
- Client cleanup in `finally` blocks
- SQL import limit: 100,000 rows; table browse limit: 1,000 rows max

### Verification
- ESLint: 0 errors
- Dev server compiles successfully

---

# Task 2-c: Connection Store & Dialog Component (ui-builder)

Generated: 2026-08-06

## Files Created
1. `/src/lib/store-connections.ts` — Zustand store for connection state management
2. `/src/components/connections-dialog.tsx` — Full-featured dialog for managing SQL/Qdrant connections

## Store: `store-connections.ts`
- State: sqlConnections, qdrantConnections, testResults, SQL browser state (activeSQLId, sqlTables, activeSQLTable, sqlTableData), Qdrant browser state (activeQdrantId, qdrantCollections, qdrantSearchResults), dialog state
- Actions: loadConnections, addConnection, updateConnection, deleteConnection, testConnection, openDialog/closeDialog, setActiveSQL/loadSQLTables/setActiveSQLTable/loadSQLTableData/importSQLData, setActiveQdrant/loadQdrantCollections/searchQdrant/syncQdrantTags

## Component: `connections-dialog.tsx`
- Exported: `ConnectionsDialog`
- Dialog (max-w-5xl) with Tabs (SQL | Qdrant)
- SQL tab: two-column (w-80 list + flex browser), inline add/edit forms, table browser with pagination, import wizard with field auto-mapping
- Qdrant tab: two-column layout, collection list, vector/text search, results display, tag sync
- All text Russian, desktop-only

### Verification
- ESLint: 0 errors (after fixing setState-in-effect lint rule)
- Dev server compiles successfully

---

# Task 3: Autocomplete Rewrite — READ-ONLY PG + Apache AGE for Autocomplete

Generated: 2026-08-06T13:30:00.000Z

## Overview
Rewrote the entire connection/autocomplete subsystem from a multi-connection SQL/Qdrant browser into a streamlined READ-ONLY PostgreSQL 15 + Apache AGE connection for form field autocomplete. Removed table browsing, data import, and collection management. The app now queries an external DB to auto-fill form fields when users type in identity fields (INN, name, OGRN, etc.).

## Changes

### Types: `src/lib/types/connection.ts`
- Replaced `SQLConnectionConfig` (multi-connection with id/name/type) → `PGConnectionConfig` (single, with `graphName` for AGE)
- Replaced `QdrantConnectionConfig` (multi-connection) → `QdrantConfig` (single)
- Replaced `ConnectionConfigs.sql_connections[]` + `qdrant_connections[]` → `postgresql: PGConnectionConfig | null` + `qdrant: QdrantConfig | null`
- Removed: `SQLTableInfo`, `SQLQueryResult`, `QdrantCollectionInfo`, `QdrantSearchResult`
- Added: `AutocompleteMatch { row, label }`

### Storage: `src/lib/connection-storage.ts`
- Simplified to single PG + single Qdrant config
- Functions: `readConfigs()`, `savePGConfig()`, `clearPGConfig()`, `saveQdrantConfig()`, `clearQdrantConfig()`
- Removed: `addSQLConnection`, `addQdrantConnection`, `updateConnection`, `deleteConnection`, `writeConfigs` (public)

### SQL Client: `src/lib/sql-client.ts`
- `testPGConnection(config)` — SELECT 1 with timing, closes pool after use
- `autocompleteFromPG(config, {sectionKey, fieldKey, value, limit})` — parameterized ILIKE query with `is_current_version = true`, identifier sanitization, auto-label generation from first 2-3 text fields
- Removed: `SQLClient` interface, `createSQLClient` factory, MySQL support, table listing, data browsing

### Qdrant Client: `src/lib/qdrant-client.ts`
- `testQdrantConnection(config)` — getCollections with timing
- `semanticSearch(config, params)` — stub returning `[]` with TODO for embedding integration
- Removed: `QdrantClientWrapper`, `createQdrantClient`, listCollections, getCollectionInfo, search, upsert

### API Routes
- Deleted: `src/app/api/connections/[id]/` (entire directory)
- Rewrote: `src/app/api/connections/route.ts` — GET (return configs), PUT (save PG), DELETE (clear PG)
- Created: `src/app/api/connections/qdrant/route.ts` — GET/PUT/DELETE for Qdrant config
- Created: `src/app/api/connections/test/route.ts` — POST with `{type: 'postgresql'|'qdrant'}`
- Created: `src/app/api/connections/autocomplete/route.ts` — POST with `{sectionKey, fieldKey, value, limit}`

### Store: `src/lib/store-connections.ts`
- Simplified from 360+ lines to ~110 lines
- State: pgConfig, qdrantConfig, isLoading, pgTestResult, qdrantTestResult, isTesting, autocompleteResults, autocompleteLoading, autocompleteSectionKey, autocompleteFieldKey, activeAutocompleteField, dialogOpen
- Actions: loadConfigs, savePGConfig, clearPGConfig, saveQdrantConfig, clearQdrantConfig, testConnection, openDialog, closeDialog, autocomplete, clearAutocomplete, setActiveAutocompleteField
- Removed: all SQL browser state/actions, all Qdrant browser state/actions, multi-connection CRUD

### Main Store: `src/lib/store.ts`
- Added: `dbSourcedFields: Record<string, Set<string>>` (sectionKey → Set of "rowIndex:fieldKey")
- Added: `markDBSourced(sectionKey, rowIndex, fieldKey)`, `clearDBSourced()`, `isDBSourced(sectionKey, rowIndex, fieldKey)`

### Dialog: `src/components/connections-dialog.tsx`
- Rewritten from ~1500 lines to ~300 lines
- Compact dialog (max-w-lg) with stacked PG + Qdrant cards
- Each card: CardHeader with test badge, form fields, CardFooter with Test/Save/Clear buttons
- Form initialized from store config via props (key-based remount)
- No tabs, no table browser, no import wizard

### Section Table: `src/components/section-table.tsx`
- Added `AUTOCOMPLETE_FIELD_PATTERNS` — regexes for inn, ogrn, full_name, short_name, reg_num, _name, _fio, imo
- Added `isAutocompleteField(field)` — checks field eligibility
- Added `debounce()` utility (400ms)
- Modified `FieldInput`: added `onTextChange` prop, text inputs call it on change
- Modified `RecordFieldRow`:
  - Subscribes to connection store for autocomplete state
  - Creates debounced autocomplete trigger (min 2 chars, 400ms)
  - Renders autocomplete dropdown below input (absolute positioned, z-50, max-h-60)
  - Shows loading spinner while searching
  - `handleApplyMatch`: maps DB row columns to section fields, calls updateCell + markDBSourced
  - Click-outside closes dropdown via mousedown event listener
  - Shows amber "из БД" badge for DB-sourced fields

### Page: `src/app/page.tsx`
- Updated dialog open call from `openDialog('sql')` to `openDialog()`
- Renamed button text from "Базы знаний" to "Базы данных"

## Verification
- ESLint: 0 errors, 0 warnings
- Dev server compiles successfully
