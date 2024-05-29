import React from 'react';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { ExtendedField, CustomComponents } from './Types';

interface RenderFieldProps {
    field: ExtendedField;
    control: any;
    errors: any;
    index: number;
    componentMap: CustomComponents;
}

export const RenderField: React.FC<RenderFieldProps> = ({ field, control, errors, index, componentMap }) => {
    // Skip rendering for non-interactive field types such as 'Column Break' and 'Section Break'
    if (field.fieldtype === 'Column Break' || field.fieldtype === 'Section Break') {
        return null;
    }
    
    const Component = componentMap[field.fieldtype] || (() => <div>Unsupported field type</div>); // @todo: for debug purposes only. Will remove before release.

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
