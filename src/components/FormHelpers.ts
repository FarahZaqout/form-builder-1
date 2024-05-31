import { FrappeObject, ExtendedField, Field } from '../Types';
import { DefaultComponents } from './ComponentMap';
import { FIELD_TYPES } from '../constants';
import * as yup from 'yup';

export function getComponent(fieldType: string): React.ComponentType<{ field: any, config: ExtendedField }> {
    const fieldName = fieldType.toLowerCase();
    return DefaultComponents[fieldName] || DefaultComponents[FIELD_TYPES.DEFAULT_FALLBACK_COMPONENT];
}

export function createFieldConfig(formFields: FrappeObject): ExtendedField[] {
    const configurations: ExtendedField[] = [];

    // Initialize the first default section
    let currentSection: ExtendedField = {
        disabled: false,
        required: false,
        placeholder: '',
        fieldtype: FIELD_TYPES.SECTION_BREAK,
        fieldname: 'default_section',
        label: 'Default Section',
        length: 0,
        non_negative: false,
        default: "",
        hidden: false,
        options: "",
        fields: []
    };

    let currentSubsection: ExtendedField = {
        disabled: false,
        required: false,
        placeholder: '',
        fieldtype: FIELD_TYPES.COLUMN_BREAK,  // Assuming subsections are differentiated by column breaks
        fieldname: 'initial_subsection',
        label: 'Initial Subsection',
        length: 0,
        non_negative: false,
        default: "",
        hidden: false,
        options: "",
        fields: []  // This will hold the actual fields
    };

    formFields.docs.forEach(doc => {
        doc.fields.forEach((field: any) => {
            const extendedField: ExtendedField = {
                disabled: Boolean(field.read_only),
                required: Boolean(field.reqd),
                placeholder: field.label || field.fieldname,
                fieldtype: field.fieldtype,
                fieldname: field.fieldname,
                label: field.label,
                length: field.length,
                non_negative: field.non_negative,
                default: field.default,
                hidden: field.hidden,
                options: field.options,
                fields: []  // Initialize fields array for subsections
            };

            if (field.fieldtype.toLowerCase() === FIELD_TYPES.SECTION_BREAK) {
                if (currentSection.fields.length > 0) { // Check if the current section has any fields
                    if (currentSubsection) {
                        currentSection.fields.push(currentSubsection);
                        currentSubsection = null;
                    }
                    configurations.push(currentSection);
                }
                currentSection = { ...extendedField, fields: [] };
            } else if (field.fieldtype.toLowerCase() === FIELD_TYPES.COLUMN_BREAK) {
                if (currentSubsection) {
                    currentSection.fields.push(currentSubsection);
                }
                currentSubsection = { ...extendedField, fields: [] };
            } else {
                if (currentSubsection) {
                    currentSubsection.fields.push(extendedField);
                } else {
                    currentSection.fields.push(extendedField);
                }
            }
        });
    });

    // Push the last section and subsection if they exist
    if (currentSubsection) {
        currentSection.fields.push(currentSubsection);
    }
    if (currentSection.fields.length > 0) {
        configurations.push(currentSection);
    }

    return configurations;
}

export function hasFileUploadField(fields: ExtendedField[]): boolean {
    return fields.some(field => field.fieldtype === FIELD_TYPES.FILE_UPLOAD);
}

// Utility function to build Yup validation schema based on the field configuration
export function buildYupValidationSchema(fieldConfigurations: ExtendedField[]) {
    let schemaFields: {[key: string]: yup.NumberSchema | yup.StringSchema | yup.DateSchema | yup.MixedSchema} = {};
    let validator: yup.NumberSchema | yup.StringSchema | yup.DateSchema | yup.MixedSchema;

    fieldConfigurations.forEach(section => {
        if (section.fields) {
            section.fields.forEach(field => {
                switch (field.fieldtype) {
                    case 'email':
                        validator = yup.string().email('Enter a valid email');
                        break;
                    case 'number':
                    case 'currency':
                    case 'duration':
                    case 'percent':
                        validator = yup.number().typeError('Enter a valid number');
     
                        if (field.non_negative) {
                            validator = validator.min(0, 'Value must be non-negative');
                        }   
                        break;
                    case 'float':
                        validator = yup.number().typeError('Enter a valid float');
                        break;
                    case 'integer':
                        validator = yup.number().integer('Enter a valid integer').typeError('Enter a valid integer');
                        break;
                    case 'phone':
                        validator = yup.string().test(
                            'phone',
                            'Invalid phone number format',
                            (value: string | undefined) => value ? /^\+[1-9]\d{1,14}$/.test(value) : true
                          ).test(
                            'phone-format',
                            'Please include a valid country code with the phone number',
                            (value: string | undefined) => {
                              if (!value) return true; // Pass validation if no value is provided, let `required` handle emptiness
                              return value.startsWith('+') && /^\+\d+$/.test(value);
                            }
                          );
                        break;
                    case 'date':
                        validator = yup.date().typeError('Enter a valid date');
                        break;
                    case 'datetime':
                        validator = yup.date().typeError('Enter a valid date and time');
                        break;
                    case 'password':
                        validator = yup.string().min(8, 'Password is too short - should be 8 chars minimum.');
                        break;
                    default:
                        validator = yup.string().max(field.length, 'Password is too short - should be 8 chars minimum.');
                        break;
                }

                if (field.required) validator = validator.required('This field is required');
                if (field.non_negative) validator = validator.min(0);
                if (field.length) validator = validator.min(field.length);


                schemaFields[field.fieldname] = validator;
            });
        }
    });

    return yup.object().shape(schemaFields);
}

export function hasMultipleSubsections(section: ExtendedField): boolean {
    if (!section.fields || section.fields.length === 0) {
        return false; // No fields or subsections present
    }

    // Count the subsections by filtering fields where fieldtype matches COLUMN_BREAK
    const subsectionCount = section.fields.filter(field => field.fieldtype.toLowerCase() === FIELD_TYPES.COLUMN_BREAK).length;

    return subsectionCount > 1;
}
