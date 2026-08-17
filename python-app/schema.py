# =============================================================================
# Schema definition for Russian maritime/port security data entry application
# Converted from src/lib/schema.ts (TypeScript)
# =============================================================================
#
# This file is the single source of truth for the application schema.
# It contains 30 sections with all field definitions.
#
# Usage:
#   from schema import SCHEMA_SECTIONS, get_empty_row
#

from __future__ import annotations

SCHEMA_SECTIONS: list[dict] = [
    {
        "key": 'sti',
        "label": 'Субъект транспортной инфраструктуры (СТИ)',
        "description": 'Основные сведения о субъекте транспортной инфраструктуры — организации, владеющей ОТИ',
        "icon": 'Building2',
        "fields": [
            {
                "key": 'sti_full_name',
                "label": 'Полное наименование',
                "type": 'text',
                "hint": 'Полное юридическое наименование организации',
                "placeholder": 'ООО «Морской порт»',
                "defaultValue": ''
            },
            {
                "key": 'sti_short_name',
                "label": 'Краткое наименование',
                "type": 'text',
                "hint": 'Сокращённое наименование для использования в документах',
                "placeholder": 'Морпорт',
                "defaultValue": ''
            },
            {
                "key": 'sti_legal_address',
                "label": 'Юридический адрес',
                "type": 'text',
                "placeholder": 'г. Москва, ул. Морская, д. 1',
                "defaultValue": ''
            },
            {
                "key": 'sti_postal_address',
                "label": 'Почтовый адрес',
                "type": 'text',
                "placeholder": 'г. Москва, ул. Морская, д. 1, оф. 10',
                "defaultValue": ''
            },
            {
                "key": 'sti_phone',
                "label": 'Телефон',
                "type": 'text',
                "placeholder": '+7 (495) 123-45-67',
                "defaultValue": ''
            },
            {
                "key": 'sti_email',
                "label": 'Электронная почта',
                "type": 'text',
                "placeholder": 'info@example.ru',
                "defaultValue": ''
            },
            {
                "key": 'sti_website',
                "label": 'Веб-сайт',
                "type": 'text',
                "placeholder": 'https://example.ru',
                "defaultValue": ''
            },
            {
                "key": 'sti_ogrn',
                "label": 'ОГРН',
                "type": 'text',
                "hint": 'Основной государственный регистрационный номер юридического лица',
                "placeholder": '1234567890123',
                "defaultValue": ''
            },
            {
                "key": 'sti_inn',
                "label": 'ИНН',
                "type": 'text',
                "hint": 'Идентификационный номер налогоплательщика',
                "placeholder": '1234567890',
                "defaultValue": ''
            },
            {
                "key": 'sti_kpp',
                "label": 'КПП',
                "type": 'text',
                "hint": 'Код причины постановки на учёт',
                "placeholder": '123456789',
                "defaultValue": ''
            },
            {
                "key": 'sti_okpo',
                "label": 'ОКПО',
                "type": 'text',
                "hint": 'Общероссийский классификатор предприятий и организаций',
                "placeholder": '12345678',
                "defaultValue": ''
            },
            {
                "key": 'sti_egrl_date',
                "label": 'Дата внесения в ЕГРЛ',
                "type": 'date',
                "hint": 'Дата внесения записи в Единый государственный реестр юридических лиц'
            },
            {
                "key": 'sti_egrip_date',
                "label": 'Дата внесения в ЕГРИП',
                "type": 'date',
                "hint": 'Дата внесения записи в Единый государственный реестр индивидуальных предпринимателей'
            },
            {
                "key": 'sti_ip_fio',
                "label": 'ФИО индивидуального предпринимателя',
                "type": 'text',
                "hint": 'Заполняется, если субъект — индивидуальный предприниматель',
                "placeholder": 'Иванов Иван Иванович',
                "defaultValue": ''
            },
            {
                "key": 'sti_ip_address',
                "label": 'Адрес ИП',
                "type": 'text',
                "hint": 'Адрес регистрации индивидуального предпринимателя',
                "placeholder": 'г. Москва, ул. Портовая, д. 5',
                "defaultValue": ''
            },
            {
                "key": 'sti_ip_inn',
                "label": 'ИНН ИП',
                "type": 'text',
                "hint": 'ИНН индивидуального предпринимателя',
                "placeholder": '123456789012',
                "defaultValue": ''
            },
            {
                "key": 'sti_ip_ogrnip',
                "label": 'ОГРНИП',
                "type": 'text',
                "hint": 'Основной государственный регистрационный номер ИП',
                "placeholder": '312345678901234',
                "defaultValue": ''
            },
            {
                "key": 'sti_person_fio',
                "label": 'ФИО ответственного лица',
                "type": 'text',
                "hint": 'ФИО лица, ответственного за транспортную безопасность',
                "placeholder": 'Петров Пётр Петрович',
                "defaultValue": ''
            },
            {
                "key": 'sti_person_address',
                "label": 'Адрес ответственного лица',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'sti_person_inn',
                "label": 'ИНН ответственного лица',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'sti_head_fio',
                "label": 'ФИО руководителя',
                "type": 'text',
                "placeholder": 'Сидоров Сидор Сидорович',
                "defaultValue": ''
            },
            {
                "key": 'sti_head_position',
                "label": 'Должность руководителя',
                "type": 'text',
                "placeholder": 'Генеральный директор',
                "defaultValue": ''
            },
            {
                "key": 'sti_narrative_description',
                "label": 'Описание СТИ',
                "type": 'textarea',
                "hint": 'Подробное описание субъекта транспортной инфраструктуры',
                "placeholder": 'Общая информация о деятельности организации…',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'sti_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'sti_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_sti_type_tag',
                "label": 'Тег типа СТИ',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации в векторной базе',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_ownership_tag',
                "label": 'Тег формы собственности',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации в векторной базе',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'sti_licenses',
        "label": 'Лицензии СТИ',
        "description": 'Лицензии, выданные субъекту транспортной инфраструктуры',
        "icon": 'FileText',
        "fields": [
            {
                "key": 'sti_ref',
                "label": 'Ссылка на СТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на субъект транспортной инфраструктуры',
                "refSection": 'sti',
                "refLabelField": 'sti_full_name'
            },
            {
                "key": 'license_type',
                "label": 'Тип лицензии',
                "type": 'text',
                "placeholder": 'Лицензия на осуществление деятельности по транспортной безопасности',
                "defaultValue": ''
            },
            {
                "key": 'license_num',
                "label": 'Номер лицензии',
                "type": 'text',
                "placeholder": 'ЛТБ-12345',
                "defaultValue": ''
            },
            {
                "key": 'license_date',
                "label": 'Дата лицензии',
                "type": 'date',
                "hint": 'Дата выдачи лицензии'
            },
            {
                "key": 'license_term',
                "label": 'Срок действия',
                "type": 'text',
                "hint": 'Описание срока действия лицензии',
                "placeholder": 'Бессрочно',
                "defaultValue": ''
            },
            {
                "key": 'license_classes',
                "label": 'Классы лицензии',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "defaultValue": []
            },
            {
                "key": 'license_objects_approval',
                "label": 'Утверждённые объекты',
                "type": 'text',
                "hint": 'Сведения об объектах, указанных в лицензии',
                "defaultValue": ''
            },
            {
                "key": 'license_is_active',
                "label": 'Лицензия активна',
                "type": 'boolean',
                "hint": 'Действует ли лицензия на данный момент',
                "defaultValue": True
            }
        ]
    },

    {
        "key": 'oti',
        "label": 'Объект транспортной инфраструктуры (ОТИ)',
        "description": 'Регистрационные и категорировочные сведения об объекте транспортной инфраструктуры',
        "icon": 'MapPin',
        "fields": [
            {
                "key": 'sti_ref',
                "label": 'Ссылка на СТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на субъект транспортной инфраструктуры',
                "refSection": 'sti',
                "refLabelField": 'sti_full_name'
            },
            {
                "key": 'oti_registry_num',
                "label": 'Реестровый номер ОТИ',
                "type": 'text',
                "placeholder": 'ОТИ-01-001',
                "defaultValue": ''
            },
            {
                "key": 'oti_registry_entry_date',
                "label": 'Дата внесения в реестр',
                "type": 'date'
            },
            {
                "key": 'oti_full_name',
                "label": 'Полное наименование ОТИ',
                "type": 'text',
                "placeholder": 'Морской порт «Восточный»',
                "defaultValue": ''
            },
            {
                "key": 'oti_short_name',
                "label": 'Краткое наименование ОТИ',
                "type": 'text',
                "placeholder": 'Порт Восточный',
                "defaultValue": ''
            },
            {
                "key": 'port_facility_name',
                "label": 'Наименование портового средства',
                "type": 'text',
                "placeholder": 'Причал №1',
                "defaultValue": ''
            },
            {
                "key": 'port_name',
                "label": 'Наименование порта',
                "type": 'text',
                "placeholder": 'Порт Владивосток',
                "defaultValue": ''
            },
            {
                "key": 'oti_location',
                "label": 'Местоположение ОТИ',
                "type": 'text',
                "placeholder": 'г. Владивосток, бухта Золотой Рог',
                "defaultValue": ''
            },
            {
                "key": 'oti_category',
                "label": 'Категория ОТИ',
                "type": 'select',
                "hint": 'Категория уязвимости ОТИ по результатам оценки',
                "options": [
                    '1',
                    '2',
                    '3',
                    '4'
                ]
            },
            {
                "key": 'oti_category_assign_date',
                "label": 'Дата присвоения категории',
                "type": 'date'
            },
            {
                "key": 'oti_registry_basis',
                "label": 'Основание внесения в реестр',
                "type": 'textarea',
                "hint": 'Документальное основание включения ОТИ в реестр',
                "defaultValue": ''
            },
            {
                "key": 'oti_change_basis',
                "label": 'Основание изменения',
                "type": 'textarea',
                "hint": 'Основание для изменения категории ОТИ',
                "defaultValue": ''
            },
            {
                "key": 'oti_change_date',
                "label": 'Дата изменения категории',
                "type": 'date'
            },
            {
                "key": 'oti_review_date',
                "label": 'Дата пересмотра категории',
                "type": 'date'
            },
            {
                "key": 'oti_new_category',
                "label": 'Новая категория ОТИ',
                "type": 'select',
                "hint": 'Категория после пересмотра',
                "options": [
                    '1',
                    '2',
                    '3',
                    '4'
                ]
            },
            {
                "key": 'oti_review_basis',
                "label": 'Основание пересмотра',
                "type": 'textarea',
                "hint": 'Основание для пересмотра категории ОТИ',
                "defaultValue": ''
            },
            {
                "key": 'oti_exclude_basis',
                "label": 'Основание исключения',
                "type": 'textarea',
                "hint": 'Основание для исключения ОТИ из реестра',
                "defaultValue": ''
            },
            {
                "key": 'oti_exclude_date',
                "label": 'Дата исключения из реестра',
                "type": 'date'
            },
            {
                "key": 'oti_imo_code',
                "label": 'Код ИМО (IMO)',
                "type": 'text',
                "hint": 'Код Международной морской организации',
                "placeholder": 'RU VVO',
                "defaultValue": ''
            },
            {
                "key": 'oti_area_ha',
                "label": 'Площадь ОТИ, га',
                "type": 'number',
                "hint": 'Общая площадь объекта в гектарах'
            },
            {
                "key": 'oti_berths_count',
                "label": 'Количество причалов',
                "type": 'number',
                "hint": 'Число причальных мест в ОТИ'
            },
            {
                "key": 'oti_berth_front_len',
                "label": 'Длина причального фронта, м',
                "type": 'number'
            },
            {
                "key": 'oti_center_lat',
                "label": 'Широта центра ОТИ',
                "type": 'number',
                "hint": 'Географическая широта центральной точки ОТИ (градусы)'
            },
            {
                "key": 'oti_center_lon',
                "label": 'Долгота центра ОТИ',
                "type": 'number',
                "hint": 'Географическая долгота центральной точки ОТИ (градусы)'
            },
            {
                "key": 'oti_purpose',
                "label": 'Назначение ОТИ',
                "type": 'textarea',
                "hint": 'Описание целевого назначения объекта транспортной инфраструктуры',
                "defaultValue": ''
            },
            {
                "key": 'oti_checkpoint_type',
                "label": 'Тип пункта пропуска',
                "type": 'text',
                "placeholder": 'Морской пункт пропуска',
                "defaultValue": ''
            },
            {
                "key": 'developer_org',
                "label": 'Организация-разработчик',
                "type": 'text',
                "hint": 'Организация, разработавшая план обеспечения транспортной безопасности',
                "defaultValue": ''
            },
            {
                "key": 'survey_date',
                "label": 'Дата обследования',
                "type": 'date',
                "hint": 'Дата проведения обследования ОТИ'
            },
            {
                "key": 'oti_narrative_description',
                "label": 'Описание ОТИ',
                "type": 'textarea',
                "hint": 'Подробное текстовое описание объекта',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'oti_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'oti_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_doc_section_id',
                "label": 'Идентификатор раздела документа',
                "type": 'text',
                "hint": 'Ссылка на раздел документа в векторной базе',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_climate_zone_tag',
                "label": 'Тег климатической зоны',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_hydrology_risk_tag',
                "label": 'Тег гидрологического риска',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_oti_category_tag',
                "label": 'Тег категории ОТИ',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'persons',
        "label": 'Ответственные лица',
        "description": 'Данные о лицах, ответственных за обеспечение транспортной безопасности',
        "icon": 'Users',
        "fields": [
            {
                "key": 'sti_ref',
                "label": 'Ссылка на СТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на субъект транспортной инфраструктуры',
                "refSection": 'sti',
                "refLabelField": 'sti_full_name'
            },
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'person_role',
                "label": 'Роль',
                "type": 'text',
                "placeholder": 'Ответственный за транспортную безопасность',
                "defaultValue": ''
            },
            {
                "key": 'qdrant_person_role_tag',
                "label": 'Тег роли лица',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'person_fio',
                "label": 'ФИО',
                "type": 'text',
                "placeholder": 'Иванов Иван Иванович',
                "defaultValue": ''
            },
            {
                "key": 'person_position',
                "label": 'Должность',
                "type": 'text',
                "placeholder": 'Заместитель директора по безопасности',
                "defaultValue": ''
            },
            {
                "key": 'person_work_phone',
                "label": 'Рабочий телефон',
                "type": 'text',
                "placeholder": '+7 (495) 123-45-67',
                "defaultValue": ''
            },
            {
                "key": 'person_mob_phone',
                "label": 'Мобильный телефон',
                "type": 'text',
                "placeholder": '+7 (916) 123-45-67',
                "defaultValue": ''
            },
            {
                "key": 'person_fax',
                "label": 'Факс',
                "type": 'text',
                "placeholder": '+7 (495) 123-45-68',
                "defaultValue": ''
            },
            {
                "key": 'person_email',
                "label": 'Электронная почта',
                "type": 'text',
                "placeholder": 'ivanov@example.ru',
                "defaultValue": ''
            },
            {
                "key": 'person_order',
                "label": 'Приказ о назначении',
                "type": 'text',
                "hint": 'Номер и дата приказа о назначении на должность',
                "defaultValue": ''
            },
            {
                "key": 'person_education',
                "label": 'Образование',
                "type": 'text',
                "placeholder": 'Высшее, МГУ им. М.В. Ломоносова',
                "defaultValue": ''
            },
            {
                "key": 'person_training',
                "label": 'Подготовка / повышение квалификации',
                "type": 'textarea',
                "hint": 'Сведения о подготовке и повышении квалификации в области транспортной безопасности',
                "defaultValue": ''
            },
            {
                "key": 'person_attestation_reestr_num',
                "label": 'Номер в реестре аттестованных лиц',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'person_attestation_num',
                "label": 'Номер аттестата',
                "type": 'text',
                "placeholder": 'АТТ-12345',
                "defaultValue": ''
            },
            {
                "key": 'person_attestation_date',
                "label": 'Дата аттестации',
                "type": 'date'
            },
            {
                "key": 'person_attestation_num_date',
                "label": 'Номер и дата аттестации',
                "type": 'text',
                "hint": 'Аттестат № и дата в текстовом формате',
                "defaultValue": ''
            },
            {
                "key": 'person_attestation_exp_date',
                "label": 'Дата окончания действия аттестации',
                "type": 'date',
                "readOnly": True
            },
            {
                "key": 'person_attestation_category',
                "label": 'Категория аттестации',
                "type": 'select',
                "hint": 'Категория (уровень компетенции) по результатам аттестации',
                "options": [
                    '1',
                    '2',
                    '3',
                    '4'
                ]
            },
            {
                "key": 'person_attestation_issuing_body',
                "label": 'Орган, выдавший аттестат',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'person_is_active',
                "label": 'Действующее лицо',
                "type": 'boolean',
                "hint": 'Активно ли лицо на данный момент',
                "defaultValue": True
            },
            {
                "key": 'person_narrative_description',
                "label": 'Описание / примечания',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'person_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'persons_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            }
        ]
    },

    {
        "key": 'assessments',
        "label": 'Оценки уязвимости',
        "description": 'Результаты оценки уязвимости объектов транспортной инфраструктуры',
        "icon": 'Shield',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'assessment_type',
                "label": 'Тип оценки',
                "type": 'text',
                "hint": 'Внутренняя или внешняя оценка уязвимости',
                "placeholder": 'Внутренняя оценка уязвимости',
                "defaultValue": ''
            },
            {
                "key": 'qdrant_assessment_type_tag',
                "label": 'Тег типа оценки',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'assessment_date_conduct',
                "label": 'Дата проведения оценки',
                "type": 'date'
            },
            {
                "key": 'assessment_date_approval',
                "label": 'Дата утверждения оценки',
                "type": 'date'
            },
            {
                "key": 'assessment_number',
                "label": 'Номер оценки',
                "type": 'text',
                "placeholder": 'ОУ-2024-001',
                "defaultValue": ''
            },
            {
                "key": 'assessment_authority',
                "label": 'Утвердивший орган',
                "type": 'text',
                "hint": 'Наименование органа, утвердившего оценку',
                "defaultValue": ''
            },
            {
                "key": 'assessment_status',
                "label": 'Статус оценки',
                "type": 'text',
                "placeholder": 'Утверждена',
                "defaultValue": ''
            },
            {
                "key": 'assessment_validity_period',
                "label": 'Период действия',
                "type": 'text',
                "hint": 'Срок действия результатов оценки',
                "defaultValue": ''
            },
            {
                "key": 'assessment_plan_ref',
                "label": 'Ссылка на план',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на план обеспечения транспортной безопасности',
                "refSection": 'security_plans',
                "refLabelField": 'plan_number'
            },
            {
                "key": 'assessment_narrative_description',
                "label": 'Описание оценки',
                "type": 'textarea',
                "hint": 'Подробное описание результатов оценки уязвимости',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'assessment_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'assessment_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            }
        ]
    },

    {
        "key": 'security_plans',
        "label": 'Планы обеспечения транспортной безопасности',
        "description": 'Планы обеспечения транспортной безопасности для объектов транспортной инфраструктуры',
        "icon": 'ClipboardList',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'plan_type',
                "label": 'Тип плана',
                "type": 'text',
                "placeholder": 'План обеспечения транспортной безопасности',
                "defaultValue": ''
            },
            {
                "key": 'qdrant_plan_type_tag',
                "label": 'Тег типа плана',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'plan_start_conduct_date',
                "label": 'Дата начала разработки',
                "type": 'date'
            },
            {
                "key": 'plan_end_conduct_date',
                "label": 'Дата окончания разработки',
                "type": 'date'
            },
            {
                "key": 'plan_date_approval',
                "label": 'Дата утверждения плана',
                "type": 'date'
            },
            {
                "key": 'plan_number',
                "label": 'Номер плана',
                "type": 'text',
                "placeholder": 'ПОТБ-2024-001',
                "defaultValue": ''
            },
            {
                "key": 'plan_authority',
                "label": 'Утвердивший орган',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'plan_status',
                "label": 'Статус плана',
                "type": 'text',
                "placeholder": 'Утверждён',
                "defaultValue": ''
            },
            {
                "key": 'plan_implementation_status',
                "label": 'Статус реализации',
                "type": 'text',
                "placeholder": 'Реализуется',
                "defaultValue": ''
            },
            {
                "key": 'plan_assessment_ref',
                "label": 'Ссылка на оценку уязвимости',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на соответствующую оценку уязвимости',
                "refSection": 'assessments',
                "refLabelField": 'assessment_number'
            },
            {
                "key": 'plan_narrative_description',
                "label": 'Описание плана',
                "type": 'textarea',
                "hint": 'Подробное описание плана обеспечения транспортной безопасности',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'plan_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'plan_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            }
        ]
    },

    {
        "key": 'land',
        "label": 'Земельные участки',
        "description": 'Сведения о земельных участках, на которых расположен ОТИ',
        "icon": 'LandPlot',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'cadastre_number',
                "label": 'Кадастровый номер',
                "type": 'text',
                "placeholder": '77:01:0000001:123',
                "defaultValue": ''
            },
            {
                "key": 'area_sqm',
                "label": 'Площадь, кв. м',
                "type": 'number'
            },
            {
                "key": 'land_lease_term',
                "label": 'Срок аренды',
                "type": 'text',
                "placeholder": '49 лет',
                "defaultValue": ''
            },
            {
                "key": 'lease_contract_num',
                "label": 'Номер договора аренды',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'lease_end_date',
                "label": 'Дата окончания аренды',
                "type": 'date'
            },
            {
                "key": 'owner',
                "label": 'Собственник / арендодатель',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'soil_type',
                "label": 'Тип грунта',
                "type": 'text',
                "placeholder": 'Суглинок',
                "defaultValue": ''
            },
            {
                "key": 'vegetation',
                "label": 'Наличие растительности',
                "type": 'boolean',
                "hint": 'Присутствует ли древесно-кустарниковая растительность на участке',
                "defaultValue": False
            },
            {
                "key": 'encumbrances',
                "label": 'Обременения',
                "type": 'text',
                "hint": 'Сведения об обременениях земельного участка',
                "defaultValue": ''
            },
            {
                "key": 'is_flood_zone',
                "label": 'Зона затопления',
                "type": 'boolean',
                "hint": 'Попадает ли участок в зону возможного затопления',
                "defaultValue": False
            },
            {
                "key": 'land_narrative_description',
                "label": 'Описание земельного участка',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'land_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'land_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_flood_risk_tag',
                "label": 'Тег риска затопления',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_soil_type_tag',
                "label": 'Тег типа грунта',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'land_summary',
        "label": 'Сводка по землям',
        "description": 'Сводные данные по земельным участкам ОТИ',
        "icon": 'LandPlot',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'land_lease_term_summary',
                "label": 'Сводка по срокам аренды',
                "type": 'textarea',
                "hint": 'Агрегированная информация о сроках аренды по всем участкам',
                "defaultValue": ''
            },
            {
                "key": 'land_narrative_description',
                "label": 'Описание земельных участков',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'land_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'land_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_flood_risk_tag',
                "label": 'Тег риска затопления',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_soil_type_tag',
                "label": 'Тег типа грунта',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'aquatories',
        "label": 'Акватории',
        "description": 'Акватории, обслуживаемые объектом транспортной инфраструктуры',
        "icon": 'Waves',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'aquatory_area_sqm',
                "label": 'Площадь акватории, кв. м',
                "type": 'number'
            },
            {
                "key": 'aquatory_depths',
                "label": 'Глубины акватории (текст)',
                "type": 'text',
                "hint": 'Текстовое описание глубин акватории',
                "defaultValue": ''
            },
            {
                "key": 'aquatory_depths_min_m',
                "label": 'Минимальная глубина, м',
                "type": 'number'
            },
            {
                "key": 'aquatory_depths_max_m',
                "label": 'Максимальная глубина, м',
                "type": 'number'
            },
            {
                "key": 'aquatory_bottom_type',
                "label": 'Тип дна',
                "type": 'text',
                "placeholder": 'Песчаное, глинистое',
                "defaultValue": ''
            },
            {
                "key": 'aquatory_current_speed_ms',
                "label": 'Скорость течения, м/с',
                "type": 'text',
                "hint": 'Средняя скорость течения в акватории',
                "defaultValue": ''
            },
            {
                "key": 'aquatory_ice_regime',
                "label": 'Ледовый режим',
                "type": 'text',
                "placeholder": 'Свободный от льда, ледовый',
                "defaultValue": ''
            },
            {
                "key": 'fairways_anchorages',
                "label": 'Наличие фарватеров и якорных стоянок',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'fairways_anchorages_details',
                "label": 'Подробности по фарватерам и стоянкам',
                "type": 'textarea',
                "hint": 'Описание фарватеров и якорных стоянок',
                "defaultValue": ''
            },
            {
                "key": 'aquatory_security_implication',
                "label": 'Последствия для безопасности',
                "type": 'textarea',
                "hint": 'Влияние характеристик акватории на транспортную безопасность',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'aquatory_patrol_requirement',
                "label": 'Необходимость патрулирования',
                "type": 'boolean',
                "hint": 'Требуется ли патрулирование акватории',
                "readOnly": True,
                "defaultValue": False
            },
            {
                "key": 'aquatory_narrative_description',
                "label": 'Описание акватории',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'aquatory_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'aquatory_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_ice_regime_tag',
                "label": 'Тег ледового режима',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'points',
                "label": 'Опорные точки акватории',
                "type": 'object',
                "hint": 'Координаты опорных точек, определяющих границы акватории',
                "nestedFields": [
                    {
                        "key": 'p',
                        "label": 'Порядковый номер (строка)',
                        "type": 'number',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": 1,
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'point_number',
                        "label": 'Номер точки',
                        "type": 'number',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": 1,
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'lat',
                        "label": 'Широта (градусы, минуты)',
                        "type": 'text',
                        "hint": None,
                        "placeholder": "43°07'N",
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'lon',
                        "label": 'Долгота (градусы, минуты)',
                        "type": 'text',
                        "hint": None,
                        "placeholder": "131°54'E",
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'lat_decimal',
                        "label": 'Широта (десятичные градусы)',
                        "type": 'number',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": True,
                        "nestedFields": None,
                        "defaultValue": None,
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'lon_decimal',
                        "label": 'Долгота (десятичные градусы)',
                        "type": 'number',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": True,
                        "nestedFields": None,
                        "defaultValue": None,
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    }
                ],
                "defaultValue": []
            }
        ]
    },

    {
        "key": 'cargo',
        "label": 'Грузы',
        "description": 'Сведения о грузах, перерабатываемых на ОТИ',
        "icon": 'Package',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'cargo_name',
                "label": 'Наименование груза',
                "type": 'text',
                "placeholder": 'Нефть сырая',
                "defaultValue": ''
            },
            {
                "key": 'imo_class',
                "label": 'Класс ИМО',
                "type": 'text',
                "hint": 'Класс опасности груза по коду ИМО',
                "defaultValue": ''
            },
            {
                "key": 'is_dangerous',
                "label": 'Опасный груз',
                "type": 'boolean',
                "hint": 'Является ли груз опасным',
                "defaultValue": False
            },
            {
                "key": 'un_number',
                "label": 'Номер ООН (UN)',
                "type": 'text',
                "hint": 'Номер опасного груза по номенклатуре ООН',
                "defaultValue": ''
            },
            {
                "key": 'features',
                "label": 'Характеристики груза',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "defaultValue": []
            },
            {
                "key": 'packaging_type',
                "label": 'Тип упаковки',
                "type": 'text',
                "placeholder": 'Наливной, навалочный, тарный',
                "defaultValue": ''
            },
            {
                "key": 'max_weight_per_ship_t',
                "label": 'Максимальный вес на судно, т',
                "type": 'number'
            },
            {
                "key": 'berth_name',
                "label": 'Наименование причала',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'berth_infra_ref',
                "label": 'Ссылка на инфраструктуру причала',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на инфраструктурный объект причала',
                "refSection": 'infrastructure',
                "refLabelField": 'obj_name'
            },
            {
                "key": 'season_start',
                "label": 'Начало навигации',
                "type": 'text',
                "hint": 'Начало периода обработки груза (месяц/дата)',
                "defaultValue": ''
            },
            {
                "key": 'season_end',
                "label": 'Конец навигации',
                "type": 'text',
                "hint": 'Конец периода обработки груза (месяц/дата)',
                "defaultValue": ''
            },
            {
                "key": 'cargo_narrative_description',
                "label": 'Описание груза',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'cargo_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'cargo_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_cargo_type_tag',
                "label": 'Тег типа груза',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_dangerous_cargo_tag',
                "label": 'Тег опасного груза',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_imo_class_tag',
                "label": 'Тег класса ИМО',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'cargo_summary',
        "label": 'Сводка по грузам',
        "description": 'Сводные данные по грузам, перерабатываемым на ОТИ',
        "icon": 'BarChart3',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'cargo_general',
                "label": 'Общие сведения о грузах',
                "type": 'textarea',
                "hint": 'Общая характеристика грузов, перерабатываемых на ОТИ',
                "defaultValue": ''
            },
            {
                "key": 'cargo_general_list',
                "label": 'Перечень грузов общего назначения',
                "type": 'object',
                "hint": 'Список наименований и классов грузов',
                "nestedFields": [
                    {
                        "key": 'name',
                        "label": 'Наименование груза',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'imo_class',
                        "label": 'Класс ИМО',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    }
                ],
                "defaultValue": []
            },
            {
                "key": 'cargo_dangerous_list',
                "label": 'Перечень опасных грузов',
                "type": 'object',
                "hint": 'Детализированный список опасных грузов',
                "nestedFields": [
                    {
                        "key": 'name',
                        "label": 'Наименование груза',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'imo_class',
                        "label": 'Класс ИМО',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'features',
                        "label": 'Характеристики',
                        "type": 'array',
                        "hint": 'Введите значения через запятую',
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": [],
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'un_number',
                        "label": 'Номер ООН (UN)',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'packaging_type',
                        "label": 'Тип упаковки',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'max_weight_per_ship_t',
                        "label": 'Макс. вес на судно, т',
                        "type": 'number',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": None,
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'berth_name',
                        "label": 'Наименование причала',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'season_start',
                        "label": 'Начало навигации',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'season_end',
                        "label": 'Конец навигации',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    }
                ],
                "defaultValue": []
            },
            {
                "key": 'dangerous_cargo_regulatory',
                "label": 'Нормативные требования по опасным грузам',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'dangerous_cargo_context',
                "label": 'Контекст опасных грузов',
                "type": 'textarea',
                "hint": 'Описание особенностей переработки опасных грузов',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'cargo_narrative_description',
                "label": 'Описание грузов (сводно)',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'cargo_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'cargo_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_cargo_type_tag',
                "label": 'Тег типа груза',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_dangerous_cargo_tag',
                "label": 'Тег опасного груза',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_imo_class_tag',
                "label": 'Тег класса ИМО',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'cargo_turnover',
        "label": 'Грузооборот',
        "description": 'Данные по грузообороту и судозаходам ОТИ',
        "icon": 'BarChart3',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'year',
                "label": 'Год',
                "type": 'number',
                "hint": 'Отчётный год'
            },
            {
                "key": 'period_date',
                "label": 'Дата периода',
                "type": 'date',
                "hint": 'Начало отчётного периода'
            },
            {
                "key": 'is_current_period',
                "label": 'Текущий период',
                "type": 'boolean',
                "hint": 'Является ли данный период текущим',
                "defaultValue": False
            },
            {
                "key": 'tons',
                "label": 'Грузооборот, тыс. тонн',
                "type": 'number'
            },
            {
                "key": 'ships',
                "label": 'Количество судов',
                "type": 'number',
                "hint": 'Общее количество судозаходов'
            },
            {
                "key": 'foreign_ships',
                "label": 'Иностранные суда',
                "type": 'number',
                "hint": 'Количество судов под иностранным флагом'
            },
            {
                "key": 'coasting_ships',
                "label": 'Судна каботажа',
                "type": 'number',
                "hint": 'Количество судов каботажного плавания'
            },
            {
                "key": 'river_ships',
                "label": 'Речные суда',
                "type": 'number',
                "hint": 'Количество речных судов'
            }
        ]
    },

    {
        "key": 'oti_operations',
        "label": 'Операции ОТИ',
        "description": 'Сведения об операционной деятельности ОТИ',
        "icon": 'Settings',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'is_passenger_ops',
                "label": 'Пассажирские операции',
                "type": 'boolean',
                "hint": 'Осуществляется ли посадка/высадка пассажиров',
                "defaultValue": False
            },
            {
                "key": 'is_bunkering',
                "label": 'Бункеровка',
                "type": 'boolean',
                "hint": 'Оказывается ли услуга бункеровки судов',
                "defaultValue": False
            },
            {
                "key": 'is_unaccompanied_baggage',
                "label": 'Не сопровождаемый багаж',
                "type": 'boolean',
                "hint": 'Обрабатывается ли не сопровождаемый багаж',
                "defaultValue": False
            },
            {
                "key": 'operation_mode',
                "label": 'Режим работы',
                "type": 'text',
                "placeholder": 'Круглосуточный',
                "defaultValue": ''
            },
            {
                "key": 'operation_mode_shift_type',
                "label": 'Тип сменности',
                "type": 'text',
                "placeholder": '2-сменный, 3-сменный',
                "defaultValue": ''
            },
            {
                "key": 'max_people_on_oti',
                "label": 'Макс. количество людей на ОТИ',
                "type": 'number',
                "hint": 'Максимальное количество людей, одновременно находящихся на ОТИ'
            },
            {
                "key": 'max_people_on_oti_includes',
                "label": 'Включая (состав людей)',
                "type": 'text',
                "hint": 'Указание, какие категории людей включены в подсчёт',
                "defaultValue": ''
            },
            {
                "key": 'brigade_size',
                "label": 'Размер бригады (текст)',
                "type": 'text',
                "hint": 'Текстовое описание численности бригад',
                "defaultValue": ''
            },
            {
                "key": 'brigade_size_day',
                "label": 'Размер бригады (дневная смена)',
                "type": 'number',
                "hint": 'Численность бригады в дневную смену'
            },
            {
                "key": 'brigade_size_night',
                "label": 'Размер бригады (ночная смена)',
                "type": 'number',
                "hint": 'Численность бригады в ночную смену'
            }
        ]
    },

    {
        "key": 'opo',
        "label": 'Опасные производственные объекты (ОПО)',
        "description": 'Сведения об опасных производственных объектах на территории ОТИ',
        "icon": 'AlertTriangle',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'opo_registry_num',
                "label": 'Реестровый номер ОПО',
                "type": 'text',
                "placeholder": 'ОПО-001',
                "defaultValue": ''
            },
            {
                "key": 'opo_name',
                "label": 'Наименование ОПО',
                "type": 'text',
                "placeholder": 'Резервуарный парк РП-1',
                "defaultValue": ''
            },
            {
                "key": 'opo_hazard_class',
                "label": 'Класс опасности ОПО',
                "type": 'select',
                "hint": 'Класс опасности по Ростехнадзору',
                "options": [
                    '1',
                    '2',
                    '3',
                    '4'
                ]
            },
            {
                "key": 'opo_basis',
                "label": 'Основание',
                "type": 'textarea',
                "hint": 'Основание отнесения объекта к категории ОПО',
                "defaultValue": ''
            },
            {
                "key": 'opo_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'opo_pmla_exists',
                "label": 'Наличие ПМЛА',
                "type": 'boolean',
                "hint": 'Разработан ли план мероприятий по локализации и ликвидации аварий',
                "defaultValue": False
            },
            {
                "key": 'opo_accident_scenarios',
                "label": 'Сценарии аварий',
                "type": 'object',
                "hint": 'Возможные сценарии аварий на ОПО',
                "nestedFields": [
                    {
                        "key": 'scenario_id',
                        "label": 'Идентификатор сценария',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'description',
                        "label": 'Описание сценария',
                        "type": 'textarea',
                        "hint": 'Подробное описание возможного сценария аварии',
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'max_explosion_weight_t',
                        "label": 'Макс. тротиловый эквивалент, т',
                        "type": 'number',
                        "hint": 'Максимальный вес взрывчатого вещества в тротиловом эквиваленте',
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": None,
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    }
                ],
                "defaultValue": []
            },
            {
                "key": 'opo_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'opo_narrative_description',
                "label": 'Описание ОПО',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'infrastructure',
        "label": 'Инфраструктура',
        "description": 'Инфраструктурные объекты, расположенные на территории ОТИ',
        "icon": 'Construction',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'obj_type',
                "label": 'Тип объекта',
                "type": 'text',
                "placeholder": 'Здание, сооружение, причал, склад, дорога',
                "defaultValue": ''
            },
            {
                "key": 'obj_name',
                "label": 'Наименование объекта',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'length_m',
                "label": 'Длина, м',
                "type": 'number'
            },
            {
                "key": 'width_m',
                "label": 'Ширина, м',
                "type": 'number'
            },
            {
                "key": 'depth_m',
                "label": 'Глубина, м',
                "type": 'number'
            },
            {
                "key": 'area_sqm',
                "label": 'Площадь, кв. м',
                "type": 'number'
            },
            {
                "key": 'perimeter_m',
                "label": 'Периметр, м',
                "type": 'number'
            },
            {
                "key": 'height_m',
                "label": 'Высота, м',
                "type": 'number'
            },
            {
                "key": 'quantity',
                "label": 'Количество',
                "type": 'number',
                "hint": 'Количество однотипных объектов'
            },
            {
                "key": 'capacity_value',
                "label": 'Вместимость (число)',
                "type": 'number'
            },
            {
                "key": 'capacity_unit',
                "label": 'Единица вместимости',
                "type": 'text',
                "placeholder": 'куб. м, т, шт.',
                "defaultValue": ''
            },
            {
                "key": 'voltage_kw',
                "label": 'Напряжение / мощность, кВт',
                "type": 'number'
            },
            {
                "key": 'material',
                "label": 'Материал',
                "type": 'text',
                "placeholder": 'Железобетон, сталь',
                "defaultValue": ''
            },
            {
                "key": 'surface_type',
                "label": 'Тип покрытия',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'cargo_type',
                "label": 'Тип груза',
                "type": 'text',
                "hint": 'Тип груза, для которого предназначен объект',
                "defaultValue": ''
            },
            {
                "key": 'vessel_type',
                "label": 'Тип судна',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'throughput_summer',
                "label": 'Пропускная способность (летний период)',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'throughput_winter',
                "label": 'Пропускная способность (зимний период)',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'is_backup',
                "label": 'Резервный объект',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'is_critical_element',
                "label": 'Критический элемент',
                "type": 'boolean',
                "hint": 'Является ли объект критическим элементом ИТС',
                "defaultValue": False
            },
            {
                "key": 'is_restricted_area',
                "label": 'Зона ограниченного доступа',
                "type": 'boolean',
                "hint": 'Является ли объект зоной ограниченного доступа',
                "defaultValue": False
            },
            {
                "key": 'fence_type',
                "label": 'Тип ограждения',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'has_access_control',
                "label": 'Наличие контроля доступа',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'located_on_name',
                "label": 'Расположение (наименование)',
                "type": 'text',
                "hint": 'Автозаполняется из ссылки на инфраструктуру',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'located_on_infra_ref',
                "label": 'Ссылка на объект расположения',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на инфраструктурный объект, на котором расположен',
                "refSection": 'infrastructure',
                "refLabelField": 'obj_name'
            },
            {
                "key": 'connected_to_name',
                "label": 'Связь с (наименование)',
                "type": 'text',
                "hint": 'Автозаполняется из ссылки на инфраструктуру',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'connected_to_infra_ref',
                "label": 'Ссылка на связанный объект',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на связанный инфраструктурный объект',
                "refSection": 'infrastructure',
                "refLabelField": 'obj_name'
            },
            {
                "key": 'operational_context',
                "label": 'Операционный контекст',
                "type": 'textarea',
                "hint": 'Особенности эксплуатации объекта',
                "defaultValue": ''
            },
            {
                "key": 'narrative_description',
                "label": 'Описание объекта',
                "type": 'textarea',
                "defaultValue": ''
            },
            {
                "key": 'source_doc_ref',
                "label": 'Ссылка на документ-источник',
                "type": 'text',
                "hint": 'Бизнес-ссылка на документ, являющийся источником информации',
                "defaultValue": ''
            },
            {
                "key": 'building_floors',
                "label": 'Этажность здания',
                "type": 'number'
            },
            {
                "key": 'building_fire_resistance',
                "label": 'Огнестойкость здания',
                "type": 'text',
                "placeholder": 'I, II, III, IV',
                "defaultValue": ''
            },
            {
                "key": 'building_purpose',
                "label": 'Назначение здания',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'building_foundation',
                "label": 'Фундамент здания',
                "type": 'text',
                "hint": 'Тип фундамента здания',
                "defaultValue": ''
            },
            {
                "key": 'equipment_brand_model',
                "label": 'Марка / модель оборудования',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'equipment_installation_type',
                "label": 'Тип установки оборудования',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'equipment_operational_status',
                "label": 'Статус эксплуатации оборудования',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'berth_fender_type',
                "label": 'Тип причального понтона / отбойника',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'vessel_ice_class',
                "label": 'Ледовый класс судна',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'soil_type',
                "label": 'Тип грунта',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'ice_regime',
                "label": 'Ледовый режим',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'cargo_packaging_type',
                "label": 'Тип упаковки груза',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'max_vessel_draft_m',
                "label": 'Максимальная осадка судна, м',
                "type": 'number'
            }
        ]
    },

    {
        "key": 'critical_elements',
        "label": 'Критические элементы',
        "description": 'Критические элементы информационно-телекоммуникационной системы (ИТС)',
        "icon": 'AlertTriangle',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'critical_element',
                "label": 'Наименование критического элемента',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'critical_element_ce_infra_ref',
                "label": 'Ссылка на инфраструктуру КЭ',
                "type": 'text',
                "hint": 'Бизнес-ссылка на инфраструктурный объект критического элемента',
                "defaultValue": ''
            },
            {
                "key": 'ce_protection',
                "label": 'Защита критического элемента',
                "type": 'text',
                "hint": 'Описание мер защиты критического элемента',
                "defaultValue": ''
            },
            {
                "key": 'ce_security_implication',
                "label": 'Последствия для безопасности',
                "type": 'textarea',
                "hint": 'Последствия нарушения работоспособности критического элемента',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_ce_protection_tag',
                "label": 'Тег защиты КЭ',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'restricted_access_zones',
        "label": 'Зоны ограниченного доступа',
        "description": 'Зоны ограниченного доступа (РОД) на территории ОТИ',
        "icon": 'Lock',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'rod_name',
                "label": 'Наименование зоны РОД',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'rod_name_rod_infra_ref',
                "label": 'Ссылка на инфраструктуру зоны РОД',
                "type": 'text',
                "hint": 'Бизнес-ссылка на инфраструктурный объект зоны РОД',
                "defaultValue": ''
            },
            {
                "key": 'rod_regime',
                "label": 'Режим зоны РОД',
                "type": 'text',
                "hint": 'Описание пропускного режима',
                "defaultValue": ''
            },
            {
                "key": 'rod_isps_compliance',
                "label": 'Соответствие Кодексу ОСПС/МСПС (ISPS)',
                "type": 'text',
                "hint": 'Сведения о соответствии международным требованиям',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'zoning',
        "label": 'Зонирование',
        "description": 'Зоны транспортной безопасности и их характеристики',
        "icon": 'Grid3X3',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'ztb_boundaries',
                "label": 'Границы зоны транспортной безопасности',
                "type": 'object',
                "hint": 'Координаты границ ЗТБ по сторонам света',
                "nestedFields": [
                    {
                        "key": 'NE',
                        "label": 'Северо-Восток (NE)',
                        "type": 'text',
                        "hint": None,
                        "placeholder": "43°07'N 131°54'E",
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'SW',
                        "label": 'Юго-Запад (SW)',
                        "type": 'text',
                        "hint": None,
                        "placeholder": "43°05'N 131°50'E",
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'E',
                        "label": 'Восток (E)',
                        "type": 'text',
                        "hint": None,
                        "placeholder": "131°54'E",
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'W',
                        "label": 'Запад (W)',
                        "type": 'text',
                        "hint": None,
                        "placeholder": "131°50'E",
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    }
                ],
                "defaultValue": {}
            },
            {
                "key": 'sector_technological',
                "label": 'Технологический сектор',
                "type": 'text',
                "hint": 'Описание технологического сектора ЗТБ',
                "defaultValue": ''
            },
            {
                "key": 'sector_transit',
                "label": 'Транзитная зона',
                "type": 'boolean',
                "hint": 'Включает ли ЗТБ транзитную зону',
                "defaultValue": False
            },
            {
                "key": 'sector_free_access',
                "label": 'Зона свободного доступа',
                "type": 'boolean',
                "hint": 'Включает ли ЗТБ зону свободного доступа',
                "defaultValue": False
            },
            {
                "key": 'critical_element_ref',
                "label": 'Критический элемент',
                "type": 'ref',
                "hint": 'Выберите критический элемент из справочника',
                "refSection": 'critical_elements',
                "refLabelField": 'critical_element'
            },
            {
                "key": 'rod_ref',
                "label": 'Зона РОД',
                "type": 'ref',
                "hint": 'Выберите зону ограниченного доступа из справочника',
                "refSection": 'restricted_access_zones',
                "refLabelField": 'rod_name'
            },
            {
                "key": 'security_zone_status',
                "label": 'Статус зоны безопасности',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'security_zone_ground',
                "label": 'Зона безопасности (суша)',
                "type": 'text',
                "hint": 'Описание наземной зоны безопасности',
                "defaultValue": ''
            },
            {
                "key": 'security_zone_water',
                "label": 'Зона безопасности (вода)',
                "type": 'text',
                "hint": 'Описание водной зоны безопасности',
                "defaultValue": ''
            },
            {
                "key": 'security_zone_air',
                "label": 'Зона безопасности (воздух), м',
                "type": 'number',
                "hint": 'Высота воздушной зоны безопасности в метрах'
            },
            {
                "key": 'is_zop_established',
                "label": 'ЗОП установлена',
                "type": 'boolean',
                "hint": 'Установлена ли зона оценки показателей безопасности',
                "defaultValue": False
            },
            {
                "key": 'ztb_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'ztb_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_security_zone_tag',
                "label": 'Тег зоны безопасности',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'ptb',
        "label": 'Подразделения транспортной безопасности (ПТБ)',
        "description": 'Сведения о подразделениях транспортной безопасности, обеспечивающих защиту ОТИ',
        "icon": 'ShieldCheck',
        "fields": [
            {
                "key": 'sti_ref',
                "label": 'Ссылка на СТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на субъект транспортной инфраструктуры',
                "refSection": 'sti',
                "refLabelField": 'sti_full_name'
            },
            {
                "key": 'ptb_oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'ptb_name',
                "label": 'Наименование ПТБ',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'ptb_accreditation_num',
                "label": 'Номер аккредитации ПТБ',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'ptb_accreditation_date',
                "label": 'Дата аккредитации',
                "type": 'date'
            },
            {
                "key": 'ptb_accreditation_exp_date',
                "label": 'Дата окончания аккредитации',
                "type": 'date'
            },
            {
                "key": 'ptb_narrative_description',
                "label": 'Описание ПТБ',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'ptb_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'ptb_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_ptb_accreditation_tag',
                "label": 'Тег аккредитации ПТБ',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_gbr_exists_tag',
                "label": 'Тег наличия ГБР',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации (ГБР — группа быстрого реагирования)',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'ptb_contracts',
        "label": 'Договоры ПТБ',
        "description": 'Договоры подразделений транспортной безопасности',
        "icon": 'FileSignature',
        "fields": [
            {
                "key": 'ptb_ref',
                "label": 'Ссылка на ПТБ',
                "type": 'ref',
                "hint": 'Выберите подразделение транспортной безопасности',
                "refSection": 'ptb',
                "refLabelField": 'ptb_name'
            },
            {
                "key": 'contract_name',
                "label": 'Наименование договора',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'contract_num',
                "label": 'Номер договора',
                "type": 'text',
                "placeholder": 'Д-2024-001',
                "defaultValue": ''
            },
            {
                "key": 'contract_date',
                "label": 'Дата договора',
                "type": 'date'
            },
            {
                "key": 'contract_exp_date',
                "label": 'Дата окончания договора',
                "type": 'date'
            },
            {
                "key": 'is_prolonged',
                "label": 'Пролонгирован',
                "type": 'boolean',
                "hint": 'Был ли договор пролонгирован',
                "defaultValue": False
            },
            {
                "key": 'prolongation_date',
                "label": 'Дата пролонгации',
                "type": 'date'
            },
            {
                "key": 'prolongation_new_exp_date',
                "label": 'Новая дата окончания после пролонгации',
                "type": 'date'
            },
            {
                "key": 'contract_is_maintenance',
                "label": 'Договор на ТО',
                "type": 'boolean',
                "hint": 'Является ли договор договором на техническое обслуживание',
                "defaultValue": False
            }
        ]
    },

    {
        "key": 'maintenance_contracts',
        "label": 'Договоры на ТО',
        "description": 'Договоры на техническое обслуживание инженерных сооружений и ТСО',
        "icon": 'FileSignature',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Выберите объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'ptb_ref',
                "label": 'Ссылка на ПТБ',
                "type": 'ref',
                "hint": 'Выберите подразделение транспортной безопасности',
                "refSection": 'ptb',
                "refLabelField": 'ptb_name'
            },
            {
                "key": 'contract_name',
                "label": 'Наименование договора',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'contract_num',
                "label": 'Номер договора',
                "type": 'text',
                "placeholder": 'ТО-2024-001',
                "defaultValue": ''
            },
            {
                "key": 'contract_date',
                "label": 'Дата договора',
                "type": 'date'
            },
            {
                "key": 'contract_exp_date',
                "label": 'Дата окончания договора',
                "type": 'date'
            },
            {
                "key": 'contract_provider',
                "label": 'Исполнитель',
                "type": 'text',
                "hint": 'Организация-исполнитель по договору',
                "defaultValue": ''
            },
            {
                "key": 'contract_scope',
                "label": 'Предмет договора',
                "type": 'textarea',
                "hint": 'Описание предмета и объёма работ',
                "defaultValue": ''
            },
            {
                "key": 'contract_is_active',
                "label": 'Договор активен',
                "type": 'boolean',
                "hint": 'Действует ли договор на данный момент',
                "defaultValue": True
            }
        ]
    },

    {
        "key": 'ptb_supplementary_agreements',
        "label": 'Дополнительные соглашения',
        "description": 'Дополнительные соглашения к договорам с ПТБ',
        "icon": 'FileSignature',
        "fields": [
            {
                "key": 'contract_ref',
                "label": 'Ссылка на договор',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на основной договор',
                "refSection": 'contracts',
                "refLabelField": 'contract_name'
            },
            {
                "key": 'agreement_name',
                "label": 'Наименование соглашения',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'agreement_num',
                "label": 'Номер соглашения',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'agreement_date',
                "label": 'Дата соглашения',
                "type": 'date'
            },
            {
                "key": 'agreement_exp_date',
                "label": 'Дата окончания соглашения',
                "type": 'date'
            },
            {
                "key": 'agreement_type',
                "label": 'Тип соглашения',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'agreement_description',
                "label": 'Описание соглашения',
                "type": 'textarea',
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'posts',
        "label": 'Посты',
        "description": 'Посты транспортной безопасности',
        "icon": 'Fence',
        "fields": [
            {
                "key": 'ptb_ref',
                "label": 'Ссылка на ПТБ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на подразделение транспортной безопасности',
                "refSection": 'ptb',
                "refLabelField": 'ptb_name'
            },
            {
                "key": 'post_name',
                "label": 'Наименование поста',
                "type": 'text',
                "placeholder": 'КПП №1',
                "defaultValue": ''
            },
            {
                "key": 'post_location',
                "label": 'Местоположение поста',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'post_location_infra_ref',
                "label": 'Ссылка на инфраструктуру поста',
                "type": 'text',
                "hint": 'Бизнес-ссылка на инфраструктурный объект, на котором расположен пост',
                "defaultValue": ''
            },
            {
                "key": 'post_staff_count',
                "label": 'Количество сотрудников на посту',
                "type": 'number'
            },
            {
                "key": 'post_regime',
                "label": 'Режим работы поста',
                "type": 'text',
                "placeholder": 'Круглосуточно',
                "defaultValue": ''
            },
            {
                "key": 'post_tasks',
                "label": 'Задачи поста',
                "type": 'textarea',
                "hint": 'Перечень задач, выполняемых на посту',
                "defaultValue": ''
            },
            {
                "key": 'post_special_conditions',
                "label": 'Особые условия',
                "type": 'textarea',
                "hint": 'Особые условия несения службы на посту',
                "defaultValue": ''
            },
            {
                "key": 'post_type',
                "label": 'Тип поста',
                "type": 'text',
                "placeholder": 'КПП, контрольно-пропускной пункт, наблюдательный пост',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'post_is_temporary',
                "label": 'Временный пост',
                "type": 'boolean',
                "hint": 'Является ли пост временным',
                "defaultValue": False
            },
            {
                "key": 'post_is_additional',
                "label": 'Дополнительный пост',
                "type": 'boolean',
                "hint": 'Является ли пост дополнительным',
                "defaultValue": False
            },
            {
                "key": 'post_is_uav_counter',
                "label": 'Пост противодействия БПЛА',
                "type": 'boolean',
                "hint": 'Оснащён ли пост средствами противодействия беспилотным летательным аппаратам',
                "defaultValue": False
            },
            {
                "key": 'qdrant_gbr_exists_tag',
                "label": 'Тег наличия ГБР',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'post_staff',
        "label": 'Сотрудники постов',
        "description": 'Назначение сотрудников из справочника лиц на посты транспортной безопасности. Выберите лицо из справочника — данные автозаполнятся.',
        "icon": 'UserCheck',
        "fields": [
            {
                "key": 'post_ref',
                "label": 'Ссылка на пост',
                "type": 'ref',
                "hint": 'Выберите пост транспортной безопасности',
                "refSection": 'posts',
                "refLabelField": 'post_name'
            },
            {
                "key": '_v_person_ref',
                "label": 'Выбрать из справочника лиц',
                "type": 'ref',
                "hint": 'Выберите лицо — ФИО, должность и данные об аттестации заполнятся автоматически',
                "refSection": 'persons',
                "refLabelField": 'person_fio',
                "virtual": True,
                "refAutoFill": {
                    "staff_fio": 'person_fio',
                    "staff_position": 'person_position',
                    "staff_attestation_category": 'person_attestation_category',
                    "staff_attestation_num": 'person_attestation_num',
                    "staff_attestation_date": 'person_attestation_date',
                    "staff_attestation_exp_date": 'person_attestation_exp_date'
                }
            },
            {
                "key": 'staff_fio',
                "label": 'ФИО',
                "type": 'text',
                "hint": 'Автозаполняется при выборе из справочника; можно изменить вручную',
                "placeholder": 'Иванов Иван Иванович',
                "defaultValue": '',
                "autoFilled": True
            },
            {
                "key": 'staff_position',
                "label": 'Должность',
                "type": 'text',
                "hint": 'Автозаполняется при выборе из справочника; можно изменить вручную',
                "placeholder": 'Сотрудник ПТБ',
                "defaultValue": '',
                "autoFilled": True
            },
            {
                "key": 'staff_attestation_category',
                "label": 'Категория аттестации',
                "type": 'select',
                "hint": 'Автозаполняется из справочника лиц',
                "options": [
                    'I',
                    'II',
                    'III',
                    'IV'
                ],
                "autoFilled": True
            },
            {
                "key": 'staff_attestation_num',
                "label": 'Номер аттестации',
                "type": 'text',
                "hint": 'Автозаполняется из справочника лиц',
                "defaultValue": '',
                "autoFilled": True
            },
            {
                "key": 'staff_attestation_date',
                "label": 'Дата аттестации',
                "type": 'date',
                "hint": 'Автозаполняется из справочника лиц',
                "autoFilled": True
            },
            {
                "key": 'staff_attestation_exp_date',
                "label": 'Срок действия аттестации',
                "type": 'date',
                "hint": 'Автозаполняется из справочника лиц',
                "autoFilled": True
            },
            {
                "key": 'staff_is_active',
                "label": 'Назначен на пост',
                "type": 'boolean',
                "hint": 'Активно ли назначение на данный момент',
                "defaultValue": True
            },
            {
                "key": 'staff_security_level_1',
                "label": 'Допуск 1-го уровня',
                "type": 'boolean',
                "hint": 'Имеет ли сотрудник допуск к сведениям 1-го уровня безопасности',
                "defaultValue": True
            },
            {
                "key": 'staff_security_level_2',
                "label": 'Допуск 2-го уровня',
                "type": 'boolean',
                "hint": 'Имеет ли сотрудник допуск к сведениям 2-го уровня безопасности',
                "defaultValue": True
            },
            {
                "key": 'staff_security_level_3',
                "label": 'Допуск 3-го уровня',
                "type": 'boolean',
                "hint": 'Имеет ли сотрудник допуск к сведениям 3-го уровня безопасности',
                "defaultValue": True
            },
            {
                "key": 'staff_has_uav_authority',
                "label": 'Полномочия по противодействию БПЛА',
                "type": 'boolean',
                "hint": 'Имеет ли сотрудник полномочия по противодействию БПЛА',
                "defaultValue": False
            }
        ]
    },

    {
        "key": 'post_equipment',
        "label": 'Оборудование постов',
        "description": 'Технические средства и оборудование, установленные на постах транспортной безопасности. Можно выбрать из каталога ТСО — данные заполнятся автоматически.',
        "icon": 'Camera',
        "fields": [
            {
                "key": 'post_ref',
                "label": 'Ссылка на пост',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на пост транспортной безопасности',
                "refSection": 'posts',
                "refLabelField": 'post_name'
            },
            {
                "key": '_v_catalog_tsotb_ref',
                "label": 'Выбрать из каталога ТСО',
                "type": 'ref',
                "hint": 'Выберите ТСО из каталога — категория, наименование и модель заполнятся автоматически',
                "refSection": 'tsotb_catalog',
                "refLabelField": 'catalog_display_name',
                "virtual": True,
                "refAutoFill": {
                    "equipment_category": 'catalog_category_tsotb',
                    "equipment_name": 'catalog_display_name',
                    "equipment_brand_model": 'catalog_model'
                }
            },
            {
                "key": 'equipment_category',
                "label": 'Категория оборудования',
                "type": 'text',
                "placeholder": 'Инспекторские комплексы, досмотровое оборудование',
                "defaultValue": '',
                "autoFilled": True
            },
            {
                "key": 'equipment_name',
                "label": 'Наименование оборудования',
                "type": 'text',
                "defaultValue": '',
                "autoFilled": True
            },
            {
                "key": 'equipment_brand_model',
                "label": 'Марка / модель',
                "type": 'text',
                "defaultValue": '',
                "autoFilled": True
            },
            {
                "key": 'equipment_qty',
                "label": 'Количество',
                "type": 'number',
                "defaultValue": 1
            },
            {
                "key": 'equipment_is_certified_pp969',
                "label": 'Сертифицировано (Пост. №969)',
                "type": 'boolean',
                "hint": 'Прошло ли оборудование сертификацию по Постановлению Правительства №969',
                "defaultValue": False
            },
            {
                "key": 'equipment_certification_num',
                "label": 'Номер сертификата',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'equipment_certification_date',
                "label": 'Дата сертификации',
                "type": 'date'
            },
            {
                "key": 'equipment_certification_exp_date',
                "label": 'Дата окончания сертификации',
                "type": 'date'
            },
            {
                "key": 'equipment_certification_doc_scan',
                "label": 'Скан документа сертификации',
                "type": 'text',
                "hint": 'Путь к файлу скана сертификата',
                "defaultValue": ''
            },
            {
                "key": 'equipment_service_exp_date',
                "label": 'Дата окончания обслуживания',
                "type": 'date'
            },
            {
                "key": 'equipment_narrative_context',
                "label": 'Описание / контекст',
                "type": 'textarea',
                "defaultValue": ''
            },
            {
                "key": 'qdrant_gbr_exists_tag',
                "label": 'Тег наличия ГБР',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'tsotb_catalog',
        "label": 'Каталог ТСОТБ',
        "description": 'Каталог технических средств обеспечения транспортной безопасности',
        "icon": 'Cctv',
        "fields": [
            {
                "key": 'catalog_display_name',
                "label": 'Наименование ТСОТБ',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'catalog_manufacturer',
                "label": 'Производитель',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'catalog_model',
                "label": 'Модель',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'catalog_category_tsotb',
                "label": 'Категория ТСОТБ',
                "type": 'text',
                "hint": 'Категория средства по номенклатуре ТСОТБ',
                "defaultValue": ''
            },
            {
                "key": 'catalog_functions_tags',
                "label": 'Функциональные теги',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "defaultValue": []
            },
            {
                "key": 'catalog_pp969_required',
                "label": 'Требуется сертификация (ПП №969)',
                "type": 'boolean',
                "hint": 'Подлежит ли обязательной сертификации по ПП №969',
                "defaultValue": True
            },
            {
                "key": 'catalog_default_detection_range_m',
                "label": 'Дальность обнаружения по умолчанию, м',
                "type": 'number'
            },
            {
                "key": 'catalog_default_identification_range_m',
                "label": 'Дальность опознавания по умолчанию, м',
                "type": 'number'
            },
            {
                "key": 'catalog_operating_temp_min_c',
                "label": 'Мин. рабочая температура, °C',
                "type": 'number'
            },
            {
                "key": 'catalog_operating_temp_max_c',
                "label": 'Макс. рабочая температура, °C',
                "type": 'number'
            },
            {
                "key": 'catalog_power_consumption_w',
                "label": 'Потребляемая мощность, Вт',
                "type": 'number'
            },
            {
                "key": 'catalog_climate_tag',
                "label": 'Климатический тег',
                "type": 'text',
                "hint": 'Тег климатического исполнения',
                "defaultValue": ''
            },
            {
                "key": 'catalog_narrative_template',
                "label": 'Шаблон описания ТСОТБ',
                "type": 'textarea',
                "hint": 'Шаблон текстового описания для использования в документах',
                "defaultValue": ''
            },
            {
                "key": 'catalog_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'catalog_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            }
        ]
    },

    {
        "key": 'tsotb_instances',
        "label": 'Экземпляры ТСОТБ',
        "description": 'Развернутые экземпляры технических средств обеспечения транспортной безопасности',
        "icon": 'Camera',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'catalog_tsotb_ref',
                "label": 'Ссылка на каталог ТСОТБ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на запись в каталоге ТСОТБ',
                "refSection": 'tsotb_catalog',
                "refLabelField": 'catalog_tsotb_name'
            },
            {
                "key": 'tsotb_serial_num',
                "label": 'Серийный номер',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'tsotb_quantity',
                "label": 'Количество',
                "type": 'number',
                "defaultValue": 1
            },
            {
                "key": 'tsotb_location_name',
                "label": 'Местоположение (наименование)',
                "type": 'text',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'tsotb_location_infra_ref',
                "label": 'Ссылка на инфраструктуру местоположения',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на инфраструктурный объект местоположения',
                "refSection": 'infrastructure',
                "refLabelField": 'obj_name'
            },
            {
                "key": 'tsotb_monitors_object_name',
                "label": 'Контролируемый объект (наименование)',
                "type": 'text',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'tsotb_monitors_infra_ref',
                "label": 'Ссылка на контролируемую инфраструктуру',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на контролируемый инфраструктурный объект',
                "refSection": 'infrastructure',
                "refLabelField": 'obj_name'
            },
            {
                "key": 'tsotb_powered_from_name',
                "label": 'Источник питания (наименование)',
                "type": 'text',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'tsotb_powered_from_infra_ref',
                "label": 'Ссылка на источник питания',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на инфраструктурный объект — источник питания',
                "refSection": 'infrastructure',
                "refLabelField": 'obj_name'
            },
            {
                "key": 'tsotb_post_ref',
                "label": 'Ссылка на пост',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на пост транспортной безопасности',
                "refSection": 'posts',
                "refLabelField": 'post_name'
            },
            {
                "key": 'tsotb_is_certified_pp969',
                "label": 'Сертифицировано (ПП №969)',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'tsotb_certification_num',
                "label": 'Номер сертификата',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'tsotb_certification_date',
                "label": 'Дата сертификации',
                "type": 'date'
            },
            {
                "key": 'tsotb_certification_exp_date',
                "label": 'Дата окончания сертификации',
                "type": 'date'
            },
            {
                "key": 'tsotb_certification_scope',
                "label": 'Область сертификации',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'tsotb_certification_issuing_body',
                "label": 'Орган, выдавший сертификат',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'tsotb_certification_doc_scan',
                "label": 'Скан документа сертификации',
                "type": 'text',
                "hint": 'Путь к файлу скана сертификата',
                "defaultValue": ''
            },
            {
                "key": 'tsotb_certification_doc_hash',
                "label": 'Хэш документа сертификации',
                "type": 'text',
                "hint": 'Хэш-сумма файла сертификата для верификации',
                "defaultValue": ''
            },
            {
                "key": 'tsotb_installation_date',
                "label": 'Дата установки',
                "type": 'date'
            },
            {
                "key": 'tsotb_service_exp_date',
                "label": 'Дата окончания обслуживания',
                "type": 'date'
            },
            {
                "key": 'tsotb_last_maintenance_date',
                "label": 'Дата последнего ТО',
                "type": 'date'
            },
            {
                "key": 'tsotb_operational_status',
                "label": 'Эксплуатационный статус',
                "type": 'select',
                "hint": 'Текущий статус эксплуатации ТСОТБ',
                "options": [
                    'in_service',
                    'in_storage',
                    'decommissioned'
                ],
                "defaultValue": 'in_service'
            },
            {
                "key": 'tsotb_maintenance_contract_ref',
                "label": 'Ссылка на договор ТО',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на договор технического обслуживания',
                "refSection": 'contracts',
                "refLabelField": 'contract_name'
            },
            {
                "key": 'tsotb_narrative_description',
                "label": 'Описание экземпляра ТСОТБ',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'tsotb_operational_context',
                "label": 'Операционный контекст',
                "type": 'textarea',
                "hint": 'Особенности эксплуатации конкретного экземпляра',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'tsotb_security_implication',
                "label": 'Последствия для безопасности',
                "type": 'textarea',
                "hint": 'Последствия вывода из строя данного ТСОТБ',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_tsotb_category_tag',
                "label": 'Тег категории ТСОТБ',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_certified_pp969_tag',
                "label": 'Тег сертификации ПП №969',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_tsotb_function_tag',
                "label": 'Тег функции ТСОТБ',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_climate_resistance_tag',
                "label": 'Тег климатической устойчивости',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'tsotb_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'tsotb_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'tsotb_compliance_check_result',
                "label": 'Результат проверки соответствия',
                "type": 'text',
                "hint": 'Результат последней проверки соответствия требованиям',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'eng_catalog',
        "label": 'Каталог инженерно-технических средств (ИСО)',
        "description": 'Каталог инженерно-технических средств обеспечения транспортной безопасности',
        "icon": 'Fence',
        "fields": [
            {
                "key": 'eng_catalog_display_name',
                "label": 'Наименование ИСО',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_catalog_manufacturer',
                "label": 'Производитель',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_catalog_model',
                "label": 'Модель',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_catalog_category',
                "label": 'Категория ИСО',
                "type": 'text',
                "hint": 'Категория по номенклатуре ИСО',
                "defaultValue": ''
            },
            {
                "key": 'eng_catalog_functions',
                "label": 'Функциональные теги',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "defaultValue": []
            },
            {
                "key": 'eng_catalog_gost_reference',
                "label": 'Ссылка на ГОСТ',
                "type": 'text',
                "hint": 'Нормативный документ (ГОСТ), регламентирующий ИСО',
                "defaultValue": ''
            },
            {
                "key": 'eng_catalog_pp969_applicable',
                "label": 'Подлежит сертификации (ПП №969)',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'eng_catalog_default_material',
                "label": 'Материал по умолчанию',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_catalog_default_height_m',
                "label": 'Высота по умолчанию, м',
                "type": 'number'
            },
            {
                "key": 'eng_catalog_default_thickness_mm',
                "label": 'Толщина по умолчанию, мм',
                "type": 'number'
            },
            {
                "key": 'eng_catalog_default_load_capacity_t',
                "label": 'Нагрузочная способность по умолчанию, т',
                "type": 'number'
            },
            {
                "key": 'eng_catalog_default_intrusion_delay_min',
                "label": 'Задержка проникновения по умолчанию, мин',
                "type": 'number',
                "hint": 'Время задержки несанкционированного проникновения'
            },
            {
                "key": 'eng_catalog_default_top_height_m',
                "label": 'Высота верхней козырьковой части по умолчанию, м',
                "type": 'number'
            },
            {
                "key": 'eng_catalog_default_bottom_depth_m',
                "label": 'Глубина заглубления по умолчанию, м',
                "type": 'number'
            },
            {
                "key": 'eng_catalog_climate_tag',
                "label": 'Климатический тег',
                "type": 'text',
                "hint": 'Тег климатического исполнения',
                "defaultValue": ''
            },
            {
                "key": 'eng_catalog_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'eng_catalog_narrative_template',
                "label": 'Шаблон описания ИСО',
                "type": 'textarea',
                "hint": 'Шаблон текстового описания для использования в документах',
                "defaultValue": ''
            },
            {
                "key": 'eng_catalog_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'qdrant_eng_category_tag',
                "label": 'Тег категории ИСО',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_eng_function_tag',
                "label": 'Тег функции ИСО',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'eng_instances',
        "label": 'Экземпляры ИСО',
        "description": 'Развернутые экземпляры инженерно-технических средств обеспечения транспортной безопасности',
        "icon": 'Lock',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'catalog_eng_ref',
                "label": 'Ссылка на каталог ИСО',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на запись в каталоге ИСО',
                "refSection": 'eng_catalog',
                "refLabelField": 'eng_catalog_name'
            },
            {
                "key": 'eng_instance_name',
                "label": 'Наименование экземпляра ИСО',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_serial_num',
                "label": 'Серийный номер',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_quantity',
                "label": 'Количество',
                "type": 'number',
                "defaultValue": 1
            },
            {
                "key": 'eng_instance_segment_number',
                "label": 'Номер сегмента (участка)',
                "type": 'number',
                "hint": 'Номер участка периметра, на котором установлен экземпляр ИСО'
            },
            {
                "key": 'eng_instance_location_name',
                "label": 'Местоположение (наименование)',
                "type": 'text',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_location_infra_ref',
                "label": 'Ссылка на инфраструктуру местоположения',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на инфраструктурный объект местоположения',
                "refSection": 'infrastructure',
                "refLabelField": 'obj_name'
            },
            {
                "key": 'eng_instance_protects_ce',
                "label": 'Защищает критический элемент',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'eng_instance_protects_ce_infra_ref',
                "label": 'Ссылка на защищаемый КЭ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на защищаемый критический элемент',
                "refSection": 'critical_elements',
                "refLabelField": 'critical_element'
            },
            {
                "key": 'eng_instance_protects_rod',
                "label": 'Защищает зону РОД',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'eng_instance_protects_rod_infra_ref',
                "label": 'Ссылка на защищаемую зону РОД',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на защищаемую зону ограниченного доступа',
                "refSection": 'restricted_access_zones',
                "refLabelField": 'rod_name'
            },
            {
                "key": 'eng_instance_length_m',
                "label": 'Длина, м',
                "type": 'number'
            },
            {
                "key": 'eng_instance_main_material',
                "label": 'Основной материал',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_main_type',
                "label": 'Основной тип',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_main_height_m',
                "label": 'Высота основной части, м',
                "type": 'number'
            },
            {
                "key": 'eng_instance_main_thickness_mm',
                "label": 'Толщина основной части, мм',
                "type": 'number'
            },
            {
                "key": 'eng_instance_main_is_removable',
                "label": 'Съёмная основная часть',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'eng_instance_main_gost_compliance',
                "label": 'Соответствие ГОСТ (основная часть)',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_top_exists',
                "label": 'Наличие верхней (козырьковой) части',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'eng_instance_top_type',
                "label": 'Тип верхней части',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_top_material',
                "label": 'Материал верхней части',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_top_height_m',
                "label": 'Высота верхней части, м',
                "type": 'number'
            },
            {
                "key": 'eng_instance_top_angle_deg',
                "label": 'Угол наклона верхней части, град.',
                "type": 'number'
            },
            {
                "key": 'eng_instance_top_gost_compliance',
                "label": 'Соответствие ГОСТ (верхняя часть)',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_bottom_exists',
                "label": 'Наличие нижней (заглублённой) части',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'eng_instance_bottom_type',
                "label": 'Тип нижней части',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_bottom_material',
                "label": 'Материал нижней части',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_bottom_depth_m',
                "label": 'Глубина заглубления, м',
                "type": 'number'
            },
            {
                "key": 'eng_instance_bottom_width_m',
                "label": 'Ширина нижней части, м',
                "type": 'number'
            },
            {
                "key": 'eng_instance_bottom_gost_compliance',
                "label": 'Соответствие ГОСТ (нижняя часть)',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_total_height_m',
                "label": 'Общая высота, м',
                "type": 'number'
            },
            {
                "key": 'eng_instance_protection_level',
                "label": 'Уровень защиты',
                "type": 'text',
                "hint": 'Класс защитной устойчивости ИСО',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_intrusion_delay_min',
                "label": 'Задержка проникновения, мин',
                "type": 'number',
                "hint": 'Время задержки несанкционированного проникновения'
            },
            {
                "key": 'eng_instance_load_capacity_t',
                "label": 'Нагрузочная способность, т',
                "type": 'number'
            },
            {
                "key": 'eng_instance_locking_type',
                "label": 'Тип запирающего устройства',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_has_access_control',
                "label": 'Наличие системы контроля доступа',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'eng_instance_has_barbed_wire',
                "label": 'Наличие армированной ленты / колючей проволоки',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'eng_instance_has_top_obstacle',
                "label": 'Наличие верхнего инженерного препятствия',
                "type": 'boolean',
                "defaultValue": False
            },
            {
                "key": 'eng_instance_window_protection_type',
                "label": 'Тип защиты окон',
                "type": 'text',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_airlock_capacity',
                "label": 'Вместимость шлюза (тамбура)',
                "type": 'number',
                "hint": 'Количество людей, проходящих через шлюз одновременно'
            },
            {
                "key": 'eng_instance_platform_vehicle_capacity',
                "label": 'Вместимость платформы (транспорт)',
                "type": 'number',
                "hint": 'Вместимость в транспортных единицах'
            },
            {
                "key": 'eng_instance_operational_status',
                "label": 'Эксплуатационный статус',
                "type": 'select',
                "hint": 'Текущий статус эксплуатации ИСО',
                "options": [
                    'in_service',
                    'in_storage',
                    'decommissioned'
                ],
                "defaultValue": 'in_service'
            },
            {
                "key": 'eng_instance_is_seasonal',
                "label": 'Сезонная установка',
                "type": 'boolean',
                "hint": 'Является ли ИСО сезонно демонтируемым',
                "defaultValue": False
            },
            {
                "key": 'eng_instance_seasonal_removal_period',
                "label": 'Период демонтажа',
                "type": 'text',
                "hint": 'Период, в который ИСО демонтируется (например, «июнь—август»)',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_installation_date',
                "label": 'Дата установки',
                "type": 'date'
            },
            {
                "key": 'eng_instance_last_inspection_date',
                "label": 'Дата последней проверки',
                "type": 'date'
            },
            {
                "key": 'eng_instance_next_inspection_date',
                "label": 'Дата следующей проверки',
                "type": 'date'
            },
            {
                "key": 'eng_instance_defects_description',
                "label": 'Описание дефектов',
                "type": 'textarea',
                "hint": 'Описание выявленных дефектов и повреждений',
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_maintenance_contract_ref',
                "label": 'Ссылка на договор ТО',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на договор технического обслуживания',
                "refSection": 'contracts',
                "refLabelField": 'contract_name'
            },
            {
                "key": 'eng_instance_security_implication',
                "label": 'Последствия для безопасности',
                "type": 'textarea',
                "hint": 'Последствия вывода из строя данного ИСО',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_operational_context',
                "label": 'Операционный контекст',
                "type": 'textarea',
                "hint": 'Особенности эксплуатации конкретного экземпляра ИСО',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_eng_material_tag',
                "label": 'Тег материала ИСО',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_eng_gost_tag',
                "label": 'Тег соответствия ГОСТ',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_eng_seasonal_tag',
                "label": 'Тег сезонности ИСО',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_eng_condition_tag',
                "label": 'Тег состояния ИСО',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_ce_protection_tag',
                "label": 'Тег защиты КЭ',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'eng_instance_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'eng_instance_regulatory_triggers',
                "label": 'Нормативные триггеры',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            },
            {
                "key": 'eng_instance_compliance_check_result',
                "label": 'Результат проверки соответствия',
                "type": 'text',
                "hint": 'Результат последней проверки соответствия требованиям',
                "readOnly": True,
                "defaultValue": ''
            }
        ]
    },

    {
        "key": 'climate_context',
        "label": 'Климатический контекст',
        "description": 'Климатические условия, соседние объекты и модель нарушителя для ОТИ',
        "icon": 'Thermometer',
        "fields": [
            {
                "key": 'oti_ref',
                "label": 'Ссылка на ОТИ',
                "type": 'ref',
                "hint": 'Бизнес-ссылка на объект транспортной инфраструктуры',
                "refSection": 'oti',
                "refLabelField": 'oti_full_name'
            },
            {
                "key": 'climate_zone',
                "label": 'Климатическая зона',
                "type": 'text',
                "placeholder": 'I, II, III, IV',
                "defaultValue": ''
            },
            {
                "key": 'temp_min_c',
                "label": 'Минимальная температура, °C',
                "type": 'number',
                "hint": 'Абсолютный минимум температуры'
            },
            {
                "key": 'wind_max_ms',
                "label": 'Максимальная скорость ветра, м/с',
                "type": 'number'
            },
            {
                "key": 'hydro_flood_risk',
                "label": 'Риск затопления',
                "type": 'boolean',
                "hint": 'Существует ли риск затопления территории ОТИ',
                "defaultValue": False
            },
            {
                "key": 'climate_hydro_description',
                "label": 'Гидрометеорологическое описание',
                "type": 'textarea',
                "hint": 'Подробное описание гидрометеорологических условий',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'climate_narrative_description',
                "label": 'Климатическое описание',
                "type": 'textarea',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'neighbor_objects',
                "label": 'Соседние объекты',
                "type": 'object',
                "hint": 'Список соседних объектов, влияющих на безопасность ОТИ',
                "nestedFields": [
                    {
                        "key": 'name',
                        "label": 'Наименование объекта',
                        "type": 'text',
                        "hint": None,
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'dist',
                        "label": 'Расстояние, м',
                        "type": 'number',
                        "hint": 'Расстояние от ОТИ до соседнего объекта',
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": None,
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    }
                ],
                "defaultValue": []
            },
            {
                "key": 'neighbor_interaction_type',
                "label": 'Тип взаимодействия с соседними объектами',
                "type": 'object',
                "hint": 'Характеристики взаимодействия с соседними объектами',
                "nestedFields": [
                    {
                        "key": 'physical',
                        "label": 'Физическое взаимодействие',
                        "type": 'text',
                        "hint": 'Описание физического взаимодействия (общие границы, коммуникации)',
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'operational',
                        "label": 'Операционное взаимодействие',
                        "type": 'text',
                        "hint": 'Описание совместной операционной деятельности',
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    },
                    {
                        "key": 'emergency',
                        "label": 'Взаимодействие при ЧС',
                        "type": 'text',
                        "hint": 'Описание взаимодействия в чрезвычайных ситуациях',
                        "placeholder": None,
                        "options": None,
                        "readOnly": None,
                        "nestedFields": None,
                        "defaultValue": '',
                        "refSection": None,
                        "refLabelField": None,
                        "virtual": None,
                        "refAutoFill": None,
                        "autoFilled": None
                    }
                ],
                "defaultValue": {}
            },
            {
                "key": 'threats_ranking',
                "label": 'Рейтинг угроз',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "defaultValue": []
            },
            {
                "key": 'intruders_ranking',
                "label": 'Рейтинг нарушителей',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "defaultValue": []
            },
            {
                "key": 'project_intruder_model',
                "label": 'Проектная модель нарушителя',
                "type": 'textarea',
                "hint": 'Описание возможных типов нарушителей и их характеристик',
                "defaultValue": ''
            },
            {
                "key": 'max_casualties',
                "label": 'Максимальные возможные жертвы',
                "type": 'number',
                "hint": 'Максимальное расчётное число жертв при реализации угрозы'
            },
            {
                "key": 'max_damage_rub',
                "label": 'Максимальный ущерб, руб.',
                "type": 'number',
                "hint": 'Максимальный расчётный материальный ущерб в рублях'
            },
            {
                "key": 'isps_compliance',
                "label": 'Соответствие ISPS',
                "type": 'boolean',
                "hint": 'Соответствует ли ОТИ требованиям Кодекса ОСПС/МСПС',
                "defaultValue": False
            },
            {
                "key": 'compliance_result',
                "label": 'Результат проверки соответствия',
                "type": 'boolean',
                "hint": 'Результат проверки соответствия требованиям транспортной безопасности',
                "defaultValue": False
            },
            {
                "key": 'qdrant_climate_zone_tag',
                "label": 'Тег климатической зоны',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_flood_risk_tag',
                "label": 'Тег риска затопления',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'qdrant_compliance_tag',
                "label": 'Тег соответствия',
                "type": 'text',
                "hint": 'Тег для поиска и кластеризации',
                "readOnly": True,
                "defaultValue": ''
            },
            {
                "key": 'climate_target_doc_sections',
                "label": 'Разделы целевого документа',
                "type": 'array',
                "hint": 'Введите значения через запятую',
                "readOnly": True,
                "defaultValue": []
            }
        ]
    }
]


# =============================================================================
# Helper functions
# =============================================================================


def get_empty_row(section_key: str) -> dict:
    """Return an empty data row for the given section key.

    Virtual fields are excluded. Default values are applied based on field type.
    """
    section = next((s for s in SCHEMA_SECTIONS if s["key"] == section_key), None)
    if not section:
        return {}
    row: dict = {}
    for field in section["fields"]:
        if field.get("virtual"):
            continue
        dv = field.get("defaultValue")
        ft = field["type"]
        if ft == "object" and field.get("nestedFields"):
            if isinstance(dv, list):
                row[field["key"]] = list(dv)
            elif isinstance(dv, dict):
                row[field["key"]] = dict(dv)
            else:
                row[field["key"]] = dv if dv is not None else {}
        elif ft == "array":
            row[field["key"]] = list(dv) if isinstance(dv, list) else []
        elif ft == "boolean":
            row[field["key"]] = dv if isinstance(dv, bool) else False
        elif ft in ("number", "date", "ref"):
            row[field["key"]] = dv
        else:
            row[field["key"]] = dv if dv is not None else ""
    return row


def get_virtual_field_keys() -> dict[str, set[str]]:
    """Return mapping of section key -> set of virtual field keys.

    Virtual fields are UI-only and should be stripped before saving/exporting.
    """
    result: dict[str, set[str]] = {}
    for section in SCHEMA_SECTIONS:
        vkeys = {f["key"] for f in section["fields"] if f.get("virtual")}
        if vkeys:
            result[section["key"]] = vkeys
    return result


def get_ref_auto_fill_mappings() -> dict[str, dict[str, dict[str, str]]]:
    """Return refAutoFill mappings keyed by section and virtual field.

    Structure: { section_key: { virtual_field_key: { target_key: source_key } } }
    """
    result: dict[str, dict[str, dict[str, str]]] = {}
    for section in SCHEMA_SECTIONS:
        mappings: dict[str, dict[str, str]] = {}
        for field in section["fields"]:
            if field.get("virtual") and field.get("refAutoFill"):
                mappings[field["key"]] = field["refAutoFill"]
        if mappings:
            result[section["key"]] = mappings
    return result


def get_section_groups() -> list[dict]:
    """Return sections grouped for navigation.

    Each group has a "label" and a "sections" list.
    """
    group_defs = [
        ("Организация и регистрация", ["sti", "sti_licenses", "oti"]),
        ("Ответственные лица", ["persons", "post_staff"]),
        ("Оценки и планы", ["assessments", "security_plans"]),
        ("Территория и акватория", ["land", "land_summary", "aquatories", "climate_context"]),
        ("Грузы и операции", ["cargo", "cargo_summary", "cargo_turnover", "oti_operations", "opo"]),
        ("Инфраструктура и зоны", ["infrastructure", "critical_elements", "restricted_access_zones", "zoning"]),
        ("Подразделения и посты", ["ptb", "ptb_contracts", "maintenance_contracts", "ptb_supplementary_agreements", "posts", "post_equipment"]),
        ("Каталог ТСО и экземпляры", ["tsotb_catalog", "tsotb_instances"]),
        ("Каталог ИТС и экземпляры", ["eng_catalog", "eng_instances"]),
    ]
    result = []
    for label, keys in group_defs:
        group_sections = [s for s in SCHEMA_SECTIONS if s["key"] in keys]
        if group_sections:
            result.append({"label": label, "sections": group_sections})
    return result


if __name__ == "__main__":
    total_sections = len(SCHEMA_SECTIONS)
    total_fields = sum(len(s["fields"]) for s in SCHEMA_SECTIONS)
    print(f"Sections: {total_sections}")
    print(f"Total fields: {total_fields}")
    print(f"Section keys: {[s["key"] for s in SCHEMA_SECTIONS]}")
