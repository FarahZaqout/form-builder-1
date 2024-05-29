import React from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { ExtendedField, CustomComponents } from './Types';
import { FIELD_TYPES, MESSAGES } from './constants';

interface RenderFieldProps {
    field: ExtendedField;
    control: any;
    errors: any;
    index: number;
    componentMap: CustomComponents;
}

export const RenderField: React.FC<RenderFieldProps> = ({ field, control, errors, index, componentMap }) => {
    // Skip rendering for non-interactive field types such as 'Column Break' and 'Section Break'
    if (field.fieldtype === FIELD_TYPES.COLUMN_BREAK || field.fieldtype === FIELD_TYPES.SECTION_BREAK) {
        return null;
    }
    
    const Component = componentMap[field.fieldtype] || componentMap.Text; // @todo: for debug purposes only. Will remove before release.

    return (
        <Controller
            key={index}
            name={field.fieldname}
            control={control}
            rules={{ required: field.reqd ? MESSAGES.FIELD_REQUIRED : false }}
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
