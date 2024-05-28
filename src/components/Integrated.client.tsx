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
    let currentSection: ExtendedField | null = null;
    let currentColumnCount = 0;

    formFields.docs.forEach(doc => {
        doc.fields.forEach((field: any) => {
            let extendedField: ExtendedField = {...field};

            switch (field.fieldtype) {
                case 'Section Break':
                    if (currentSection) {
                        configurations.push(currentSection);
                    }
                    // Initialize childFields and columnFields as empty arrays on new section
                    currentSection = {...extendedField, childFields: [], columnFields: []};
                    currentColumnCount = 0;
                    break;
                case 'Column Break':
                    if (currentSection && currentSection.columnFields) {
                        currentColumnCount += 1;
                        // Ensure the array for the new column is initialized
                        while (currentSection.columnFields.length <= currentColumnCount) {
                            currentSection.columnFields.push([]);
                        }
                    }
                    break;
                default:
                    if (currentSection) {
                        if (currentColumnCount > 0 && currentSection.columnFields && currentSection.columnFields.length > currentColumnCount) {
                            currentSection.columnFields[currentColumnCount].push(extendedField);
                        } else {
                            if (!currentSection.childFields) {
                                currentSection.childFields = []; // Initialize if not already done
                            }
                            currentSection.childFields.push(extendedField);
                        }
                    } else {
                        configurations.push(extendedField);
                    }
                    break;
            }
        });
    });

    // Push the last section if it exists
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

    const onSubmit = async (data: any) => {
        // send a request here.
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fieldConfigurations.map((section, index) => (
                section.fieldtype === 'Section Break' ? (
                    <div key={index} className="grid gap-4">
                        {section.childFields && section.childFields.map((field, fieldIndex) => (
                            <RenderField key={fieldIndex} field={field} control={control} errors={errors} index={fieldIndex} />
                        ))}
                        {section.columnFields && section.columnFields.map((column, columnIndex) => {
                            if (column.length > 0) {
                                console.log({column: column.length});
                                console.log({name: column[0].fieldname})
                            }
                            return (
                                <div key={columnIndex} className={`grid grid-cols-${column.length + 1} gap-4`}>
                                    {column.map((field, fieldIndex) => (
                                        <RenderField key={fieldIndex} field={field} control={control} errors={errors} index={fieldIndex} />
                                    ))}
                                </div>
                            )
                        })}
                    </div>
                ) : <RenderField key={index} field={section} control={control} errors={errors} index={index} />
            ))}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default FormComponent;