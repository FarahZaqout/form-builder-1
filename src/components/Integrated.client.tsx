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


const RenderField: React.FC<RenderFieldProps> = ({ field, control, errors, index }) => {
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

// @ts-ignore
const fieldConfigurations = createFieldConfig(frappe2);

const FormComponent: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            {fieldConfigurations.map((section, index) => (
                // Ensuring the grid takes the full width and setting columns dynamically
                <div key={index} className={`grid gap-4 w-full ${section.fields ? `grid-cols-${section.fields.length}` : 'grid-cols-1'}`}>
                    {section.fields && section.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="max-w-full">
                            <RenderField field={field} control={control} errors={errors} index={fieldIndex} />
                        </div>
                    ))}
                </div>
            ))}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default FormComponent;
