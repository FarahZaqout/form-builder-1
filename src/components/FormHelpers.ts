import { FrappeObject, ExtendedField, Field } from '../Types';
import { DefaultComponents } from './ComponentMap';
import { FIELD_TYPES } from '../constants';
import * as yup from 'yup';

export function getComponent(fieldType: string): React.ComponentType<{ field: any, config: ExtendedField }> {
    const fieldName = fieldType.toLowerCase();
    return DefaultComponents[fieldName] || DefaultComponents[FIELD_TYPES.DEFAULT_FALLBACK_COMPONENT];
}

function processFields(fields: any[], currentSection: ExtendedField | null, currentSubsection: ExtendedField | null, configurations: ExtendedField[]): void {
    fields.forEach(field => {
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

        switch (field.fieldtype.toLowerCase()) {
            case FIELD_TYPES.SECTION_BREAK:
                if (currentSection) {
                    if (currentSubsection) {
                        currentSection.fields!.push(currentSubsection);
                    }
                    configurations.push(currentSection);
                }
                currentSection = { ...extendedField, fields: [] };
                currentSubsection = { ...extendedField, fields: [] };
                break;
            case FIELD_TYPES.COLUMN_BREAK:
                if (currentSection && currentSubsection) {
                    currentSection.fields!.push(currentSubsection);
                    currentSubsection = { ...extendedField, fields: [] };
                }
                break;
            default:
                if (currentSubsection) {
                    currentSubsection.fields!.push(extendedField);
                }
                break;
        }
    });

    // Handle the last section and subsection
    if (currentSection) {
        // @ts-ignore
        if (currentSubsection && currentSubsection.fields.length > 0) {
            currentSection.fields!.push(currentSubsection);
        }
        configurations.push(currentSection);
    }
}


export function createFieldConfig(formFields: FrappeObject): ExtendedField[] {
    const configurations: ExtendedField[] = [];
    let currentSection: ExtendedField | null = null;
    let currentSubsection: ExtendedField | null = null;

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
                if (currentSection) {
                    if (currentSubsection) {
                        currentSection.fields!.push(currentSubsection);
                        currentSubsection = null;  // Ensure the subsection is reset after pushing
                    }
                    configurations.push(currentSection);
                }
                // Start a new section and a new subsection
                currentSection = { ...extendedField, fields: [] };
            } else if (field.fieldtype.toLowerCase() === FIELD_TYPES.COLUMN_BREAK) {
                if (currentSection) {
                    if (currentSubsection) {
                        currentSection.fields!.push(currentSubsection);
                    }
                    // Start a new subsection upon column break
                    currentSubsection = { ...extendedField, fields: [] };
                } else {
                    // Create a new section if none exists and start the subsection
                    currentSection = { fieldtype: FIELD_TYPES.SECTION_BREAK, fields: [] };
                    currentSubsection = { ...extendedField, fields: [] };
                    currentSection.fields!.push(currentSubsection);
                }
            } else {
                if (currentSubsection) {
                    currentSubsection.fields!.push(extendedField);
                } else if (currentSection) {
                    // If no subsection has started, add the field directly to the section
                    currentSection.fields!.push(extendedField);
                } else {
                    // Start a new section if there is no current section
                    currentSection = { fieldtype: FIELD_TYPES.SECTION_BREAK, fields: [extendedField] };
                }
            }
        });
    });

    // Push the last section and subsection if they exist
    if (currentSection) {
        if (currentSubsection) {
            currentSection.fields!.push(currentSubsection);
        }
        configurations.push(currentSection);
    }

    return configurations;
}



export function countColumnBreaks(fields: ExtendedField[]): number {
    // This function assumes fields array does not include the 'Section Break' itself
    return fields.reduce((count, field) => count + (field.fieldtype === FIELD_TYPES.COLUMN_BREAK ? 1 : 0), 0);
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
