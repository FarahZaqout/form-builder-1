'use client';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { createFieldConfig, hasFileUploadField, hasMultipleSubsections, buildYupValidationSchema } from './FormHelpers';
import { RenderField } from './RenderField';
import { CustomComponents, ExtendedField } from '../Types';
import { FORM_ENCTYPE } from '../constants';
import {yupResolver} from '@hookform/resolvers/yup';
import { RecursiveRenderField } from './RecursiveRenderField';

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
        try {
            // replace with process.env link
            await fetch(`http://localhost:4000/api/submit-frappe-form/kurwa`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType={containsFileUpload ? FORM_ENCTYPE.MULTIPART : FORM_ENCTYPE.URLENCODED}>
            {fieldConfigurations.map((section, index) => {
                const shouldDisplayAsGrid = hasMultipleSubsections(section)
                return (
                    <div key={index} className={shouldDisplayAsGrid ? `grid gap-4 w-full grid-cols-${section?.fields?.length || 1}`: ""}>
                        {Boolean(section.fields && section.fields.length) ? RecursiveRenderField(section.fields!, control, errors, componentMap) : (
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
