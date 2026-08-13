/**
 * Maps qdrant_* field keys from the app schema to expected Qdrant payload field names.
 * Used during Qdrant sync to populate readOnly qdrant_* fields.
 *
 * Convention: strip the "qdrant_" prefix and "_tag" suffix to derive the payload key.
 * For fields that don't end with "_tag" (e.g. qdrant_doc_section_id), just strip "qdrant_".
 *
 * This mapping was extracted from src/lib/schema.ts by searching for all field keys
 * matching the pattern /^qdrant_/.
 */
export const QDRANT_FIELD_MAP: Record<string, string> = {
  // ── STI section ──
  qdrant_sti_type_tag: 'sti_type',
  qdrant_ownership_tag: 'ownership',

  // ── OPO / climate_context section ──
  qdrant_doc_section_id: 'doc_section_id',
  qdrant_climate_zone_tag: 'climate_zone',
  qdrant_hydrology_risk_tag: 'hydrology_risk',
  qdrant_oti_category_tag: 'oti_category',

  // ── Persons section ──
  qdrant_person_role_tag: 'person_role',

  // ── Assessments section ──
  qdrant_assessment_type_tag: 'assessment_type',

  // ── Security plans section ──
  qdrant_plan_type_tag: 'plan_type',

  // ── Land / aquatories sections ──
  qdrant_flood_risk_tag: 'flood_risk',
  qdrant_soil_type_tag: 'soil_type',
  qdrant_ice_regime_tag: 'ice_regime',

  // ── Cargo sections ──
  qdrant_cargo_type_tag: 'cargo_type',
  qdrant_dangerous_cargo_tag: 'dangerous_cargo',
  qdrant_imo_class_tag: 'imo_class',

  // ── Critical elements / infrastructure ──
  qdrant_ce_protection_tag: 'ce_protection',
  qdrant_security_zone_tag: 'security_zone',

  // ── PTB section ──
  qdrant_ptb_accreditation_tag: 'ptb_accreditation',
  qdrant_gbr_exists_tag: 'gbr_exists',

  // ── TSOTB catalog section ──
  qdrant_tsotb_category_tag: 'tsotb_category',
  qdrant_certified_pp969_tag: 'certified_pp969',
  qdrant_tsotb_function_tag: 'tsotb_function',
  qdrant_climate_resistance_tag: 'climate_resistance',

  // ── Engineering catalog section ──
  qdrant_eng_category_tag: 'eng_category',
  qdrant_eng_function_tag: 'eng_function',

  // ── Engineering instances section ──
  qdrant_eng_material_tag: 'eng_material',
  qdrant_eng_gost_tag: 'eng_gost',
  qdrant_eng_seasonal_tag: 'eng_seasonal',
  qdrant_eng_condition_tag: 'eng_condition',
  qdrant_ce_protection_tag: 'ce_protection', // duplicates are okay; same key-value

  // ── Climate context (additional) ──
  qdrant_climate_zone_tag: 'climate_zone',
  qdrant_flood_risk_tag: 'flood_risk',
  qdrant_compliance_tag: 'compliance',
};

/** Get all unique qdrant_* field keys from the schema. */
export function getQdrantFieldKeys(): string[] {
  return [...new Set(Object.keys(QDRANT_FIELD_MAP))];
}
