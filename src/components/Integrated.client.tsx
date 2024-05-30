'use client';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { createFieldConfig, hasFileUploadField, countColumnBreaks, buildYupValidationSchema } from './FormHelpers';
import { RenderField } from './RenderField';
import { CustomComponents } from './Types';
import { FORM_ENCTYPE } from './constants';
import {yupResolver} from '@hookform/resolvers/yup';

interface FormComponentProps {
    componentMap: CustomComponents;
    frappeObject: any
}

const FormComponent: React.FC<FormComponentProps> = ({ componentMap, frappeObject }) => {
    const fieldConfigurations = useMemo(() => createFieldConfig(frappeObject), []);
    const validationSchema = useMemo(() => buildYupValidationSchema(fieldConfigurations), [fieldConfigurations]);
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const containsFileUpload = useMemo(() => {
        return fieldConfigurations.some(section => section.fields && hasFileUploadField(section.fields));
    }, [fieldConfigurations]);

    const onSubmit = async (data: { [key:string]: any} ) => {
        console.log("Submitting:", data);
        try {
            // replace with process.env link
            const response = await fetch(`http://localhost:4000/api/submit-frappe-form/kurwa`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.json();
            console.log("Response:", responseData);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" 
              encType={containsFileUpload ? FORM_ENCTYPE.MULTIPART : FORM_ENCTYPE.URLENCODED}>
            {fieldConfigurations.map((section, index) => {
                // Check if the section has fields; if not, render the section directly
                return (
                    <div key={index} className={`grid gap-4 w-full ${section.fields ? `grid-cols-${countColumnBreaks(section.fields) + 1}` : 'grid-cols-1'}`}>
                        {Boolean(section?.fields?.length) ? section?.fields?.map((field, fieldIndex) => (
                            <RenderField key={fieldIndex} field={field} control={control} errors={errors} index={fieldIndex} componentMap={componentMap} />
                        )) : (
                            // Render the field directly if there are no nested fields
                            <RenderField key={index} field={section} control={control} errors={errors} index={index} componentMap={componentMap} />
                        )}
                    </div>
                );
            })}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
};

export default FormComponent;
