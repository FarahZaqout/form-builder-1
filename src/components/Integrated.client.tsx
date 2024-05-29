'use client';
import { frappe2 } from './frappe2';
import React from 'react';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import {Field, FrappeObject, ExtendedField } from './Types';
import { DefaultComponents } from './ComponentMap';
import './style.css';


// initial working solution.
function getComponent(fieldType: string): React.ComponentType<{ field: any, config: Field }> {
    return DefaultComponents[fieldType] || DefaultComponents.Text;
}

const createFieldConfig = (formFields: FrappeObject): ExtendedField[] => {
    const configurations: ExtendedField[] = [];
    let currentSection: ExtendedField | null = null;  // Correctly typed as ExtendedField | null

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
                // Push field into the fields array of the current section
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

interface RenderFieldProps {
    field: ExtendedField;
    control: any;
    errors: any;
    index: number;
}

// Todo: component map should be passed to the form as props and this function can then run on it.
const RenderField: React.FC<RenderFieldProps> = ({ field, control, errors, index }) => {
    // Check if the field type is 'Column Break' or 'Section Break'
    if (field.fieldtype === 'Column Break' || field.fieldtype === 'Section Break') {
        // Simply return null or some other placeholder if you need to visualize breaks in debugging
        return null; // Or <div>Section Break</div> or similar if you need a visual placeholder
    }
    
    const Component = getComponent(field.fieldtype);
    return (
        <Controller
            key={index}
            name={field.fieldname}
            control={control}
            rules={{ required: field.reqd ? 'This field is required' : false }}
            defaultValue={field.default || ''}
            render={({ field: controllerField }: { field: ControllerRenderProps }) => (
                <div>
                    <Component field={controllerField} config={field} />
                    {errors[field.fieldname] && <span className="text-red-500">{errors[field.fieldname].message}</span>}
                </div>
            )}
        />
    );
};

interface SectionAnalysis {
    sectionBreakCount: number;
    columnsPerSection: number[];
}

function analyzeFrappeObject(frappeObject: FrappeObject): SectionAnalysis {
    let sectionBreakCount = 0;
    let columnsPerSection: number[] = [];
    let currentColumnCount = 0;

    for (const doc of frappeObject.docs) {
        for (const field of doc.fields) {
            if (field.fieldtype.toLowerCase().includes('section')) {
                if (sectionBreakCount > 0) {  // Avoid pushing for the first section found
                    columnsPerSection.push(currentColumnCount);
                }
                sectionBreakCount++;
                currentColumnCount = 0; // Reset column count for the new section
            } else if (field.fieldtype.toLowerCase().includes('column') && sectionBreakCount > 0) {  // Only count if inside a section
                currentColumnCount++;
            }
        }
    }

    // Push the last section's column count if at least one section was encountered
    if (sectionBreakCount > 0) {
        columnsPerSection.push(currentColumnCount);
    }

    return {
        sectionBreakCount,
        columnsPerSection
    };
}

// @ts-ignore
const analysis = analyzeFrappeObject(frappe2);

console.log({analysis})
// @ts-ignore
const fieldConfigurations = createFieldConfig(frappe2);

function countColumnBreaks(fields: ExtendedField[]): number {
    // This function assumes fields array does not include the 'Section Break' itself
    return fields.reduce((count, field) => count + (field.fieldtype === 'Column Break' ? 1 : 0), 0);
}


// todo: component map should be passed here, and the RenderField should be hidden from the end user. 
const FormComponent: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fieldConfigurations.map((section, index) => (
                <div key={index} className={`grid gap-4 w-full ${section.fields ? `grid-cols-${countColumnBreaks(section.fields) + 1}` : 'grid-cols-1'}`}>
                    {section.fields && section.fields.map((field, fieldIndex) => (
                        <RenderField key={fieldIndex} field={field} control={control} errors={errors} index={fieldIndex} />
                    ))}
                </div>
            ))}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default FormComponent;
