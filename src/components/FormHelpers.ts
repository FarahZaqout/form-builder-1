import { FrappeObject, ExtendedField, Field } from '../Types';
import { DefaultComponents } from './ComponentMap';

export function getComponent(fieldType: string): React.ComponentType<{ field: any, config: Field }> {
    return DefaultComponents[fieldType] || DefaultComponents.Text;
}

export function createFieldConfig(formFields: FrappeObject): ExtendedField[] {
    const configurations: ExtendedField[] = [];
    let currentSection: ExtendedField | null = null;

    formFields.docs.forEach(doc => {
        doc.fields.forEach((field: any) => {
            const extendedField: ExtendedField = { ...field };

            if (field.fieldtype === 'Section Break') {
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
    return fields.reduce((count, field) => count + (field.fieldtype === 'Column Break' ? 1 : 0), 0);
}

export function hasFileUploadField(fields: ExtendedField[]): boolean {
    return fields.some(field => field.fieldtype === 'FileUpload');
}