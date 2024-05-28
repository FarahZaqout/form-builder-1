'use client';
import { frappe2 } from './frappe2';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {Field, FrappeObject } from './Types';
import { DefaultComponents } from './ComponentMap';

const createFieldConfig = (formFields: FrappeObject): Field[] => {
    const configurations: Field[] = [];
    formFields.docs.forEach(doc => {
        doc.fields.forEach(field => {
            configurations.push(field);
        });
    });
    return configurations;
};

function getComponent(fieldType: string): React.ComponentType<{ field: any, config: Field }> {
    return DefaultComponents[fieldType] || DefaultComponents.Text;
}

// @ts-ignore
const fieldConfigurations = createFieldConfig(frappe2);

const FormComponent: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fieldConfigurations.map((field, index) => (
                <Controller
                    key={index}
                    name={field.fieldname}
                    control={control}
                    rules={{ required: field.reqd ? 'This field is required' : false }} // todo: introduce a validation rules utility function: Getrules(fieldType).
                    defaultValue={field.default || ''}
                    render={({ field: controllerField }) => {
                        const Component = getComponent(field.fieldtype);
                        return (
                            <div>
                                <Component field={controllerField} config={field} />
                                {errors[field.fieldname] && <span className="text-red-500">{errors[field.fieldname].message}</span>}
                            </div>
                        );
                    }}
                />
            ))}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default FormComponent;
