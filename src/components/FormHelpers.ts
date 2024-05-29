import { FrappeObject, ExtendedField, Field } from '../Types';
import { DefaultComponents } from './ComponentMap';
import { FIELD_TYPES } from './constants';
import yup from 'yup';

export function getComponent(fieldType: string): React.ComponentType<{ field: any, config: Field }> {
    return DefaultComponents[fieldType] || DefaultComponents[FIELD_TYPES.DEFAULT_FALLBACK_COMPONENT];
}

export function createFieldConfig(formFields: FrappeObject): ExtendedField[] {
    const configurations: ExtendedField[] = [];
    let currentSection: ExtendedField | null = null;

    formFields.docs.forEach(doc => {
        doc.fields.forEach((field: any) => {
            const extendedField: ExtendedField = { ...field };

            if (field.fieldtype === FIELD_TYPES.SECTION_BREAK) {
                if (currentSection) {
                    configurations.push(currentSection);
                }
                // Reset currentSection with a new section and initialize fields array
                currentSection = { ...extendedField, fields: [] };
            } else if (currentSection) {
                currentSection.fields!.push(extendedField);  // Use non-null assertion as fields is initialized
            } else {
                // Directly push fields that are not part of any section
                configurations.push(extendedField);
            }
        });
    });

    if (currentSection) {
        configurations.push(currentSection);
    }

    return configurations;
};

export function countColumnBreaks(fields: ExtendedField[]): number {
    // This function assumes fields array does not include the 'Section Break' itself
    return fields.reduce((count, field) => count + (field.fieldtype === FIELD_TYPES.COLUMN_BREAK ? 1 : 0), 0);
}

export function hasFileUploadField(fields: ExtendedField[]): boolean {
    return fields.some(field => field.fieldtype === FIELD_TYPES.FILE_UPLOAD);
}


// Utility function to build Yup validation schema based on the field configuration
function buildYupValidationSchema(fieldConfigurations) {
    let schemaFields = {};

    fieldConfigurations.forEach(section => {
        if (section.fields) {
            section.fields.forEach(field => {
                if (field.reqd) {
                    let validator = yup.string().required('This field is required');
                    if (field.fieldtype === 'Email') {
                        validator = validator.email('Enter a valid email');
                    } else if (field.fieldtype === 'Number') {
                        validator = yup.number().required('This field is required').typeError('Enter a valid number');
                    }

                    schemaFields[field.fieldname] = validator;
                }
            });
        }
    });

    return yup.object().shape(schemaFields);
}
