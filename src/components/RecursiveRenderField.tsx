'use client';
import React from 'react';
import { RenderField } from './RenderField';
import { CustomComponents, ExtendedField } from '../Types';

export function RecursiveRenderField(fields: ExtendedField[], control: any, errors: any, componentMap: CustomComponents) {
    return fields.map((field, index) => {
        if (field.fields && field.fields.length > 0) {
            // Recursive call if the field itself contains fields (subsections)
            return (
                <div key={index}>
                    {RecursiveRenderField(field.fields, control, errors, componentMap)}
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
