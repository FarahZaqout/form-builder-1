'use client';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { createFieldConfig, hasFileUploadField, countColumnBreaks } from './FormHelpers';
import { RenderField } from './RenderField';
import { CustomComponents } from './Types';
import { FORM_ENCTYPE } from './constants';

// todo: component map should be passed here, and the RenderField should be hidden from the end user. 
interface FormComponentProps {
    componentMap: CustomComponents;
    frappeObject: any
}

const FormComponent: React.FC<FormComponentProps> = ({ componentMap, frappeObject }) => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const fieldConfigurations = useMemo(() => createFieldConfig(frappeObject), []);

    const containsFileUpload = useMemo(() => {
        return fieldConfigurations.some(section => section.fields && hasFileUploadField(section.fields));
    }, [fieldConfigurations]);

    const onSubmit = (data: any) => {
        console.log(data);
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
