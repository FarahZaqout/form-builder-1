'use client';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { createFieldConfig, hasFileUploadField, countColumnBreaks, buildYupValidationSchema } from './FormHelpers';
import { RenderField } from './RenderField';
import { CustomComponents, ExtendedField } from '../Types';
import { FORM_ENCTYPE, FIELD_TYPES } from '../constants';
import {yupResolver} from '@hookform/resolvers/yup';

interface FormComponentProps {
    componentMap: CustomComponents;
    frappeObject: any
}

const renderFields = (fields: ExtendedField[], control: any, errors: any, componentMap: CustomComponents) => {
    return fields.map((field, index) => {
        if (field.fields && field.fields.length > 0) {
            // Recursive call if the field itself contains fields (subsections)
            return (
                <div key={index}>
                    {renderFields(field.fields, control, errors, componentMap)}
                </div>
            );
        } else {
            // Render the field directly if there are no nested fields
            return (
                <RenderField key={index} field={field} control={control} errors={errors} index={index} componentMap={componentMap} />
            );
        }
    });
};

function hasMultipleSubsections(section: ExtendedField): boolean {
    if (!section.fields || section.fields.length === 0) {
        return false; // No fields or subsections present
    }

    // Count the subsections by filtering fields where fieldtype matches COLUMN_BREAK
    const subsectionCount = section.fields.filter(field => field.fieldtype.toLowerCase() === FIELD_TYPES.COLUMN_BREAK).length;

    return subsectionCount > 1;
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

    console.log({fieldConfigurations});

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
                        {Boolean(section.fields && section.fields.length) ? renderFields(section.fields!, control, errors, componentMap) : (
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
